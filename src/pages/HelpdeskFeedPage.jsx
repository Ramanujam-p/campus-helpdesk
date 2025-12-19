import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questions as mockQuestions } from "../mocks/data";

function HelpdeskFeedPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const navigate = useNavigate();

  // Filter questions
  const filteredQuestions = mockQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
  );

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sort === "popular") return b.views - a.views;
    if (sort === "unanswered") return a.answers - b.answers;
    return b.id - a.id; // newest
  });

  return (
   <div className="min-h-screen bg-blue-50">

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ===== HEADER ===== */}
        <div
          className="
            flex flex-col sm:flex-row sm:items-center
            gap-4 mb-8
            bg-gradient-to-r from-blue-600 to-indigo-600
            rounded-xl px-6 py-4 shadow-md
          "
        >
          {/* Title with after: underline animation */}
          <h1
            className="
              relative text-2xl sm:text-3xl font-bold text-white
              after:content-['']
              after:absolute after:left-0 after:-bottom-1
              after:w-full after:h-[3px]
              after:bg-white
              after:scale-x-0 after:origin-left
              after:transition-transform after:duration-300
              hover:after:scale-x-100
            "
          >
            Helpdesk Feed
          </h1>

          {/* Ask Question Button */}
          <button
            onClick={() => navigate("/ask")}
            className="
              sm:ml-auto
              bg-white text-blue-700
              px-6 py-2 rounded-lg font-semibold
              shadow-md
              hover:bg-blue-50 hover:scale-105 hover:shadow-lg
              transition-all duration-200
            "
          >
            + Ask Question
          </button>
        </div>

        {/* ===== SEARCH & SORT ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            className="
              sm:col-span-2
              border border-gray-300
              rounded-lg px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="
              border border-gray-300
              rounded-lg px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {sortedQuestions.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-lg font-medium">No questions found 😕</p>
            <p className="text-sm mt-2">Try changing your search keywords</p>
          </div>
        )}

        {/* ===== QUESTION CARDS ===== */}
        {sortedQuestions.map((q) => (
          <div
            key={q.id}
            className="
              bg-white/90 backdrop-blur
              rounded-xl p-6 mb-6
              shadow hover:shadow-lg
              transition-all duration-200
              hover:-translate-y-1
              cursor-pointer
            "
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {q.title}
            </h2>

            <p className="text-sm text-gray-600">
              {q.description.substring(0, 100)}...
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {q.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="
                    bg-blue-100 text-blue-700
                    text-xs font-semibold
                    px-3 py-1 rounded-full
                  "
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
              <span>👤 {q.author}</span>
              <span>💬 {q.answers} answers</span>
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
