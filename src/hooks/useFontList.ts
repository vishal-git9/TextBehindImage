
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import type React from 'react';

// A curated list of popular Google Fonts
const GOOGLE_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Source Sans Pro',
  'Oswald', 'Raleway', 'Merriweather', 'Nunito', 'Playfair Display', 'Ubuntu',
  'Inter', 'Bebas Neue', 'Lobster', 'Pacifico', 'Anton', 'Caveat', 'Comfortaa',
  'Dancing Script', 'Exo 2', 'Fira Sans', 'Indie Flower', 'Josefin Sans',
  'Kanit', 'League Spartan', 'Maven Pro', 'Noto Sans', 'Quicksand', 'Righteous',
  'Shadows Into Light', 'Teko', 'Varela Round', 'Work Sans', 'Yanone Kaffeesatz',
  'Zilla Slab', 'Abel', 'Abril Fatface', 'Acme', 'Alegreya', 'Alfa Slab One',
  'Amatic SC', 'Archivo', 'Arimo', 'Arvo', 'Asap', 'Assistant', 'Barlow',
  'Bitter', 'Bree Serif', 'Cabin', 'Cairo', 'Cardo', 'Catamaran', 'Chakra Petch',
  'Cinzel', 'Cormorant Garamond', 'Crimson Text', 'Cuprum', 'DM Sans', 'Domine',
  'Dosis', 'EB Garamond', 'Eczar', 'Fjalla One', 'Francois One', 'Fredoka One',
  'Gentium Book Basic', 'Glegoo', 'Heebo', 'Hind', 'IBM Plex Sans',
  'Inconsolata', 'Istok Web', 'Jura', 'Karla', 'Kreon', 'Libre Baskerville',
  'Libre Franklin', 'Lora', 'Mada', 'Manrope', 'Marcellus', 'Martel',
  'Merriweather Sans', 'Monda', 'Mulish', 'Nanum Gothic', 'Old Standard TT',
  'Overpass', 'Oxygen', 'PT Sans', 'PT Serif', 'Patua One', 'Philosopher',
  'Prata', 'Prompt', 'Questrial', 'Rajdhani', 'Red Hat Display', 'Rokkitt',
  'Rosario', 'Ruda', 'Rubik', 'Rufina', 'Sanchez', 'Sarabun', 'Secular One',
  'Signika', 'Slabo 27px', 'Sora', 'Space Grotesk', 'Spectral', 'Syne',
  'Tajawal', 'Taviraj', 'Tinos', 'Titillium Web', 'Trirong', 'Unna', 'Vollkorn',
  'Voltaire', 'Yantramanav'
];

const FONTS_PER_PAGE = 50;

export const useFontList = () => {
  const [fontSearch, setFontSearch] = useState('');
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);
  const [displayedFontsCount, setDisplayedFontsCount] = useState(FONTS_PER_PAGE);

  const filteredFonts = useMemo(() => {
    if (!fontSearch) {
      return GOOGLE_FONTS;
    }
    return GOOGLE_FONTS.filter(font =>
      font.toLowerCase().includes(fontSearch.toLowerCase())
    );
  }, [fontSearch]);

  const displayedFonts = useMemo(() => {
    return filteredFonts.slice(0, displayedFontsCount);
  }, [filteredFonts, displayedFontsCount]);

  const handleFontScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    // Load more fonts when user is near the bottom
    if (target.scrollHeight - target.scrollTop < target.clientHeight + 200) {
      setDisplayedFontsCount(prevCount => Math.min(prevCount + FONTS_PER_PAGE, filteredFonts.length));
    }
  }, [filteredFonts.length]);

  // Reset displayed count when search changes
  useEffect(() => {
    setDisplayedFontsCount(FONTS_PER_PAGE);
  }, [fontSearch]);

  return {
    fontSearch,
    setFontSearch,
    isFontPopoverOpen,
    setIsFontPopoverOpen,
    displayedFonts,
    handleFontScroll,
    filteredFonts,
  };
};
