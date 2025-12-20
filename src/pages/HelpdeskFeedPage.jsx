import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questions as mockQuestions } from "../mocks/data";

function HelpdeskFeedPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     LOADING SIMULATION
     (Replace with Firestore later)
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // UX-friendly delay

    return () => clearTimeout(timer);
  }, []);

  /* =========================
     FILTER QUESTIONS
  ========================= */
  const filteredQuestions = mockQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     SORT QUESTIONS (FIXED)
  ========================= */
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sort === "popular") {
      return b.views - a.views; // Most viewed first
    }

    if (sort === "unanswered") {
      return a.answers.length - b.answers.length; // 0 answers first
    }

    return b.id - a.id; // Newest
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-6 py-4 shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Helpdesk Feed
          </h1>

          <button
            onClick={() => navigate("/ask")}
            className="sm:ml-auto bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-50 hover:scale-105 transition"
          >
            + Ask Question
          </button>
        </div>

        {/* ===== SEARCH & SORT ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>

        {/* ===== LOADING STATE ===== */}
        {loading && (
          <div className="flex justify-center mt-20">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ===== NO RESULTS STATE ===== */}
        {!loading && sortedQuestions.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg font-semibold">No questions found 😕</p>
            <p className="text-sm mt-2">
              Try different keywords or clear search
            </p>
          </div>
        )}

        {/* ===== QUESTION CARDS ===== */}
        {!loading &&
          sortedQuestions.map((q) => (
            <div
              key={q.id}
              onClick={() => navigate(`/question/${q.id}`)}
              className="bg-white/90 rounded-xl p-6 mb-6 shadow hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {q.title}
              </h2>

              <p className="text-sm text-gray-600">
                {q.description.substring(0, 100)}...
              </p>

              {/* ===== TAGS (MAX 3 ENFORCED) ===== */}
              <div className="flex flex-wrap gap-2 mt-3">
                {q.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* ===== FOOTER ===== */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span>👤 {q.author}</span>
                <span>💬 {q.answers.length} answers</span>
                <span>👁️ {q.views} views</span>
                <span>⏰ {q.createdAt}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HelpdeskFeedPage;
