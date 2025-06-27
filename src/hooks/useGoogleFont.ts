"use client";

import { useEffect } from 'react';

const loadedFonts = new Set<string>();

export function useGoogleFont(fontFamily: string) {
  useEffect(() => {
    if (fontFamily && !loadedFonts.has(fontFamily)) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
      link.rel = 'stylesheet';
      
      document.head.appendChild(link);
      loadedFonts.add(fontFamily);
    }
  }, [fontFamily]);
}
