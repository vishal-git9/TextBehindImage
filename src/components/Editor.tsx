
"use client";

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useGoogleFont } from '@/hooks/useGoogleFont';
import EditingPanel from './EditingPanel';
import Canvas from './Canvas';
import { suggestStyle, type SuggestStyleOutput } from '@/ai/flows/suggest-style';
import { enhanceImage } from '@/ai/flows/enhance-image';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Editor() {
  const { toast } = useToast();
  // Text state
  const [text, setText] = useState('Your Text Here');
  const [fontSize, setFontSize] = useState(72);
  const [fontFamily, setFontFamily] = useState('Bebas Neue');
  const [color, setColor] = useState('#FFFFFF');
  const [textShadow, setTextShadow] = useState('2px 2px 4px rgba(0,0,0,0.5)');
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');
  const [textRotation, setTextRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Image state
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageRotation, setImageRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // Settings state
  const [aspectRatio, setAspectRatio] = useState('original');
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
  
  const handleEnhanceImage = async () => {
    if (!imageSrc) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceImage({ imageDataUri: imageSrc });
      setImageSrc(result.enhancedImageDataUri);
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
    fontSize: `${fontSize}px`,
    fontFamily: `'${fontFamily}', sans-serif`,
    color: color,
    textShadow: textShadow,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
    textDecoration: textDecoration,
    opacity: opacity,
    padding: '20px'
  };

  const imageStyles: React.CSSProperties = {
    transform: `rotate(${imageRotation}deg)`,
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
  };

  const toggleBold = () => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold');
  const toggleItalic = () => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic');
  const toggleUnderline = () => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline');

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Input type="file" className="hidden" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" />
      <EditingPanel 
        // Text props
        text={text} setText={setText}
        fontSize={fontSize} setFontSize={setFontSize}
        fontFamily={fontFamily} setFontFamily={setFontFamily}
        color={color} setColor={setColor}
        textShadow={textShadow} setTextShadow={setTextShadow}
        fontWeight={fontWeight} toggleBold={toggleBold}
        fontStyle={fontStyle} toggleItalic={toggleItalic}
        textDecoration={textDecoration} toggleUnderline={toggleUnderline}
        textRotation={textRotation} setTextRotation={setTextRotation}
        opacity={opacity} setOpacity={setOpacity}
        // Image props
        imageSrc={imageSrc}
        imageRotation={imageRotation} setImageRotation={setImageRotation}
        brightness={brightness} setBrightness={setBrightness}
        contrast={contrast} setContrast={setContrast}
        handleEnhanceImage={handleEnhanceImage}
        isEnhancing={isEnhancing}
        imageInputRef={imageInputRef}
        // Settings props
        aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
        aiCategory={aiCategory} setAiCategory={setAiCategory}
        handleAiSuggest={handleAiSuggest}
        isLoadingAi={isLoadingAi}
        aiSuggestions={aiSuggestions}
        handleDownload={handleDownload}
      />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/30 dark:bg-muted/10 overflow-hidden">
        {imageSrc ? (
            <Canvas 
            editorAreaRef={editorAreaRef}
            imageSrc={imageSrc}
            text={text}
            textStyles={textStyles}
            imageStyles={imageStyles}
            aspectRatio={aspectRatio}
            textRotation={textRotation}
            />
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
