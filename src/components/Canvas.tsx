"use client";

import type React from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { type RefObject, useRef } from 'react';

type CanvasProps = {
  editorAreaRef: RefObject<HTMLDivElement>;
  imageSrc: string;
  text: string;
  textStyles: React.CSSProperties;
};

export default function Canvas({ editorAreaRef, imageSrc, text, textStyles }: CanvasProps) {
  const nodeRef = useRef(null);
  return (
    <div
      id="editor-area"
      ref={editorAreaRef}
      className="relative w-[90vw] md:w-[60vw] lg:w-[50vw] aspect-video overflow-hidden rounded-lg shadow-2xl bg-gray-900"
    >
      <Image
        src={imageSrc}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="pointer-events-none"
        data-ai-hint="landscape"
      />
      <Draggable bounds="parent" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          style={textStyles}
          className="absolute cursor-move select-none whitespace-pre-wrap"
        >
          {text}
        </div>
      </Draggable>
    </div>
  );
}
