import { JSX, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import {
  Pencil,
  MessageCircle,
  HelpCircle,
  Heart,
  Target,
  Sparkles,
  Check,
  X,
  Calendar,
  Smile,
} from "lucide-react";

/* -------------------- TYPES -------------------- */
interface InterestOption {
  name: string;
  icon: string;
  color: string;
}

interface SkillLevel {
  name: string;
  icon: string;
  description: string;
}

interface Stats {
  questionsAsked: number;
  answersGiven: number;
  helpfulVotes: number;
  daysActive: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

/* -------------------- CONSTANTS -------------------- */
const INTEREST_OPTIONS: InterestOption[] = [
  { name: "Mathematics", icon: "📐", color: "from-blue-400 to-blue-600" },
  { name: "Science", icon: "🔬", color: "from-green-400 to-green-600" },
  { name: "History", icon: "📚", color: "from-amber-400 to-amber-600" },
  { name: "Art", icon: "🎨", color: "from-pink-400 to-pink-600" },
  { name: "Music", icon: "🎵", color: "from-purple-400 to-purple-600" },
  { name: "Computer Science", icon: "💻", color: "from-indigo-400 to-indigo-600" },
  { name: "Literature", icon: "📖", color: "from-rose-400 to-rose-600" },
  { name: "Physics", icon: "⚛️", color: "from-cyan-400 to-cyan-600" },
];

const SKILL_LEVELS: SkillLevel[] = [
  { name: "Just Starting", icon: "🌱", description: "Taking my first steps" },
  { name: "Learning", icon: "📚", description: "Building my knowledge" },
  { name: "Practicing", icon: "🎯", description: "Getting better every day" },
  { name: "Confident", icon: "⭐", description: "Growing more comfortable" },
  { name: "Helping Others", icon: "🤝", description: "Sharing what I know" },
];

/* -------------------- COMPONENT -------------------- */
function ProfilePage(): JSX.Element {
  const [isLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* USER STATE */
  const [name, setName] = useState("Alex Chen");
  const [email] = useState("alexchen@example.com");
  const [bio, setBio] = useState(
    "Curious learner who loves exploring new ideas! 🌟"
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Mathematics",
    "Science",
    "Computer Science",
  ]);
  const [selectedSkillLevel, setSelectedSkillLevel] =
    useState<string>("Learning");

  /* BACKUP STATE FOR CANCEL */
  const [backup, setBackup] = useState({
    name,
    bio,
    selectedInterests,
    selectedSkillLevel,
  });

  const stats: Stats = {
    questionsAsked: 12,
    answersGiven: 8,
    helpfulVotes: 24,
    daysActive: 45,
  };

  /* MOCK RECENT ACTIVITY */
  const recentQuestions = [
    "How to start DSA in 2nd year?",
    "Difference between var, let and const?",
    "Best way to learn React?",
    "What is time complexity?",
    "How recursion works?",
  ];

  const recentAnswers = [
    "Start with arrays and recursion...",
    "Use let and const instead of var...",
    "Follow a structured roadmap...",
    "Time complexity measures performance...",
    "Recursion calls itself...",
  ];

  const toggleInterest = (interest: string): void => {
    if (!isEditing) return;
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleEdit = () => {
    setBackup({
      name,
      bio,
      selectedInterests,
      selectedSkillLevel,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name,
        email,
        bio,
        selectedInterests,
        selectedSkillLevel,
      })
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(backup.name);
    setBio(backup.bio);
    setSelectedInterests(backup.selectedInterests);
    setSelectedSkillLevel(backup.selectedSkillLevel);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <Card className="overflow-hidden shadow-xl relative">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 h-32" />

          <div className="p-8 -mt-16 flex gap-6 items-center">
            <Avatar className="size-32 border-4 border-white shadow-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <AvatarFallback className="text-white text-3xl">
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {isEditing ? (
                <>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                  <Input className="mt-2" value={bio} onChange={(e) => setBio(e.target.value)} />
                </>
              ) : (
                <>
                  <h1 className="text-gray-900">{name}</h1>
                  <p className="text-gray-600">{bio}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                </>
              )}
            </div>

            {!isEditing ? (
              <Button onClick={handleEdit}>
                <Pencil className="mr-2" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Check className="mr-1" /> Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-1" /> Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<HelpCircle />} label="Questions Asked" value={stats.questionsAsked} />
          <StatCard icon={<MessageCircle />} label="Answers Given" value={stats.answersGiven} />
          <StatCard icon={<Heart />} label="Helpful Votes" value={stats.helpfulVotes} />
          <StatCard icon={<Calendar />} label="Days Active" value={stats.daysActive} />
        </div>

        {/* INTERESTS */}
        <Card className="p-8 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-500" /> My Interests
          </h2>
          <div className="flex flex-wrap gap-3">
            {INTEREST_OPTIONS.map((i) => (
              <Badge
                key={i.name}
                onClick={() => toggleInterest(i.name)}
                className={`cursor-pointer ${
                  selectedInterests.includes(i.name)
                    ? `bg-gradient-to-r ${i.color} text-white`
                    : ""
                }`}
              >
                {i.icon} {i.name}
              </Badge>
            ))}
          </div>
        </Card>

        {/* SKILL LEVEL */}
        <Card className="p-8 shadow-xl">
          <h2 className="mb-4 flex items-center gap-2">
            <Target className="text-blue-500" /> My Learning Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SKILL_LEVELS.map((level) => (
              <Button
                key={level.name}
                disabled={!isEditing}
                variant={
                  selectedSkillLevel === level.name ? "default" : "outline"
                }
                onClick={() => setSelectedSkillLevel(level.name)}
              >
                {level.icon} {level.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* RECENT ACTIVITY */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Recent Questions</h3>
            {recentQuestions.map((q, i) => (
              <p key={i} className="text-sm text-gray-600">• {q}</p>
            ))}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Recent Answers</h3>
            {recentAnswers.map((a, i) => (
              <p key={i} className="text-sm text-gray-600">• {a}</p>
            ))}
          </Card>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-600 flex items-center justify-center gap-2">
          <Smile className="text-purple-500" />
          Your progress is something to be proud of 💜
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

/* -------------------- STAT CARD -------------------- */
function StatCard({ icon, label, value }: StatCardProps): JSX.Element {
  return (
    <Card className="p-6 text-center shadow-lg">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </Card>
  );
}
