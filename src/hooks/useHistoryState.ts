
"use client";

import { useState, useCallback, useEffect } from 'react';

export const useHistoryState = <T>(initialState: T, storageKey: string) => {
  const [history, setHistory] = useState<{ past: T[], present: T, future: T[] }>({
    past: [],
    present: initialState,
    future: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on initial mount (client-side only)
  useEffect(() => {
    try {
      const savedStateJSON = window.localStorage.getItem(storageKey);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.present) {
          // A simple check to see if the state shape is roughly correct
          if ('texts' in savedState.present && 'imageSrc' in savedState.present) {
             setHistory(savedState);
          }
        }
      }
    } catch (error)
      {/* Do nothing, user might be in a private browser window. */}
     finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const handler = setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(history));
      } catch (error) {
         {/* Do nothing, user might be in a private browser window. */}
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [history, storageKey, isLoaded]);

  const setState = useCallback((action: T | ((prevState: T) => T)) => {
    setHistory(currentHistory => {
      const newPresent = typeof action === 'function' ? (action as (prevState: T) => T)(currentHistory.present) : action;
      
      // Don't update history if state is the same
      if (JSON.stringify(newPresent) === JSON.stringify(currentHistory.present)) {
        return currentHistory;
      }
      
      const newPast = [...currentHistory.past, currentHistory.present];
      // Limit history size to avoid memory issues
      if (newPast.length > 50) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const resetState = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.past.length === 0) {
        return currentHistory;
      }
      const previous = currentHistory.past[currentHistory.past.length - 1];
      const newPast = currentHistory.past.slice(0, currentHistory.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [currentHistory.present, ...currentHistory.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(currentHistory => {
      if (currentHistory.future.length === 0) {
        return currentHistory;
      }
      const next = currentHistory.future[0];
      const newFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, currentHistory.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    state: history.present,
    setState,
    resetState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
