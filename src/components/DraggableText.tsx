"use client";

import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { cn } from '@/lib/utils';
import type { TextObject } from './Editor';

type DraggableTextProps = {
  textObject: TextObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStop: (id: string, position: { x: number, y: number }) => void;
};

const DraggableText = ({ textObject, isSelected, onSelect, onDragStop }: DraggableTextProps) => {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState(textObject.position);

  // Keep local state in sync with external prop changes (e.g., from undo/redo)
  useEffect(() => {
    setPosition(textObject.position);
  }, [textObject.position]);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(textObject.id);
  };

  const handleDrag = (_: unknown, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = (_: unknown, data: { x: number; y: number }) => {
    // Only update global state on stop to avoid flooding history
    onDragStop(textObject.id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      bounds="parent"
      nodeRef={nodeRef}
      key={textObject.id}
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute cursor-move",
          isSelected && "outline-dashed outline-2 outline-primary outline-offset-4"
        )}
        onClick={handleSelect}
        onMouseDownCapture={handleSelect}
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
}

export default React.memo(DraggableText);
