"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const QuizPanelContext = createContext(null);

export function QuizPanelProvider({ children }) {
  const [panelState, setPanelState] = useState({
    open: false,
    trackId: "",
    milestoneId: "",
    milestoneTitle: "",
  });

  const openQuiz = useCallback((payload) => {
    setPanelState({
      open: true,
      trackId: payload.trackId,
      milestoneId: payload.milestoneId,
      milestoneTitle: payload.milestoneTitle,
    });
  }, []);

  const closeQuiz = useCallback(() => {
    setPanelState((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      panelState,
      openQuiz,
      closeQuiz,
    }),
    [panelState, openQuiz, closeQuiz]
  );

  return <QuizPanelContext.Provider value={value}>{children}</QuizPanelContext.Provider>;
}

export function useQuizPanel() {
  const context = useContext(QuizPanelContext);
  if (!context) {
    throw new Error("useQuizPanel must be used within QuizPanelProvider");
  }
  return context;
}
