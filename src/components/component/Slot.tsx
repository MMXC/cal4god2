import React from 'react';

export type SlotProps = {
  value?: any; // 当前插槽内容（如符文/魂核）
  onDrop?: (e: React.DragEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isOver?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function Slot({ value, onDrop, onDragStart, onClick, onContextMenu, isOver, className = '', children }: SlotProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-4 h-4 rounded border-2 border-dashed border-gray-500 bg-gray-800 hover:border-yellow-400 transition-all cursor-pointer select-none ${isOver ? 'ring-2 ring-yellow-300' : ''} ${className}`}
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onDragStart={onDragStart}
      onClick={onClick}
      onContextMenu={onContextMenu}
      draggable={!!value}
      title={typeof value === 'string' ? value : value ? value.name : '点击选择/拖入'}
    >
      {value ? (
        typeof value === 'string' ? (
          <span className="text-xs font-bold text-purple-300 text-center w-full truncate">{value}</span>
        ) : (
          <span className="text-base">{value.icon || value.name || children}</span>
        )
      ) : (
        <span className="text-gray-500 text-lg font-bold">+</span>
      )}
    </div>
  );
} 