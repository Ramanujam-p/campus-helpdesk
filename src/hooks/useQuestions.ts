import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  QueryConstraint,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";
import { db } from "../fireconnection";
import { useAuthContext } from "./useAuth";

/* ================= TYPES ================= */

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level?: string;
  userId: string;
  views: number;
  upvotes: number;
  status?: "open" | "closed";
  createdAt?: unknown;
  updatedAt?: unknown;
}

interface UseQuestionsOptions {
  userId?: string;
  onlyOpen?: boolean;
  limit?: number;
  realtime?: boolean;
}

interface UseQuestionsReturn {
  questions: Question[];
  question: Question | null;
  loading: boolean;
  error: string | null;
  createQuestion: (data: Omit<Question, "id" | "userId" | "views" | "upvotes">) => Promise<string>;
  updateQuestion: (id: string, data: Partial<Question>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  incrementUpvotes: (id: string) => Promise<void>;
  clearError: () => void;
}

/* ================= HOOK ================= */

export function useQuestions(
  questionId: string | null = null,
  options?: UseQuestionsOptions
): UseQuestionsReturn {
  const { user } = useAuthContext();

  const [questions, setQuestions] = useState < Question[] > ([]);
  const [question, setQuestion] = useState < Question | null > (null);
  const [loading, setLoading] = useState < boolean > (true);
  const [error, setError] = useState < string | null > (null);

  /* ---------- BUILD QUERY ---------- */

  const buildQuery = useCallback(() => {
    const baseRef = collection(db, "questions");
    const constraints: QueryConstraint[] = [];

    if (options?.userId) {
      constraints.push(where("userId", "==", options.userId));
    }

    if (options?.onlyOpen) {
      constraints.push(where("status", "==", "open"));
    }

    constraints.push(orderBy("createdAt", "desc"));

    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    return query(baseRef, ...constraints);
  }, [options?.userId, options?.onlyOpen, options?.limit]);

  /* ---------- FETCH / LISTEN ---------- */

  useEffect(() => {
    setLoading(true);
    setError(null);

    /* ----- SINGLE QUESTION MODE ----- */
    if (questionId) {
      const ref = doc(db, "questions", questionId);

      const unsubscribe = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            setQuestion({ id: snap.id, ...(snap.data() as DocumentData) } as Question);
          } else {
            setQuestion(null);
            setError("Question not found");
          }
          setLoading(false);
        },
        (err: FirestoreError) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    }

    /* ----- LIST MODE ----- */
    const q = buildQuery();

    if (options?.realtime === false) {
      getDocs(q)
        .then((snap) => {
          const data: Question[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DocumentData),
          })) as Question[];

          setQuestions(data);
          setLoading(false);
        })
        .catch((err: FirestoreError) => {
          setError(err.message);
          setLoading(false);
        });

      return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data: Question[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as DocumentData),
        })) as Question[];

        setQuestions(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [questionId, buildQuery, options?.realtime]);

  /* ---------- CREATE ---------- */

  const createQuestion = useCallback(
    async (
      data: Omit<Question, "id" | "userId" | "views" | "upvotes">
    ): Promise<string> => {
      if (!user) throw new Error("Login required");

      const docRef = await addDoc(collection(db, "questions"), {
        ...data,
        userId: user.uid,
        views: 0,
        upvotes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    },
    [user]
  );

  /* ---------- UPDATE ---------- */

  const updateQuestion = useCallback(
    async (id: string, data: Partial<Question>): Promise<void> => {
      if (!user) throw new Error("Login required");

      const ref = doc(db, "questions", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) throw new Error("Question not found");
      if (snap.data().userId !== user.uid)
        throw new Error("Unauthorized");

      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [user]
  );

  /* ---------- DELETE ---------- */

  const deleteQuestion = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error("Login required");

      const ref = doc(db, "questions", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) throw new Error("Question not found");
      if (snap.data().userId !== user.uid)
        throw new Error("Unauthorized");

      await deleteDoc(ref);
    },
    [user]
  );

  /* ---------- ENGAGEMENT ---------- */

  const incrementViews = useCallback(async (id: string): Promise<void> => {
    if (!id) throw new Error("Question ID is required");

    const ref = doc(db, "questions", id);
    await updateDoc(ref, { views: increment(1) });
  }, []);

  const incrementUpvotes = useCallback(async (id: string): Promise<void> => {
    if (!id) throw new Error("Question ID is required");

    const ref = doc(db, "questions", id);
    await updateDoc(ref, { upvotes: increment(1) });
  }, []);

  const clearError = (): void => setError(null);

  return {
    questions,
    question,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    incrementViews,
    incrementUpvotes,
    clearError,
  };
}
