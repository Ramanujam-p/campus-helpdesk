import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  JSX,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { app } from "../fireconnection";

/* ================= TYPES ================= */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<unknown>;
  login: (email: string, password: string) => Promise<unknown>;
  loginWithGoogle: () => Promise<unknown>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({
  children,
}: AuthProviderProps): JSX.Element {
  const auth = getAuth(app);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- REAL-TIME AUTH LISTENER ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  /* ---------- ONE-TIME AUTH ACTIONS ---------- */

  const signup = async (
    email: string,
    password: string
  ): Promise<unknown> => {
    try {
      setError(null);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<unknown> => {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<unknown> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const clearError = (): void => setError(null);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Prevent UI flicker */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}

