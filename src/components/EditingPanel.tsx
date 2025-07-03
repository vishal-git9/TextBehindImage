
"use client";

import React from 'react';
import Image from 'next/image';
import {
  Bold, Italic, Underline, Wand2, Image as ImageIcon,
  Type, Paintbrush, Settings, RotateCw, ChevronsUpDown, Undo, Redo, Trash2, Plus
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TextObject } from './Editor';
import { cn } from '@/lib/utils';
import { useFontList } from '@/hooks/useFontList';

type EditingPanelProps = {
  // State
  texts: TextObject[];
  selectedTextId: string | null;
  activeText: TextObject | null;
  imageSrc: string;
  imageRotation: number;
  brightness: number;
  contrast: number;
  aspectRatio: string;
  aiCategory: string;
  
  // Setters
  onUpdateTextProperty: (property: keyof Omit<TextObject, 'id' | 'position'>, value: any) => void;
  setImageRotation: (rotation: number) => void;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  setAspectRatio: (ratio: string) => void;
  setAiCategory: (category: string) => void;

  // Actions
  onAddText: () => void;
  onDeleteText: (id: string) => void;
  onSelectText: (id: string) => void;
  handleChangeImage: () => void;
  handleAiSuggest: () => void;
  undo: () => void;
  redo: () => void;
  
  // Action states
  isLoadingAi: boolean;
  aiSuggestions: SuggestStyleOutput | null;
  canUndo: boolean;
  canRedo: boolean;
};

const EditingPanel = ({
  texts, selectedTextId, activeText, onUpdateTextProperty, onAddText, onDeleteText, onSelectText,
  imageSrc, imageRotation, setImageRotation, brightness, setBrightness, contrast, setContrast,
  handleChangeImage, aspectRatio, setAspectRatio,
  aiCategory, setAiCategory, handleAiSuggest, isLoadingAi, aiSuggestions,
  undo, redo, canUndo, canRedo
}: EditingPanelProps) => {
  const {
    fontSearch,
    setFontSearch,
    isFontPopoverOpen,
    setIsFontPopoverOpen,
    displayedFonts,
    handleFontScroll,
    filteredFonts,
  } = useFontList();
  
  const setTextColor = (color: string) => onUpdateTextProperty('color', color);
  const setFontFamily = (font: string) => onUpdateTextProperty('fontFamily', font);

  const controlsDisabled = !activeText;
  const activeFontFamily = activeText?.fontFamily || 'Bebas Neue';

  return (
    <Card className="w-full md:w-96 border-0 md:border-r rounded-none flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <Image src={require("./images/logo.png")} alt="Text Behind Logo" width={140} height={35} />
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
                  <Undo className="h-4 w-4" />
                  <span className="sr-only">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
                  <Redo className="h-4 w-4" />
                  <span className="sr-only">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
                <div className="flex justify-between items-center">
                  <Label>Text Layers</Label>
                  <Button variant="outline" size="sm" onClick={onAddText}>
                    <Plus className="mr-2 h-4 w-4" /> Add Text
                  </Button>
                </div>
                <div className="space-y-1 rounded-md border p-2 max-h-48 overflow-y-auto">
                  {texts.map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => onSelectText(t.id)} 
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer text-sm",
                        selectedTextId === t.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
                      )}
                    >
                      <span className="truncate pr-2">{t.text || 'Untitled'}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.stopPropagation(); onDeleteText(t.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {texts.length === 0 && <p className="text-center text-sm text-muted-foreground p-2">No text layers.</p>}
                </div>
              </div>
              <Separator />

              <div className={cn("space-y-6", controlsDisabled && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                  <Label htmlFor="text-content">Text Content</Label>
                  <Textarea id="text-content" value={activeText?.text || ''} onChange={(e) => onUpdateTextProperty('text', e.target.value)} placeholder="Your text here" rows={3}/>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Style Helper</Label>
                    <div className="flex space-x-2">
                      <Input value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} placeholder="e.g., 'Nature', 'Tech'"/>
                      <Button onClick={handleAiSuggest} disabled={isLoadingAi} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
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
                            onClick={() => setTextColor(c)}
                            aria-label={`Set color to ${c}`}
                            />
                        ))}
                        </div>
                    </div>
                    )}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Popover open={isFontPopoverOpen} onOpenChange={setIsFontPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isFontPopoverOpen}
                            className="w-full justify-between font-normal"
                            style={{ fontFamily: activeFontFamily }}
                          >
                            <span className="truncate">{activeFontFamily}</span>
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
                          <ScrollArea className="h-72" onScroll={handleFontScroll}>
                            {displayedFonts.length > 0 ? (
                              displayedFonts.map((font) => (
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
                             {filteredFonts.length === 0 && (
                                <p className="p-4 text-center text-sm text-muted-foreground">
                                No font found.
                                </p>
                            )}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="font-size">Font Size: {activeText?.fontSize || 72}px</Label>
                      <Slider id="font-size" min={12} max={256} step={1} value={[activeText?.fontSize || 72]} onValueChange={(v) => onUpdateTextProperty('fontSize', v[0])}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input id="color" type="color" value={activeText?.color || '#FFFFFF'} onChange={(e) => onUpdateTextProperty('color', e.target.value)} className="p-1 h-10"/>
                    </div>
                    <div className="space-y-2">
                      <Label>Style</Label>
                        <div className="flex">
                            <Button
                                variant={activeText?.fontWeight === 'bold' ? 'secondary' : 'outline'}
                                size="icon"
                                onClick={() => onUpdateTextProperty('fontWeight', activeText?.fontWeight === 'bold' ? 'normal' : 'bold')}
                                className="rounded-r-none"
                            >
                                <Bold />
                            </Button>
                            <Button
                                variant={activeText?.fontStyle === 'italic' ? 'secondary' : 'outline'}
                                size="icon"
                                onClick={() => onUpdateTextProperty('fontStyle', activeText?.fontStyle === 'italic' ? 'normal' : 'italic')}
                                className="rounded-none border-x-0"
                            >
                                <Italic />
                            </Button>
                            <Button
                                variant={activeText?.textDecoration === 'underline' ? 'secondary' : 'outline'}
                                size="icon"
                                onClick={() => onUpdateTextProperty('textDecoration', activeText?.textDecoration === 'underline' ? 'none' : 'underline')}
                                className="rounded-l-none"
                            >
                                <Underline />
                            </Button>
                        </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text-shadow">Text Shadow</Label>
                    <Select value={activeText?.textShadow || 'none'} onValueChange={(v) => onUpdateTextProperty('textShadow', v)}>
                        <SelectTrigger id="text-shadow"><SelectValue placeholder="Select shadow" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="1px 1px 2px rgba(0,0,0,0.4)">Subtle</SelectItem>
                            <SelectItem value="2px 2px 4px rgba(0,0,0,0.5)">Standard</SelectItem>
                            <SelectItem value="3px 3px 6px rgba(0,0,0,0.6)">Strong</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="text-rotation">Rotation: {activeText?.textRotation || 0}°</Label>
                      <Slider id="text-rotation" min={-180} max={180} step={1} value={[activeText?.textRotation || 0]} onValueChange={(v) => onUpdateTextProperty('textRotation', v[0])}/>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="opacity">Opacity: {Math.round((activeText?.opacity || 1) * 100)}%</Label>
                      <Slider id="opacity" min={0} max={1} step={0.01} value={[activeText?.opacity || 1]} onValueChange={(v) => onUpdateTextProperty('opacity', v[0])}/>
                  </div>
                </div>
              </div>

            </CardContent>
          </TabsContent>

          <TabsContent value="image">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={handleChangeImage}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                </div>
                
                <div className={cn(!imageSrc && "opacity-50 pointer-events-none")}>
                    <Separator />
                    <div className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="image-rotation" className="flex items-center">
                                <RotateCw className="mr-2 h-4 w-4" />
                                Rotation: {imageRotation}°
                            </Label>
                            <Slider 
                                id="image-rotation" 
                                min={-180} 
                                max={180} 
                                step={1} 
                                value={[imageRotation]} 
                                onValueChange={(v) => setImageRotation(v[0])}
                            />
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
            </CardContent>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}

export default React.memo(EditingPanel);
