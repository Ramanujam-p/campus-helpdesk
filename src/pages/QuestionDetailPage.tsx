import { useParams, useNavigate } from "react-router-dom";
import { JSX, useState, useRef } from "react";
import { questions } from "../mocks/data";

/* -------------------- TYPES -------------------- */
interface Answer {
  text: string;
  author: string;
  createdAt: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  author: string;
  tags: string[];
  answers: Answer[];
  views: number;
  createdAt: string;
}

/* -------------------- COMPONENT -------------------- */
function QuestionDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const foundQuestion: Question | undefined = (
    questions as Question[]
  ).find((q) => String(q.id) === id);

  const [question, setQuestion] = useState<Question | undefined>(
    foundQuestion
  );
  const [newAnswer, setNewAnswer] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const answerEndRef = useRef<HTMLDivElement | null>(null);

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 mb-4"
        >
          ← Back
        </button>
        <p className="text-red-500">Question not found</p>
      </div>
    );
  }

  /* -------------------- ANSWER SUBMIT -------------------- */
  const isValidAnswer = newAnswer.trim().length >= 20;

  const handleSubmit = (): void => {
    if (!isValidAnswer) return;

    const answerObj: Answer = {
      text: newAnswer,
      author: "You",
      createdAt: "Just now",
    };

    setQuestion({
      ...question,
      answers: [...question.answers, answerObj],
    });

    setNewAnswer("");
    setSuccessMsg("✅ Answer posted successfully!");

    setTimeout(() => setSuccessMsg(""), 3000);

    // scroll to newly added answer
    setTimeout(() => {
      answerEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
        <h1 className="text-2xl font-bold mb-3">
          {question.title}
        </h1>

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
        <div className="text-sm text-gray-500 flex flex-wrap gap-4">
          <span>👤 {question.author}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
            Question Author
          </span>
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
            No answers yet. Be the first to answer! 🚀
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

        <div ref={answerEndRef}></div>
      </div>

      {/* Write Answer Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">
          Write Your Answer
        </h3>

        <textarea
          className="w-full border rounded-lg p-3 mb-1"
          rows={4}
          placeholder="Write your answer here..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />

        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">
            Minimum 20 characters
          </span>
          <span
            className={
              isValidAnswer ? "text-green-600" : "text-gray-400"
            }
          >
            {newAnswer.length}/20
          </span>
        </div>

        {successMsg && (
          <p className="text-green-600 mb-3 text-sm">
            {successMsg}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValidAnswer}
          className={`px-6 py-2 rounded-lg text-white transition
            ${
              isValidAnswer
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
