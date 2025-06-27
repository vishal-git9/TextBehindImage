"use client";

import {
  Bold,
  Italic,
  Underline,
  Wand2,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import type { SuggestStyleOutput } from '@/ai/flows/suggest-style';

const popularFonts = [
  'Poppins',
  'Oswald',
  'Bebas Neue',
  'Pacifico',
  'Inter',
  'Raleway',
  'Roboto Mono',
  'DM Serif Display',
  'Anton',
  'Lobster',
];

type EditingPanelProps = {
  text: string;
  setText: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  color: string;
  setColor: (color: string) => void;
  textShadow: string;
  setTextShadow: (shadow: string) => void;
  fontWeight: 'normal' | 'bold';
  toggleBold: () => void;
  fontStyle: 'normal' | 'italic';
  toggleItalic: () => void;
  textDecoration: 'none' | 'underline';
  toggleUnderline: () => void;
  aiCategory: string;
  setAiCategory: (category: string) => void;
  handleAiSuggest: () => void;
  isLoadingAi: boolean;
  aiSuggestions: SuggestStyleOutput | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
};

export default function EditingPanel({
  text, setText, fontSize, setFontSize, fontFamily, setFontFamily,
  color, setColor, textShadow, setTextShadow, fontWeight, toggleBold,
  fontStyle, toggleItalic, textDecoration, toggleUnderline,
  aiCategory, setAiCategory, handleAiSuggest, isLoadingAi, aiSuggestions,
  handleImageUpload, handleDownload, imageInputRef,
}: EditingPanelProps) {
  return (
    <Card className="w-full md:w-96 border-0 md:border-r rounded-none flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Text Weaver</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your text here"
              rows={3}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Styling</h3>
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {popularFonts.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
              <Slider
                id="font-size"
                min={12}
                max={256}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="p-1 h-10"
                />
              </div>
              <div className="space-y-2">
                 <Label>Style</Label>
                <div className="flex space-x-2">
                  <Button variant={fontWeight === 'bold' ? 'secondary' : 'outline'} size="icon" onClick={toggleBold}><Bold /></Button>
                  <Button variant={fontStyle === 'italic' ? 'secondary' : 'outline'} size="icon" onClick={toggleItalic}><Italic /></Button>
                  <Button variant={textDecoration === 'underline' ? 'secondary' : 'outline'} size="icon" onClick={toggleUnderline}><Underline /></Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-shadow">Text Shadow</Label>
              <Input
                id="text-shadow"
                value={textShadow}
                onChange={(e) => setTextShadow(e.target.value)}
                placeholder="e.g., 2px 2px 4px #000000"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI Style Helper</h3>
            <div className="flex space-x-2">
              <Input
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value)}
                placeholder="e.g., 'Nature', 'Tech'"
              />
              <Button onClick={handleAiSuggest} disabled={isLoadingAi}>
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoadingAi ? 'Thinking...' : 'Suggest'}
              </Button>
            </div>
            {aiSuggestions && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">Suggestion: <span className="font-bold">{aiSuggestions.fontFamily}</span></p>
                <div className="flex gap-2">
                  {aiSuggestions.colorPalette.map((c) => (
                    <button
                      key={c}
                      className="h-8 w-8 rounded-full border-2"
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                      aria-label={`Set color to ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t mt-auto">
        <div className="flex gap-2">
          <Input
            type="file"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageUpload}
            accept="image/*"
          />
          <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="mr-2 h-4 w-4" /> Change Image
          </Button>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
