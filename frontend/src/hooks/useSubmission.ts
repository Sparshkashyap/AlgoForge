import { useEffect, useRef, useState } from "react";
import getSocket from "@/lib/socket";
import { getSubmissionByIdApi } from "@/api/submission.api";
import type { Submission } from "@/types/submission.types";

const isFinalStatus = (status?: string | null) => {
  const value = String(status || "").toUpperCase();
  return ["COMPLETED", "FAILED"].includes(value);
};

const normalizeSubmission = (response: any): Submission | null => {
  const item = response?.data?.data ?? response?.data ?? response;

  if (!item || !item.id) return null;

  return {
    ...item,
    results: item.results || [],
  };
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
    const socket = getSocket();

    const fetchSubmission = async () => {
      try {
        const response = await getSubmissionByIdApi(submissionId);
        const nextSubmission = normalizeSubmission(response);

        console.log("POLL SUBMISSION:", nextSubmission);

        if (!mounted || !nextSubmission) return;

        setSubmission(nextSubmission);

        if (isFinalStatus(nextSubmission.status) && pollingRef.current) {
          window.clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (error) {
        console.error("Failed to poll submission:", error);
      }
    };

    setLoading(true);

    void fetchSubmission().finally(() => {
      if (mounted) setLoading(false);
    });

    pollingRef.current = window.setInterval(() => {
      void fetchSubmission();
    }, 2500);

    const handleSubmissionUpdate = (incoming: Submission) => {
      if (incoming?.id !== submissionId) return;

      const nextSubmission = {
        ...incoming,
        results: incoming.results || [],
      };

      console.log("SOCKET SUBMISSION:", nextSubmission);

      setSubmission(nextSubmission);

      if (isFinalStatus(nextSubmission.status) && pollingRef.current) {
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