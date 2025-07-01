
"use client";

import { useEffect } from 'react';

const loadedFonts = new Set<string>();

export function useGoogleFont(fontFamilies?: string | string[]) {
  // Create a stable key from the font families for the useEffect dependency array
  const fontsKey = JSON.stringify(
    (Array.isArray(fontFamilies) ? fontFamilies : [fontFamilies]).sort()
  );

  useEffect(() => {
    const fonts = Array.isArray(fontFamilies) ? fontFamilies : (fontFamilies ? [fontFamilies] : []);

    const fontsToLoad = fonts.filter((font): font is string => {
      return font && !loadedFonts.has(font);
    });

    if (fontsToLoad.length === 0) {
      return;
    }

    // Load only the unique fonts that haven't been loaded yet
    const uniqueFonts = [...new Set(fontsToLoad)];

    uniqueFonts.forEach(fontFamily => {
      if (fontFamily) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        loadedFonts.add(fontFamily);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsKey]);
}
