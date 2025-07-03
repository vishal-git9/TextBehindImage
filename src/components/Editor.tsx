
"use client";

import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { removeBackground } from '@imgly/background-removal';
import { useGoogleFont } from '@/hooks/useGoogleFont';
import EditingPanel from './EditingPanel';
import Canvas from './Canvas';
import { suggestStyle, type SuggestStyleOutput } from '@/ai/flows/suggest-style';
import { enhanceImage } from '@/ai/flows/enhance-image';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Download, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHistoryState } from '@/hooks/useHistoryState';
import { Skeleton } from '@/components/ui/skeleton';

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
  text: 'POV',
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
  texts: [],
  selectedTextId: null,
  imageSrc: '',
  foregroundSrc: '',
  imageRotation: 0,
  brightness: 100,
  contrast: 100,
  aspectRatio: 'original',
};


export default function Editor() {
  const { toast } = useToast();
  const { state, setState, resetState, undo, redo, canUndo, canRedo, isLoaded } = useHistoryState<EditorState>(initialState, 'text-weaver-state-multi');
  
  const [isProcessingOnUpload, setIsProcessingOnUpload] = useState(false);
  const [aiCategory, setAiCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<SuggestStyleOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [naturalImageDimensions, setNaturalImageDimensions] = useState<{width: number, height: number} | null>(null);

  const editorAreaRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If there are texts but none is selected, select the first one.
    if (state.texts.length > 0 && !state.selectedTextId) {
        setState(s => ({...s, selectedTextId: s.texts[0].id}));
    }
    // If the selected text ID is no longer valid (e.g. after an undo), select the first one.
    else if (state.selectedTextId && !state.texts.find(t => t.id === state.selectedTextId)) {
        setState(s => ({...s, selectedTextId: s.texts[0]?.id ?? null}));
    }
  }, [state.texts, state.selectedTextId, setState]);
  
  const activeText = useMemo(() => {
    return state.texts.find(t => t.id === state.selectedTextId) || null;
  }, [state.texts, state.selectedTextId]);

  const allFontFamilies = useMemo(() => {
    const fontSet = new Set<string>();
    state.texts.forEach(t => {
      if (t.fontFamily) {
        fontSet.add(t.fontFamily);
      }
    });
    return Array.from(fontSet);
  }, [state.texts]);

  useGoogleFont(allFontFamilies);

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

  const handleRemoveBackground = useCallback(() => {
    if (!state.imageSrc) {
        toast({
            variant: "destructive",
            title: "No Image",
            description: "Please upload an image first.",
        });
        return;
    };
    setIsRemovingBackground(true);

    removeBackground(state.imageSrc)
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setState(s => ({ ...s, foregroundSrc: reader.result as string }));
          toast({
            title: "Object Layered",
            description: "The main subject is now layered on top of the text.",
          });
          setIsRemovingBackground(false);
        };
        reader.readAsDataURL(blob);
      })
      .catch ((error) => {
        console.error("Background removal failed", error);
        toast({
          variant: "destructive",
          title: "Layering Failed",
          description: "Could not remove background. The image might be too complex or in an unsupported format.",
        });
        setIsRemovingBackground(false);
      });
  }, [state.imageSrc, setState, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      setIsProcessingOnUpload(true);

      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;

        // Process background immediately
        removeBackground(imageUrl)
          .then((foregroundBlob) => {
            const foregroundReader = new FileReader();
            foregroundReader.onloadend = () => {
              const foregroundUrl = foregroundReader.result as string;
              const newText = createDefaultText();
              const newInitialState: EditorState = {
                ...initialState,
                texts: [newText],
                imageSrc: imageUrl,
                foregroundSrc: foregroundUrl,
                selectedTextId: newText.id,
              };
              resetState(newInitialState);
              setNaturalImageDimensions(null);
            };
            foregroundReader.readAsDataURL(foregroundBlob);
          })
          .catch((error) => {
            console.error("Background removal failed", error);
            toast({
              variant: "destructive",
              title: "Processing Failed",
              description: "Could not process image. It might be too large or in an unsupported format. Please try another.",
            });
            setIsProcessingOnUpload(false);
          });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = useCallback((dimensions: { width: number; height: number }) => {
    setNaturalImageDimensions(dimensions);
  }, []);

  const handleUpdateTextProperty = useCallback((property: keyof Omit<TextObject, 'id' | 'position'>, value: any) => {
    setState(s => {
        const newTexts = s.texts.map(t => {
            if (t.id === s.selectedTextId) {
                return { ...t, [property]: value };
            }
            return t;
        });
        return { ...s, texts: newTexts };
    });
  }, [setState]);

  const handleAiSuggest = useCallback(async () => {
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
  }, [aiCategory, state.selectedTextId, toast, handleUpdateTextProperty]);
  
  const handleEnhanceImage = useCallback(async () => {
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
  }, [state.imageSrc, setState, toast]);

  const handleClearForeground = useCallback(() => {
    setState(s => ({ ...s, foregroundSrc: '' }));
    toast({
      title: "Layers Reset",
      description: "The foreground layer has been removed.",
    });
  }, [setState, toast]);

  const imageStyles: React.CSSProperties = useMemo(() => ({
    transform: `rotate(${state.imageRotation}deg)`,
    filter: `brightness(${state.brightness}%) contrast(${state.contrast}%)`,
    objectFit: 'contain',
  }), [state.imageRotation, state.brightness, state.contrast]);

  const containerStyle: React.CSSProperties = useMemo(() => {
    if (state.aspectRatio === 'original' && naturalImageDimensions && naturalImageDimensions.width > 0 && naturalImageDimensions.height > 0) {
      return {
        aspectRatio: `${naturalImageDimensions.width} / ${naturalImageDimensions.height}`
      };
    }
    if (state.aspectRatio === 'original' && !state.imageSrc) {
        return {
            aspectRatio: '16 / 9'
        }
    }
    return {};
  }, [state.aspectRatio, naturalImageDimensions, state.imageSrc]);

  const handleAddText = useCallback(() => {
    const newText = createDefaultText();
    setState(s => ({ ...s, texts: [...s.texts, newText], selectedTextId: newText.id }));
  }, [setState]);

  const handleDeleteText = useCallback((id: string) => {
    setState(s => {
      const newTexts = s.texts.filter(t => t.id !== id);
      let newSelectedId = s.selectedTextId;
      if (s.selectedTextId === id) {
        newSelectedId = newTexts.length > 0 ? newTexts[0].id : null;
      }
      return { ...s, texts: newTexts, selectedTextId: newSelectedId };
    });
  }, [setState]);

  const handleSelectText = useCallback((id: string) => {
    setState(s => ({ ...s, selectedTextId: id }));
  }, [setState]);
  
  const handleDeselect = useCallback(() => {
    if (state.selectedTextId) {
      setState(s => ({...s, selectedTextId: null}));
    }
  }, [state.selectedTextId, setState]);

  const handleTextDragStop = useCallback((id: string, position: { x: number, y: number }) => {
     setState(s => {
        const newTexts = s.texts.map(t => {
            if (t.id === id) {
                return { ...t, position };
            }
            return t;
        });
        return { ...s, texts: newTexts };
    });
  }, [setState]);
  
  const setAspectRatio = useCallback((ratio: string) => setState(s => ({ ...s, aspectRatio: ratio })), [setState]);
  const setImageRotation = useCallback((rotation: number) => setState(s => ({ ...s, imageRotation: rotation })), [setState]);
  const setBrightness = useCallback((brightness: number) => setState(s => ({ ...s, brightness })), [setState]);
  const setContrast = useCallback((contrast: number) => setState(s => ({ ...s, contrast })), [setState]);

  if (!isLoaded) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Skeleton className="h-full w-full max-w-lg aspect-video" />
        </div>
    );
  }

  if (!state.imageSrc) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
            <Input type="file" className="hidden" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" disabled={isProcessingOnUpload} />
            
            {isProcessingOnUpload ? (
                 <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-primary-foreground mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h1 className="text-3xl font-bold tracking-tight">Processing Image...</h1>
                    <p className="text-muted-foreground mt-2">AI is preparing your image layers. This can take a moment.</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">
                            <Image src={require("./images/logo.png")} alt="Text Behind Logo" width={140} height={35} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Start with an Image</h1>
                        <p className="text-muted-foreground mt-2">Upload an image to begin. Our AI will help you place text behind any object.</p>
                    </div>

                    <div 
                        className="w-full max-w-2xl h-80 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-card/80 transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-lg font-semibold text-foreground">Click or drag file to this area to upload</p>
                            <p className="text-sm text-muted-foreground mt-1">PNG, JPG, or WEBP supported</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
  }

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
      <main className="flex-1 flex flex-col items-start justify-start p-4 md:p-8 bg-muted overflow-auto">
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
                    onDeselect={handleDeselect}
                    imageStyles={imageStyles}
                    aspectRatio={state.aspectRatio}
                    onImageLoad={handleImageLoad}
                    containerStyle={containerStyle}
                />
            </div>
            <Button onClick={handleDownload} disabled={(state.texts.length === 0 && !state.imageSrc) || isRemovingBackground} className="shrink-0">
                <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
        </div>
      </main>
    </div>
  );
}
