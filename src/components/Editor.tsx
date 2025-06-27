
"use client";

import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { useGoogleFont } from '@/hooks/useGoogleFont';
import EditingPanel from './EditingPanel';
import Canvas from './Canvas';
import { suggestStyle, type SuggestStyleOutput } from '@/ai/flows/suggest-style';
import { enhanceImage } from '@/ai/flows/enhance-image';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Download, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHistoryState } from '@/hooks/useHistoryState';

type EditorState = {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  textShadow: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textRotation: number;
  opacity: number;
  imageSrc: string;
  imageRotation: number;
  brightness: number;
  contrast: number;
  aspectRatio: string;
};

const initialState: EditorState = {
  text: 'Your Text Here',
  fontSize: 72,
  fontFamily: 'Bebas Neue',
  color: '#FFFFFF',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textRotation: 0,
  opacity: 1,
  imageSrc: '',
  imageRotation: 0,
  brightness: 100,
  contrast: 100,
  aspectRatio: 'original',
};


export default function Editor() {
  const { toast } = useToast();
  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState<EditorState>(initialState);
  
  const [aiCategory, setAiCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<SuggestStyleOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const editorAreaRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useGoogleFont(state.fontFamily);

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
        setState(s => ({ ...s, imageSrc: event.target?.result as string }));
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
        setState(s => ({
          ...s,
          fontFamily: result.fontFamily,
          color: result.colorPalette[0] || '#FFFFFF'
        }));
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
  
  const handleEnhanceImage = async () => {
    if (!state.imageSrc) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceImage({ imageDataUri: state.imageSrc });
      setState(s => ({...s, imageSrc: result.enhancedImageDataUri }));
      toast({
        title: "Image Enhanced",
        description: "The AI has enhanced your image.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enhancement Failed",
        description: "Could not enhance the image. Please try again.",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const textStyles: React.CSSProperties = {
    fontSize: `${state.fontSize}px`,
    fontFamily: `'${state.fontFamily}', sans-serif`,
    color: state.color,
    textShadow: state.textShadow,
    fontWeight: state.fontWeight,
    fontStyle: state.fontStyle,
    textDecoration: state.textDecoration,
    opacity: state.opacity,
  };

  const imageStyles: React.CSSProperties = {
    transform: `rotate(${state.imageRotation}deg)`,
    filter: `brightness(${state.brightness}%) contrast(${state.contrast}%)`,
  };

  const setText = (text: string) => setState(s => ({ ...s, text }));
  const setFontSize = (size: number) => setState(s => ({ ...s, fontSize: size }));
  const setFontFamily = (font: string) => setState(s => ({ ...s, fontFamily: font }));
  const setColor = (color: string) => setState(s => ({ ...s, color }));
  const setTextShadow = (shadow: string) => setState(s => ({ ...s, textShadow: shadow }));
  const setTextRotation = (rotation: number) => setState(s => ({ ...s, textRotation: rotation }));
  const setOpacity = (opacity: number) => setState(s => ({ ...s, opacity }));
  const setImageRotation = (rotation: number) => setState(s => ({ ...s, imageRotation: rotation }));
  const setBrightness = (brightness: number) => setState(s => ({ ...s, brightness }));
  const setContrast = (contrast: number) => setState(s => ({ ...s, contrast }));
  const setAspectRatio = (ratio: string) => setState(s => ({ ...s, aspectRatio: ratio }));
  const toggleBold = () => setState(s => ({ ...s, fontWeight: s.fontWeight === 'bold' ? 'normal' : 'bold' }));
  const toggleItalic = () => setState(s => ({ ...s, fontStyle: s.fontStyle === 'italic' ? 'normal' : 'italic' }));
  const toggleUnderline = () => setState(s => ({ ...s, textDecoration: s.textDecoration === 'underline' ? 'none' : 'underline' }));

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Input type="file" className="hidden" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" />
      <EditingPanel 
        // State
        text={state.text}
        fontSize={state.fontSize}
        fontFamily={state.fontFamily}
        color={state.color}
        textShadow={state.textShadow}
        fontWeight={state.fontWeight}
        fontStyle={state.fontStyle}
        textDecoration={state.textDecoration}
        textRotation={state.textRotation}
        opacity={state.opacity}
        imageSrc={state.imageSrc}
        imageRotation={state.imageRotation}
        brightness={state.brightness}
        contrast={state.contrast}
        aspectRatio={state.aspectRatio}
        aiCategory={aiCategory}
        
        // Setters
        setText={setText}
        setFontSize={setFontSize}
        setFontFamily={setFontFamily}
        setColor={setColor}
        setTextShadow={setTextShadow}
        toggleBold={toggleBold}
        toggleItalic={toggleItalic}
        toggleUnderline={toggleUnderline}
        setTextRotation={setTextRotation}
        setOpacity={setOpacity}
        setImageRotation={setImageRotation}
        setBrightness={setBrightness}
        setContrast={setContrast}
        setAspectRatio={setAspectRatio}
        setAiCategory={setAiCategory}
        
        // Actions
        handleEnhanceImage={handleEnhanceImage}
        handleAiSuggest={handleAiSuggest}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}

        // Action states
        isEnhancing={isEnhancing}
        isLoadingAi={isLoadingAi}
        aiSuggestions={aiSuggestions}
        imageInputRef={imageInputRef}
      />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/30 dark:bg-muted/10 overflow-hidden">
        {state.imageSrc ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                <Canvas 
                  editorAreaRef={editorAreaRef}
                  imageSrc={state.imageSrc}
                  text={state.text}
                  textStyles={textStyles}
                  imageStyles={imageStyles}
                  aspectRatio={state.aspectRatio}
                  textRotation={state.textRotation}
                />
              </div>
              <Button onClick={handleDownload} disabled={!state.imageSrc} className="shrink-0">
                  <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg bg-background/50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Start by adding an image</h2>
                    <p className="text-muted-foreground">Upload an image to begin your creation.</p>
                </div>
                <Button onClick={() => imageInputRef.current?.click()} size="lg">
                    <UploadCloud className="mr-2"/>
                    Upload Image
                </Button>
            </div>
        )}
      </main>
    </div>
  );
}
