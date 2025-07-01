
"use client";

import type React from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { cn } from '@/lib/utils';
import type { TextObject } from './Editor';

type CanvasProps = {
  editorAreaRef: React.RefObject<HTMLDivElement>;
  imageSrc: string;
  foregroundSrc: string;
  texts: TextObject[];
  selectedTextId: string | null;
  onSelectText: (id: string) => void;
  onTextDragStop: (id: string, position: { x: number, y: number }) => void;
  imageStyles: React.CSSProperties;
  aspectRatio: string;
};

const aspectRatioClasses: { [key: string]: string } = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
};

export default function Canvas({ 
  editorAreaRef, 
  imageSrc, 
  foregroundSrc, 
  texts, 
  selectedTextId,
  onSelectText,
  onTextDragStop,
  imageStyles, 
  aspectRatio 
}: CanvasProps) {

  return (
    <div
      id="editor-area"
      ref={editorAreaRef}
      className={cn(
        "relative w-full max-h-full overflow-hidden rounded-lg shadow-2xl bg-gray-900",
        aspectRatioClasses[aspectRatio] || 'aspect-video'
      )}
    >
      <Image
        src={imageSrc}
        alt="Background"
        fill
        className="object-cover pointer-events-none transition-all duration-300"
        style={imageStyles}
        data-ai-hint="landscape"
        key={imageSrc}
      />
      
      {texts.map((textObject) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const nodeRef = React.useRef(null);
        return (
          <Draggable
            bounds="parent"
            nodeRef={nodeRef}
            key={textObject.id}
            position={textObject.position}
            onStop={(_, data) => onTextDragStop(textObject.id, { x: data.x, y: data.y })}
          >
            <div
              ref={nodeRef}
              className={cn(
                "absolute cursor-move",
                selectedTextId === textObject.id && "outline-dashed outline-2 outline-primary outline-offset-4"
              )}
              onClick={() => onSelectText(textObject.id)}
              onMouseDownCapture={() => onSelectText(textObject.id)}
            >
              <div
                style={{
                  fontSize: `${textObject.fontSize}px`,
                  fontFamily: `'${textObject.fontFamily}', sans-serif`,
                  color: textObject.color,
                  textShadow: textObject.textShadow,
                  fontWeight: textObject.fontWeight,
                  fontStyle: textObject.fontStyle,
                  textDecoration: textObject.textDecoration,
                  opacity: textObject.opacity,
                  transform: `rotate(${textObject.textRotation}deg)`,
                }}
                className="select-none whitespace-pre-wrap"
              >
                {textObject.text}
              </div>
            </div>
          </Draggable>
        );
      })}

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
