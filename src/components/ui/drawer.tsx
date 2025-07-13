import React, { useState, useRef, useEffect, ReactNode, createContext, useContext } from 'react';

// Drawer Context 用于嵌套和关闭
const DrawerContext = createContext<{ close: () => void } | null>(null);

export function Drawer({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  // 处理嵌套关闭
  return (
    <DrawerContext.Provider value={{ close }}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        if ((child.type as any).displayName === 'DrawerTrigger' || child.type === DrawerTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, { onOpen: () => setOpen(true) });
        }
        if ((child.type as any).displayName === 'DrawerContent' || child.type === DrawerContent) {
          return React.cloneElement(child as React.ReactElement<any>, { open, onClose: close });
        }
        return child;
      })}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({ children, onOpen }: { children: ReactNode, onOpen?: () => void }) {
  return (
    <div onClick={onOpen} style={{ display: 'inline-block', cursor: 'pointer' }}>
      {children}
    </div>
  );
}
DrawerTrigger.displayName = 'DrawerTrigger';

export function DrawerContent({
  children,
  open,
  onClose,
  side = 'right',
  width = 400,
  height = 320,
}: {
  children: ReactNode,
  open?: boolean,
  onClose?: () => void,
  side?: 'left' | 'right' | 'top' | 'bottom',
  width?: number,
  height?: number,
}) {
  const ref = useRef<HTMLDivElement>(null);
  // ESC关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
  // 点击遮罩关闭
  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === ref.current) onClose?.();
  };
  // 动画样式
  const base = 'fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out';
  const sideStyle = {
    right: `top-0 right-0 h-full ${open ? 'translate-x-0' : 'translate-x-full'}`,
    left: `top-0 left-0 h-full ${open ? 'translate-x-0' : '-translate-x-full'}`,
    top: `top-0 left-0 w-full ${open ? 'translate-y-0' : '-translate-y-full'}`,
    bottom: `bottom-0 left-0 w-full ${open ? 'translate-y-0' : 'translate-y-full'}`,
  };
  const sizeStyle =
    side === 'left' || side === 'right'
      ? { width, height: '100%' }
      : { width: '100%', height };
  if (!open) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-40 flex"
      style={{ background: 'rgba(0,0,0,0.25)' }}
      onClick={handleMaskClick}
    >
      <div
        className={
          base +
          ' ' +
          (sideStyle[side] || sideStyle.right) +
          ' rounded-l-lg'
        }
        style={sizeStyle}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-auto h-full">{children}</div>
      </div>
    </div>
  );
}
DrawerContent.displayName = 'DrawerContent';

// 支持嵌套关闭
export function useDrawerClose() {
  const ctx = useContext(DrawerContext);
  return ctx?.close;
} 