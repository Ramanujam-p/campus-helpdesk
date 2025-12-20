import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import HelpdeskFeedPage from "./pages/HelpdeskFeedPage";
import AskQuestionPage from "./pages/AskQuestion";
import QuestionDetailPage from "./pages/QuestionDetailPage";

function App() {
  useEffect(() => {
    const existingUser = localStorage.getItem("user");

    if (!existingUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "u1",
          name: "Ramanujam P",
          email: "ramanujam@example.com",
          skillLevel: "Intermediate",
          interests: ["Java", "DSA", "React"],
        })
      );
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HelpdeskFeedPage />} />
      <Route path="/ask" element={<AskQuestionPage />} />
      <Route path="/question/:id" element={<QuestionDetailPage />} />
    </Routes>
  );
}

export default App;
