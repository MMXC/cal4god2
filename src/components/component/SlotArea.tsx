import React, { ReactNode } from 'react';

export type SlotAreaProps = {
  onAreaClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: ReactNode;
};

export function SlotArea({ onAreaClick, className = '', children }: SlotAreaProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gray-900/80 rounded-lg p-1 ${className}`}
      onClick={e => {
        // 只在点击空白区时触发
        if (e.target === e.currentTarget && onAreaClick) onAreaClick(e);
      }}
      style={{ minWidth: 36 }}
    >
      {children}
    </div>
  );
} 