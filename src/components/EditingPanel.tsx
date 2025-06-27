
"use client";

import { useState } from 'react';
import {
  Bold, Italic, Underline, Wand2, Image as ImageIcon, Download,
  Type, Paintbrush, Settings, RotateCw, ChevronsUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SuggestStyleOutput } from '@/ai/flows/suggest-style';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const popularFonts = [
    'Poppins', 'Oswald', 'Bebas Neue', 'Pacifico', 'Inter', 'Raleway', 'Roboto', 'Roboto Mono', 'Montserrat', 'Lato',
    'DM Serif Display', 'Anton', 'Lobster', 'Playfair Display', 'Nunito', 'Merriweather', 'Source Sans Pro', 'Ubuntu',
    'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT',
    'Exo 2', 'Archivo', 'Josefin Sans', 'Comfortaa', 'Righteous', 'Caveat', 'Abril Fatface', 'Alegreya', 'Alfa Slab One', 'Amatic SC', 
    'Archivo Black', 'Arvo', 'Bangers', 'Bitter', 'Cabin', 'Cardo', 'Cinzel', 'Cormorant Garamond', 'Domine', 'Dosis', 'Fjalla One', 
    'Francois One', 'Indie Flower', 'Inconsolata', 'Josefin Slab', 'Karla', 'Libre Baskerville', 'Libre Franklin', 'Lora', 'Maven Pro', 
    'Noto Sans', 'Noto Serif', 'Open Sans', 'PT Sans', 'PT Serif', 'Permanent Marker', 'Playfair Display SC', 'Quicksand', 'Roboto Slab', 
    'Rubik', 'Slabo 27px', 'Source Code Pro', 'Space Mono', 'Spectral', 'Titillium Web', 'Varela Round', 'Vollkorn', 'Work Sans', 'Yanone Kaffeesatz'
].sort();

type EditingPanelProps = {
  // Text
  text: string; setText: (text: string) => void;
  fontSize: number; setFontSize: (size: number) => void;
  fontFamily: string; setFontFamily: (font: string) => void;
  color: string; setColor: (color: string) => void;
  textShadow: string; setTextShadow: (shadow: string) => void;
  fontWeight: 'normal' | 'bold'; toggleBold: () => void;
  fontStyle: 'normal' | 'italic'; toggleItalic: () => void;
  textDecoration: 'none' | 'underline'; toggleUnderline: () => void;
  textRotation: number; setTextRotation: (rotation: number) => void;
  opacity: number; setOpacity: (opacity: number) => void;

  // Image
  imageRotation: number; setImageRotation: (rotation: number) => void;
  brightness: number; setBrightness: (brightness: number) => void;
  contrast: number; setContrast: (contrast: number) => void;
  handleEnhanceImage: () => void;
  isEnhancing: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  
  // Settings
  aspectRatio: string; setAspectRatio: (ratio: string) => void;
  aiCategory: string; setAiCategory: (category: string) => void;
  handleAiSuggest: () => void;
  isLoadingAi: boolean;
  aiSuggestions: SuggestStyleOutput | null;
  handleDownload: () => void;
};

export default function EditingPanel({
  text, setText, fontSize, setFontSize, fontFamily, setFontFamily, color, setColor, textShadow, setTextShadow,
  fontWeight, toggleBold, fontStyle, toggleItalic, textDecoration, toggleUnderline, textRotation, setTextRotation,
  opacity, setOpacity, imageRotation, setImageRotation, brightness, setBrightness, contrast, setContrast,
  handleEnhanceImage, isEnhancing, handleImageUpload, imageInputRef, aspectRatio, setAspectRatio,
  aiCategory, setAiCategory, handleAiSuggest, isLoadingAi, aiSuggestions, handleDownload
}: EditingPanelProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);

  const filteredFonts = popularFonts.filter(font => 
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  return (
    <Card className="w-full md:w-96 border-0 md:border-r rounded-none flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Text Weaver</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="text" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-6">
          <TabsTrigger value="text" className="w-full"><Type className="mr-2" /> Text</TabsTrigger>
          <TabsTrigger value="image" className="w-full"><Paintbrush className="mr-2" /> Image</TabsTrigger>
          <TabsTrigger value="settings" className="w-full"><Settings className="mr-2" /> Settings</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="text">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="text-content">Text Content</Label>
                <Textarea id="text-content" value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text here" rows={3}/>
              </div>
              <Separator />
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Popover open={isFontPopoverOpen} onOpenChange={setIsFontPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isFontPopoverOpen}
                          className="w-full justify-between font-normal"
                          style={{ fontFamily: fontFamily }}
                        >
                          <span className="truncate">{fontFamily}</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Input
                          placeholder="Search font..."
                          className="h-9 rounded-b-none border-x-0 border-t-0"
                          value={fontSearch}
                          onChange={(e) => setFontSearch(e.target.value)}
                          aria-label="Search for a font"
                        />
                        <ScrollArea className="h-72">
                          {filteredFonts.length > 0 ? (
                            filteredFonts.map((font) => (
                              <Button
                                key={font}
                                variant="ghost"
                                className="w-full justify-start font-normal h-auto py-2"
                                style={{ fontFamily: font }}
                                onClick={() => {
                                  setFontFamily(font);
                                  setIsFontPopoverOpen(false);
                                  setFontSearch('');
                                }}
                              >
                                {font}
                              </Button>
                            ))
                          ) : (
                            <p className="p-4 text-center text-sm text-muted-foreground">
                              No font found.
                            </p>
                          )}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                    <Slider id="font-size" min={12} max={256} step={1} value={[fontSize]} onValueChange={(v) => setFontSize(v[0])}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10"/>
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
                    <Input id="text-shadow" value={textShadow} onChange={(e) => setTextShadow(e.target.value)} placeholder="e.g., 2px 2px 4px #000000" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="text-rotation">Rotation: {textRotation}°</Label>
                    <Slider id="text-rotation" min={0} max={360} step={1} value={[textRotation]} onValueChange={(v) => setTextRotation(v[0])}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</Label>
                    <Slider id="opacity" min={0} max={1} step={0.01} value={[opacity]} onValueChange={(v) => setOpacity(v[0])}/>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="image">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center"><RotateCw className="mr-2 h-4 w-4" />Rotation</Label>
                        <div className="flex justify-between gap-2">
                            {[0, 90, 180, 270].map(deg => (
                                <Button key={deg} variant={imageRotation === deg ? 'secondary' : 'outline'} onClick={() => setImageRotation(deg)} className="flex-1">{deg}°</Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brightness">Brightness: {brightness}%</Label>
                        <Slider id="brightness" min={0} max={200} step={1} value={[brightness]} onValueChange={(v) => setBrightness(v[0])}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                        <Slider id="contrast" min={0} max={200} step={1} value={[contrast]} onValueChange={(v) => setContrast(v[0])}/>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Button onClick={handleEnhanceImage} disabled={isEnhancing} className="w-full">
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isEnhancing ? 'Enhancing...' : 'Enhance Image'}
                    </Button>
                    <Input type="file" className="hidden" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" />
                    <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="settings">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canvas Settings</h3>
                    <div className="space-y-2">
                        <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger id="aspect-ratio"><SelectValue placeholder="Select ratio" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="original">Original</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Separator />
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">AI Style Helper</h3>
                    <div className="flex space-x-2">
                    <Input value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} placeholder="e.g., 'Nature', 'Tech'"/>
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
                <Separator />
                <div className="space-y-2">
                   <Button onClick={handleDownload} className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download Image
                    </Button>
                </div>
            </CardContent>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
