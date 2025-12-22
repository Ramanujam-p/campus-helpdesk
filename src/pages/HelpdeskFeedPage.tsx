import { useState, JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import QuestionSkeleton from "../components/QuestionSkeleton";
import AskQuestion from "./AskQuestion";

/* -------------------- TYPES -------------------- */
type SortOption = "newest" | "popular" | "unanswered";

interface Question {
  id: string;                 // ✅ Firestore ID is string
  title: string;
  description: string;
  author: string;
  tags: string[];
  answers: unknown[];
  views: number;
  createdAt: string;          // ISO string from Firestore
}

/* -------------------- COMPONENT -------------------- */
function HelpdeskFeedPage(): JSX.Element {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showAskModal, setShowAskModal] = useState(false);

  const navigate = useNavigate();

  /* ✅ GET DATA FROM FIREBASE */
  const { questions, loading } = useQuestions();

  /* =========================
     FILTER QUESTIONS
  ========================= */
  const filteredQuestions = (questions as Question[]).filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     SORT QUESTIONS
  ========================= */
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sort === "popular") return b.views - a.views;
    if (sort === "unanswered") return a.answers.length - b.answers.length;

    // ✅ newest (by date)
    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-6 py-4 shadow-md">
          <button
            onClick={() => navigate("/profile")}
            className="text-white text-3xl hover:scale-110 transition"
            title="Profile"
          >
            👤
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Helpdesk Feed
          </h1>

          <button
            onClick={() => setShowAskModal(true)}
            className="ml-auto bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-50 hover:scale-105 transition"
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
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <QuestionSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && sortedQuestions.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg font-semibold">No questions found 😕</p>
            <p className="text-sm mt-2">
              Try different keywords or clear the search
            </p>
          </div>
        )}

        {/* ===== QUESTION LIST ===== */}
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

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span>👤 {q.author}</span>
                <span>💬 {q.answers.length} answers</span>
                <span>👁️ {q.views} views</span>
                <span>⏰ {q.createdAt}</span>
              </div>
            </div>
          ))}
      </div>

      {/* ===== ASK QUESTION MODAL ===== */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <AskQuestion onClose={() => setShowAskModal(false)} />
        </div>
      )}
    </div>
  );
}

export default HelpdeskFeedPage;
