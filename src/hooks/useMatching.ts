import { useState, useCallback } from "react";
import { getMatchedPeers } from "../firebase/matchingService";

/* ================= TYPES ================= */

/**
 * Shape of a matched peer
 * (Adjust fields based on what matchingService returns)
 */
export interface MatchedPeer {
  uid: string;
  name?: string;
  skills?: string[];
  level?: string;
  score?: number;
}

interface UseMatchingReturn {
  matches: MatchedPeer[];
  loading: boolean;
  error: string | null;
  findMatches: (userId: string, limit?: number) => Promise<MatchedPeer[]>;
  clearMatches: () => void;
}

/* ================= HOOK ================= */

export function useMatching(): UseMatchingReturn {
  const [matches, setMatches] = useState<MatchedPeer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Find matching peers for a given user
   */
  const findMatches = useCallback(
    async (userId: string, limit: number = 10): Promise<MatchedPeer[]> => {
      if (!userId) {
        const errMsg = "User ID is required to find matches";
        setError(errMsg);
        throw new Error(errMsg);
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getMatchedPeers(userId, limit);
        setMatches(result as unknown as MatchedPeer[]);

        return result as unknown as MatchedPeer[];
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch matches";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Clear current matches and errors */
  const clearMatches = useCallback((): void => {
    setMatches([]);
    setError(null);
  }, []);

  return {
    matches,
    loading,
    error,
    findMatches,
    clearMatches,
  };
}
