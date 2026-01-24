import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface UserProgress {
  solvedQuestions: string[];
  solvedDates: Record<string, string>;
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
}

export const useUserProgress = () => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/user/progress');
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const markQuestionSolved = async (questionId: string) => {
    if (!session) return false;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      });

      if (response.ok) {
        // Update local state
        if (progress && !progress.solvedQuestions.includes(questionId)) {
          const today = new Date().toISOString().split('T')[0];
          setProgress({
            ...progress,
            solvedQuestions: [...progress.solvedQuestions, questionId],
            solvedDates: {
              ...progress.solvedDates,
              [questionId]: today,
            },
            totalSolved: progress.totalSolved + 1,
          });
        }
        return true;
      }
    } catch (error) {
      console.error('Error marking question as solved:', error);
    }
    return false;
  };

  const isQuestionSolved = (questionId: string): boolean => {
    return progress?.solvedQuestions.includes(questionId) || false;
  };

  return {
    progress,
    loading,
    markQuestionSolved,
    isQuestionSolved,
    refetch: fetchProgress,
  };
};