import { Routes, Route } from "react-router-dom";
import { JSX, useEffect } from "react";

import HelpdeskFeedPage from "./pages/HelpdeskFeedPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App(): JSX.Element {
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
      <Route path="/question/:id" element={<QuestionDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
