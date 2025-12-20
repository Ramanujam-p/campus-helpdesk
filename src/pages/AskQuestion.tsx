import { JSX, useState } from "react";

/* -------------------- CONSTANT DATA -------------------- */
const TAGS: string[] = [
  "Java",
  "C++",
  "JavaScript",
  "React",
  "DSA",
  "Database",
  "OS",
  "CN",
  "AI",
  "Web",
];

const SKILL_LEVELS: string[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

/* -------------------- TYPES -------------------- */
interface Errors {
  title?: string;
  description?: string;
  tags?: string;
  level?: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  author: string;
  tags: string[];
  level: string;
  answers: unknown[];
  views: number;
  createdAt: string;
}

/* -------------------- PROPS -------------------- */
interface AskQuestionProps {
  onClose: () => void;
}

/* -------------------- COMPONENT -------------------- */
export default function AskQuestion({
  onClose,
}: AskQuestionProps): JSX.Element {

  /* -------------------- STATE -------------------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [level, setLevel] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  /* -------------------- TAG HANDLER -------------------- */
  const toggleTag = (tag: string): void => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (description.trim().length < 20) {
      newErrors.description =
        "Description must be at least 20 characters";
    }

    if (tags.length === 0) {
      newErrors.tags = "Select at least one tag";
    }

    if (!level) {
      newErrors.level = "Select a skill level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;

    const newQuestion: Question = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      author: "You",
      tags,
      level,
      answers: [],
      views: 0,
      createdAt: "Just now",
    };

    const existingQuestions: Question[] =
      JSON.parse(localStorage.getItem("questions") || "[]");

    localStorage.setItem(
      "questions",
      JSON.stringify([newQuestion, ...existingQuestions])
    );

    setSuccess(true);

    setTimeout(() => {
      onClose(); // ✅ close modal
    }, 1500);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 font-medium">
          ✅ Question posted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <div>
          <input
            type="text"
            maxLength={100}
            placeholder="Question title"
            value={title}
            disabled={success}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-red-500">{errors.title}</span>
            <span className="text-gray-500">{title.length}/100</span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <textarea
            rows={5}
            maxLength={2000}
            placeholder="Describe your problem in detail..."
            value={description}
            disabled={success}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          <div className="flex justify-between text-sm mt-1">
            <span className="text-red-500">{errors.description}</span>
            <span className="text-gray-500">{description.length}/2000</span>
          </div>
        </div>

        {/* TAGS */}
        <div>
          <p className="font-medium mb-1">Tags (max 5)</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                disabled={success}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  tags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {errors.tags && (
            <p className="text-sm text-red-500 mt-1">{errors.tags}</p>
          )}
        </div>

        {/* SKILL LEVEL */}
        <div>
          <p className="font-medium mb-1">Skill Level</p>
          <div className="flex gap-2 flex-wrap">
            {SKILL_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                disabled={success}
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1 rounded-lg border ${
                  level === lvl
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          {errors.level && (
            <p className="text-sm text-red-500 mt-1">{errors.level}</p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            disabled={success}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={success}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
