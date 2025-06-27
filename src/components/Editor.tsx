"use client";

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useGoogleFont } from '@/hooks/useGoogleFont';
import EditingPanel from './EditingPanel';
import Canvas from './Canvas';
import { suggestStyle, type SuggestStyleOutput } from '@/ai/flows/suggest-style';
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const { toast } = useToast();
  const [text, setText] = useState('Your Text Here');
  const [fontSize, setFontSize] = useState(72);
  const [fontFamily, setFontFamily] = useState('Bebas Neue');
  const [color, setColor] = useState('#FFFFFF');
  const [textShadow, setTextShadow] = useState('2px 2px 4px #000000');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
  const [imageSrc, setImageSrc] = useState<string>('https://placehold.co/1280x720.png');
  const [aiCategory, setAiCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<SuggestStyleOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const editorAreaRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useGoogleFont(fontFamily);

  const handleDownload = useCallback(() => {
    if (editorAreaRef.current === null) {
      return;
    }
    toPng(editorAreaRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'text-weaver.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        toast({
            variant: "destructive",
            title: "Export Error",
            description: "Sorry, something went wrong while exporting the image.",
        })
      });
  }, [toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAiSuggest = async () => {
    if (!aiCategory) {
        toast({
            variant: "destructive",
            title: "Missing Category",
            description: "Please enter a category for AI suggestions.",
        })
        return;
    }
    setIsLoadingAi(true);
    try {
        const result = await suggestStyle({ category: aiCategory });
        setFontFamily(result.fontFamily);
        setColor(result.colorPalette[0] || '#FFFFFF');
        setAiSuggestions(result);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "AI Suggestion Failed",
            description: "Could not get suggestions. Please try again.",
        })
    } finally {
        setIsLoadingAi(false);
    }
  };
  
  const textStyles: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily: `'${fontFamily}', sans-serif`,
    color: color,
    textShadow: textShadow,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textDecoration: textDecoration,
    padding: '20px'
  };

  const toggleBold = () => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold');
  const toggleItalic = () => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic');
  const toggleUnderline = () => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline');

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <EditingPanel 
        text={text} setText={setText}
        fontSize={fontSize} setFontSize={setFontSize}
        fontFamily={fontFamily} setFontFamily={setFontFamily}
        color={color} setColor={setColor}
        textShadow={textShadow} setTextShadow={setTextShadow}
        fontWeight={fontWeight} toggleBold={toggleBold}
        fontStyle={fontStyle} toggleItalic={toggleItalic}
        textDecoration={textDecoration} toggleUnderline={toggleUnderline}
        aiCategory={aiCategory} setAiCategory={setAiCategory}
        handleAiSuggest={handleAiSuggest}
        isLoadingAi={isLoadingAi}
        aiSuggestions={aiSuggestions}
        handleImageUpload={handleImageUpload}
        handleDownload={handleDownload}
        imageInputRef={imageInputRef}
      />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/30 dark:bg-muted/10">
        <Canvas 
          editorAreaRef={editorAreaRef}
          imageSrc={imageSrc}
          text={text}
          textStyles={textStyles}
        />
      </main>
    </div>
  );
}
