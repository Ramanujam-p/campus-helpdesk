import { Routes, Route } from "react-router-dom";
import HelpdeskFeedPage from "./pages/HelpdeskFeedPage";
import AskQuestionPage from "./pages/AskQuestionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HelpdeskFeedPage />} />
      <Route path="/ask" element={<AskQuestionPage />} />
    </Routes>
  );
}

export default App;
