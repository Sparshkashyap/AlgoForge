import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { getSubmissionByIdApi } from "@/api/submission.api";
import type { Submission } from "@/types/submission.types";

const isFinalStatus = (status?: string | null) => {
  const value = String(status || "").toUpperCase();
  return ["COMPLETED", "FAILED"].includes(value);
};

export const useSubmission = (submissionId?: string | null) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    if (!submissionId) {
      setSubmission(null);
      return;
    }

    let mounted = true;

    const fetchSubmission = async () => {
      try {
        if (!mounted) return;
        const response = await getSubmissionByIdApi(submissionId);

        if (!mounted) return;
        setSubmission(response.data);

        if (isFinalStatus(response.data?.status) && pollingRef.current) {
          window.clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch {
        // noop
      }
    };

    setLoading(true);
    void fetchSubmission().finally(() => {
      if (mounted) {
        setLoading(false);
      }
    });

    pollingRef.current = window.setInterval(() => {
      void fetchSubmission();
    }, 2500);

    const handleSubmissionUpdate = (incoming: Submission) => {
      if (incoming?.id !== submissionId) return;

      setSubmission(incoming);

      if (isFinalStatus(incoming?.status) && pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    socket.on("submission:update", handleSubmissionUpdate);

    return () => {
      mounted = false;

      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      socket.off("submission:update", handleSubmissionUpdate);
    };
  }, [submissionId]);

  return {
    submission,
    loading,
  };
};