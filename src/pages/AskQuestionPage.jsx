import { useNavigate } from "react-router-dom";

function AskQuestionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Ask a Question
        </h2>

        <input
          type="text"
          placeholder="Question title"
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Describe your problem..."
          className="w-full border rounded-lg px-4 py-2 mb-4 h-32 focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            ← Back
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

export default AskQuestionPage;
