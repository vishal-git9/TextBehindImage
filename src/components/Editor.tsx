
"use client";

import { useRef, useCallback, useState, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { removeBackground } from '@imgly/background-removal';
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

export type TextObject = {
  id: string;
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
  position: { x: number; y: number };
};

type EditorState = {
  texts: TextObject[];
  selectedTextId: string | null;
  imageSrc: string;
  foregroundSrc: string;
  imageRotation: number;
  brightness: number;
  contrast: number;
  aspectRatio: string;
};

const createDefaultText = (): TextObject => ({
  id: `text-${Date.now()}-${Math.random()}`,
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
  position: { x: 50, y: 50 },
});


const initialState: EditorState = {
  texts: [createDefaultText()],
  selectedTextId: null, // Will be set to the first text's ID on mount
  imageSrc: '',
  foregroundSrc: '',
  imageRotation: 0,
  brightness: 100,
  contrast: 100,
  aspectRatio: 'original',
};


export default function Editor() {
  const { toast } = useToast();
  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState<EditorState>(initialState, 'text-weaver-state-multi');
  
  const [aiCategory, setAiCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<SuggestStyleOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  const editorAreaRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Set initial selected text
  if (state.texts.length > 0 && !state.selectedTextId) {
    setState(s => ({...s, selectedTextId: s.texts[0].id}));
  }
  
  const activeText = useMemo(() => {
    return state.texts.find(t => t.id === state.selectedTextId) || null;
  }, [state.texts, state.selectedTextId]);

  useGoogleFont(activeText?.fontFamily);
  state.texts.forEach(t => useGoogleFont(t.fontFamily));

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
        setState(s => ({ ...s, imageSrc: event.target?.result as string, foregroundSrc: '' }));
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
        if (state.selectedTextId) {
            handleUpdateTextProperty('fontFamily', result.fontFamily);
            handleUpdateTextProperty('color', result.colorPalette[0] || '#FFFFFF');
        }
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
      setState(s => ({...s, imageSrc: result.enhancedImageDataUri, foregroundSrc: '' }));
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

  const handleRemoveBackground = async () => {
    if (!state.imageSrc) return;
    setIsRemovingBackground(true);
    try {
      const blob = await removeBackground(state.imageSrc);
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(s => ({ ...s, foregroundSrc: reader.result as string }));
        toast({
          title: "Background Removed",
          description: "The foreground has been layered on top of the text.",
        });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Background removal failed", error);
      toast({
        variant: "destructive",
        title: "Background Removal Failed",
        description: "Could not remove background. The image might be too complex or in an unsupported format.",
      });
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const handleClearForeground = () => {
    setState(s => ({ ...s, foregroundSrc: '' }));
    toast({
      title: "Layers Reset",
      description: "The foreground layer has been removed.",
    });
  };

  const imageStyles: React.CSSProperties = {
    transform: `rotate(${state.imageRotation}deg)`,
    filter: `brightness(${state.brightness}%) contrast(${state.contrast}%)`,
  };

  const handleAddText = () => {
    const newText = createDefaultText();
    setState(s => ({ ...s, texts: [...s.texts, newText], selectedTextId: newText.id }));
  };

  const handleDeleteText = (id: string) => {
    setState(s => {
      const newTexts = s.texts.filter(t => t.id !== id);
      let newSelectedId = s.selectedTextId;
      if (s.selectedTextId === id) {
        newSelectedId = newTexts.length > 0 ? newTexts[0].id : null;
      }
      return { ...s, texts: newTexts, selectedTextId: newSelectedId };
    });
  };

  const handleSelectText = (id: string) => {
    setState(s => ({ ...s, selectedTextId: id }));
  };
  
  const handleUpdateTextProperty = (property: keyof Omit<TextObject, 'id' | 'position'>, value: any) => {
    setState(s => {
        const newTexts = s.texts.map(t => {
            if (t.id === s.selectedTextId) {
                return { ...t, [property]: value };
            }
            return t;
        });
        return { ...s, texts: newTexts };
    });
  };

  const handleTextDragStop = (id: string, position: { x: number, y: number }) => {
     setState(s => {
        const newTexts = s.texts.map(t => {
            if (t.id === id) {
                return { ...t, position };
            }
            return t;
        });
        return { ...s, texts: newTexts };
    });
  };
  
  const setAspectRatio = (ratio: string) => setState(s => ({ ...s, aspectRatio: ratio }));
  const setImageRotation = (rotation: number) => setState(s => ({ ...s, imageRotation: rotation }));
  const setBrightness = (brightness: number) => setState(s => ({ ...s, brightness }));
  const setContrast = (contrast: number) => setState(s => ({ ...s, contrast }));

  return (
    <div className="flex flex-col md:flex-row md:h-screen bg-background">
      <Input type="file" className="hidden" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" />
      <EditingPanel 
        texts={state.texts}
        selectedTextId={state.selectedTextId}
        activeText={activeText}
        imageSrc={state.imageSrc}
        foregroundSrc={state.foregroundSrc}
        imageRotation={state.imageRotation}
        brightness={state.brightness}
        contrast={state.contrast}
        aspectRatio={state.aspectRatio}
        aiCategory={aiCategory}
        
        onUpdateTextProperty={handleUpdateTextProperty}
        setImageRotation={setImageRotation}
        setBrightness={setBrightness}
        setContrast={setContrast}
        setAspectRatio={setAspectRatio}
        setAiCategory={setAiCategory}
        
        onAddText={handleAddText}
        onDeleteText={handleDeleteText}
        onSelectText={handleSelectText}
        handleEnhanceImage={handleEnhanceImage}
        handleAiSuggest={handleAiSuggest}
        handleRemoveBackground={handleRemoveBackground}
        handleClearForeground={handleClearForeground}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}

        isEnhancing={isEnhancing}
        isLoadingAi={isLoadingAi}
        isRemovingBackground={isRemovingBackground}
        aiSuggestions={aiSuggestions}
        imageInputRef={imageInputRef}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-muted overflow-auto">
        {state.imageSrc ? (
            <div className="w-full max-w-full flex-grow flex flex-col items-center justify-center gap-4">
              <div className="w-full flex-grow flex items-center justify-center">
                <Canvas 
                  editorAreaRef={editorAreaRef}
                  imageSrc={state.imageSrc}
                  foregroundSrc={state.foregroundSrc}
                  texts={state.texts}
                  selectedTextId={state.selectedTextId}
                  onSelectText={handleSelectText}
                  onTextDragStop={handleTextDragStop}
                  imageStyles={imageStyles}
                  aspectRatio={state.aspectRatio}
                />
              </div>
              <Button onClick={handleDownload} disabled={!state.imageSrc} className="shrink-0">
                  <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center">
                <UploadCloud className="h-16 w-16 text-muted-foreground/50" strokeWidth={1} />
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Start your creation</h2>
                    <p className="text-muted-foreground">Upload an image to begin.</p>
                </div>
                <Button onClick={() => imageInputRef.current?.click()} size="lg" className="mt-4">
                    <UploadCloud className="mr-2 h-4 w-4"/>
                    Upload Image
                </Button>
            </div>
        )}
      </main>
    </div>
  );
}
