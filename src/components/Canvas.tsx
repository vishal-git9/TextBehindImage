
"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { TextObject } from './Editor';
import DraggableText from './DraggableText';

type CanvasProps = {
  editorAreaRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  foregroundSrc: string;
  texts: TextObject[];
  selectedTextId: string | null;
  onSelectText: (id: string) => void;
  onTextDragStop: (id:string, position: { x: number, y: number }) => void;
  onDeselect: () => void;
  imageStyles: React.CSSProperties;
  aspectRatio: string;
};

const aspectRatioClasses: { [key: string]: string } = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
};

const Canvas = ({ 
  editorAreaRef, 
  imageSrc, 
  foregroundSrc, 
  texts, 
  selectedTextId,
  onSelectText,
  onTextDragStop,
  onDeselect,
  imageStyles, 
  aspectRatio,
}: CanvasProps) => {

  return (
    <div
      id="editor-area"
      ref={editorAreaRef}
      className={cn(
        "relative w-full max-h-full overflow-hidden rounded-lg shadow-2xl bg-card",
        aspectRatioClasses[aspectRatio] || 'aspect-video'
      )}
      onClick={onDeselect}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Background"
          fill
          className="object-cover pointer-events-none transition-all duration-300"
          style={imageStyles}
          data-ai-hint="landscape"
          key={imageSrc}
        />
      )}
      
      {texts.map((textObject) => (
        <DraggableText
          key={textObject.id}
          textObject={textObject}
          isSelected={selectedTextId === textObject.id}
          onSelect={onSelectText}
          onDragStop={onTextDragStop}
        />
      ))}

      {foregroundSrc && (
         <Image
            src={foregroundSrc}
            alt="Foreground Layer"
            fill
            className="object-cover pointer-events-none transition-all duration-300"
            style={imageStyles}
            key={foregroundSrc}
        />
      )}
    </div>
  );
}

export default React.memo(Canvas);
