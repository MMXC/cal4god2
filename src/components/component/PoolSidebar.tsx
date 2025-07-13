import React from 'react';

const POOL_TABS = [
  { key: 'equip', label: '装备' },
  { key: 'skill', label: '技能' },
  { key: 'rune', label: '符文' },
  { key: 'runeWord', label: '符文之语' },
  { key: 'core', label: '魂核' },
  { key: 'empower', label: '赋能' },
  { key: 'entry', label: '词条' },
];

function verticalText(text: string) {
  return text.split('').map((c, i) => <span key={i} className="block leading-tight">{c}</span>);
}

export function PoolSidebar({ activeTab, onTabChange, allowedTabs = [], children }: {
  activeTab: string;
  onTabChange: (key: string) => void;
  allowedTabs?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-gray-900/90 rounded-xl shadow-lg overflow-hidden">
      {/* 左侧竖直Tab栏 */}
      <div className="flex flex-col items-center py-4 px-1 bg-gray-950/90 border-r border-gray-800">
        {POOL_TABS.map(tab => {
          const isAllowed = allowedTabs.length === 0 || allowedTabs.includes(tab.key);
          return (
            <button
              key={tab.key}
              className={`flex flex-col items-center justify-center px-1 py-2 my-1 rounded transition-all font-bold text-xs ${activeTab === tab.key ? 'bg-yellow-700 text-yellow-200 shadow' : 'text-gray-400 hover:bg-gray-800 hover:text-yellow-300'} ${!isAllowed ? 'pointer-events-none opacity-50' : ''}`}
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', minHeight: '48px', minWidth: '28px' }}
              onClick={() => { if (isAllowed) onTabChange(tab.key); }}
            >
              {verticalText(tab.label)}
            </button>
          );
        })}
      </div>
      {/* 右侧池子内容区 */}
      <div className="flex-1 p-3 overflow-y-auto min-w-[180px]">
        {children}
      </div>
    </div>
  );
} 