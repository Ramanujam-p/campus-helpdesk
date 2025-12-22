import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  FirestoreError,
  DocumentData,
} from "firebase/firestore";
import { db } from "../fireconnection";
import { useAuthContext } from "./useAuth";

/* ================= TYPES ================= */

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  content: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  upvotes: number;
  isAccepted: boolean;
}

interface UseAnswersReturn {
  answers: Answer[] | null;
  loading: boolean;
  error: string | null;
  createAnswer: (qId: string, content: string) => Promise<string>;
  updateAnswer: (id: string, content: string) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
  upvoteAnswer: (id: string) => Promise<void>;
  markAsAccepted: (id: string) => Promise<void>;
  clearError: () => void;
}

/* ================= HOOK ================= */

/**
 * useAnswers Hook
 * Manages answers for a specific question
 */
export function useAnswers(questionId: string | null): UseAnswersReturn {
  const { user } = useAuthContext();

  const [answers, setAnswers] = useState<Answer[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- REALTIME LISTENER ---------- */

  useEffect(() => {
    if (!questionId) {
      setAnswers(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "answers"),
      where("questionId", "==", questionId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const docs: Answer[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as DocumentData),
        })) as Answer[];

        setAnswers(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("❌ Answers listener error:", err);
        setError(err.message || "Failed to load answers");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [questionId]);

  /* ---------- CREATE ---------- */

  const createAnswer = useCallback(
    async (qId: string, content: string): Promise<string> => {
      try {
        if (!user) throw new Error("Must be logged in to answer");
        if (!content.trim())
          throw new Error("Answer content cannot be empty");

        setError(null);

        const docRef = await addDoc(collection(db, "answers"), {
          questionId: qId,
          userId: user.uid,
          content,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          upvotes: 0,
          isAccepted: false,
        });

        return docRef.id;
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to create answer";

        setError(errorMsg);
        throw err;
      }
    },
    [user]
  );

  /* ---------- UPDATE ---------- */

  const updateAnswer = useCallback(
    async (id: string, content: string): Promise<void> => {
      try {
        if (!user) throw new Error("Must be logged in to update answer");

        const docRef = doc(db, "answers", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) throw new Error("Answer not found");
        if (snap.data().userId !== user.uid)
          throw new Error("You can only update your own answers");

        setError(null);

        await updateDoc(docRef, {
          content,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to update answer";

        setError(errorMsg);
        throw err;
      }
    },
    [user]
  );

  /* ---------- DELETE ---------- */

  const deleteAnswer = useCallback(
    async (id: string): Promise<void> => {
      try {
        if (!user) throw new Error("Must be logged in to delete answer");

        const docRef = doc(db, "answers", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) throw new Error("Answer not found");
        if (snap.data().userId !== user.uid)
          throw new Error("You can only delete your own answers");

        setError(null);

        await deleteDoc(docRef);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to delete answer";

        setError(errorMsg);
        throw err;
      }
    },
    [user]
  );

  /* ---------- UPVOTE ---------- */

  const upvoteAnswer = useCallback(async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, "answers", id);

      await updateDoc(docRef, {
        upvotes: increment(1),
      });
    } catch (err) {
      console.error("❌ Upvote error:", err);
      throw err;
    }
  }, []);

  /* ---------- MARK AS ACCEPTED ---------- */

  const markAsAccepted = useCallback(
    async (id: string): Promise<void> => {
      try {
        if (!user) throw new Error("Must be logged in");

        const answerRef = doc(db, "answers", id);
        const snap = await getDoc(answerRef);

        if (!snap.exists()) throw new Error("Answer not found");

        setError(null);

        await updateDoc(answerRef, {
          isAccepted: true,
        });
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to mark as accepted";

        setError(errorMsg);
        throw err;
      }
    },
    [user]
  );

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    answers,
    loading,
    error,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    upvoteAnswer,
    markAsAccepted,
    clearError,
  };
}
