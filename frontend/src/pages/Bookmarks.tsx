// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Navbar } from "@/components/Navbar";
// import ProblemCard from "@/components/ProblemCard";
// import { getMyBookmarksApi } from "@/api/bookmark.api";
// import type { Problem } from "@/types/problem.types";

// export default function Bookmarks() {
//   const [bookmarks, setBookmarks] = useState<Problem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadBookmarks = async () => {
//       try {
//         const data = await getMyBookmarksApi();
//         setBookmarks(data.data || []);
//       } catch {
//         setBookmarks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBookmarks();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <motion.div
//         initial={{ opacity: 0, y: 14 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="container py-12"
//       >
//         <h1 className="font-heading text-4xl font-bold">Bookmarks</h1>
//         <p className="mt-2 text-muted-foreground">
//           Problems you saved for later practice.
//         </p>

//         <div className="mt-8">
//           {loading ? (
//             <div className="text-sm text-muted-foreground">
//               Loading bookmarks...
//             </div>
//           ) : bookmarks.length === 0 ? (
//             <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
//               No bookmarks yet. Save problems to revisit them later.
//             </div>
//           ) : (
//             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {bookmarks.map((problem) => (
//                 <ProblemCard key={problem.id} problem={problem} />
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

















import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { listMyBookmarksApi } from "@/api/bookmark.api";

export default function Bookmarks() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    listMyBookmarksApi().then((res) => {
      setItems(res?.data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>

        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/problems/${item.problem.slug}`}
              className="rounded-xl border border-border p-4"
            >
              <p className="font-semibold">{item.problem.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.problem.difficulty}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}