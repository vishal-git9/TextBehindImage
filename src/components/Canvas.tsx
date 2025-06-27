"use client";

import type React from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { type RefObject, useRef } from 'react';
import { cn } from '@/lib/utils';

type CanvasProps = {
  editorAreaRef: RefObject<HTMLDivElement>;
  imageSrc: string;
  text: string;
  textStyles: React.CSSProperties;
  imageStyles: React.CSSProperties;
  aspectRatio: string;
};

const aspectRatioClasses: { [key: string]: string } = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
};

export default function Canvas({ editorAreaRef, imageSrc, text, textStyles, imageStyles, aspectRatio }: CanvasProps) {
  const nodeRef = useRef(null);

  return (
    <div
      id="editor-area"
      ref={editorAreaRef}
      className={cn(
        "relative w-auto h-auto max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl bg-gray-900",
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
      <Draggable bounds="parent" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={textStyles}
          className="absolute cursor-move select-none whitespace-pre-wrap transition-all duration-200"
        >
          {text}
        </div>
      </Draggable>
    </div>
  );
}
