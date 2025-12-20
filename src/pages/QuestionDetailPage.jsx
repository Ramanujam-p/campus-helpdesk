import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { questions } from "../mocks/data";

function QuestionDetailPage() {
  const { id } = useParams();        // ✅ READ ID FROM URL
  const navigate = useNavigate();

  // ✅ Find correct question
  const foundQuestion = questions.find(
    (q) => String(q.id) === id
  );

  const [question, setQuestion] = useState(foundQuestion);
  const [newAnswer, setNewAnswer] = useState("");

  // ❌ If ID is invalid
  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">
          ← Back
        </button>
        <p className="text-red-500">Question not found</p>
      </div>
    );
  }

  // Handle Answer Submit
  const handleSubmit = () => {
    if (newAnswer.trim().length < 20) {
      alert("Answer must be at least 20 characters");
      return;
    }

    const answerObj = {
      text: newAnswer,
      author: "You",
      createdAt: "Just now",
    };

    setQuestion({
      ...question,
      answers: [...question.answers, answerObj],
    });

    setNewAnswer("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-4xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-4"
      >
        ← Back
      </button>

      {/* Question Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-3">{question.title}</h1>

        <p className="text-gray-700 mb-4">
          {question.description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 flex gap-4">
          <span>👤 {question.author}</span>
          <span>⏰ {question.createdAt}</span>
          <span>👁️ {question.views} views</span>
        </div>
      </div>

      {/* Answers Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {question.answers.length} Answers
        </h2>

        {question.answers.length === 0 ? (
          <p className="text-gray-500">
            No answers yet. Be the first to answer!
          </p>
        ) : (
          question.answers.map((ans, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              <p className="text-gray-800 mb-2">
                {ans.text}
              </p>
              <div className="text-sm text-gray-500">
                👤 {ans.author} · ⏰ {ans.createdAt}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Answer Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">
          Write Your Answer
        </h3>

        <textarea
          className="w-full border rounded-lg p-3 mb-2"
          rows="4"
          placeholder="Write your answer here..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />

        <p className="text-sm text-gray-400 mb-4">
          Minimum 20 characters
        </p>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
