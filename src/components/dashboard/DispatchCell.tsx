'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DispatchCellProps {
  id: string;
  children?: React.ReactNode;
}

export default function DispatchCell({ id, children }: DispatchCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[120px] border-b border-l border-white/5 p-2 transition-colors duration-200 ${
        isOver ? 'bg-blue-600/20 ring-2 ring-blue-500/40 ring-inset' : 'bg-transparent'
      }`}
    >
      {children}
    </div>
  );
}
