import React, { useState, useContext } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// 引入原cal主面板
import Cal from './cal';
import { RoleContext } from '@/contexts/RoleContext';
import { Slot } from './Slot';
import { SlotArea } from './SlotArea';
import { PoolSidebar } from './PoolSidebar';
import { UserSelectionsContext, Selection } from '@/contexts/UserSelectionsContext';

// 装备部位定义
const EQUIP_SLOTS = [
  '头盔', '防具', '战靴', '饰品', '轻武器', '重武器', '混沌', '活物', '圣物', '遗骨', '黄印'
];
// 技能槽定义
const SKILL_SLOTS = [
  '轻武破招', '轻武切招', '轻武技能1', '轻武技能2', '轻武技能3', '轻武技能4',
  '重武破招', '重武切招', '重武技能1', '重武技能2', '重武技能3', '重武技能4'
];

// 词条类型
const ENTRY_TYPES = [
  { key: 'base', label: '基础', icon: '🟦', max: 1 },
  { key: 'rare', label: '稀有', icon: '🟩', max: 3 },
  { key: 'epic', label: '史诗', icon: '🟪', max: 3 },
  { key: 'legend', label: '传说', icon: '🟧', max: 2 },
  { key: 'ancient', label: '远古', icon: '🟨', max: 4 },
];
// 词条类型与颜色映射
const ENTRY_TYPE_COLORS = {
  base: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legend: 'bg-orange-500',
  ancient: 'bg-cyan-500',
};
const ENTRY_TYPE_DARK = {
  base: 'bg-gray-800',
  rare: 'bg-blue-900',
  epic: 'bg-purple-900',
  legend: 'bg-orange-900',
  ancient: 'bg-cyan-900',
};
const ENTRY_TYPE_SLOTS = {
  base: 1,
  rare: 3,
  epic: 3,
  legend: 2,
  ancient: 4,
};

// 符文槽数量
const RUNE_SLOTS = 4;

// 强化最大等级
const ENHANCE_MAX = 25;

// 技能魂核属性
const CORE_ATTRS = ['攻击', '防御', '血量'];

// 赋能属性
const EMPOWER_ATTRS = ['攻击%', '防御%', '血量%', '额外属性'];

// 上分组布局
const EQUIP_LAYOUT = [
  ['头盔', '防具', '战靴', '饰品'],
  ['混沌', '圣物', '活物', '遗骨'],
  ['轻武', '重武', '黄印', ''],
];
// 下分组布局
const SKILL_LAYOUT = [
  ['轻切', '轻1', '重1', '重切'],
  ['', '轻2', '重2', ''],
  ['', '轻3', '重3', ''],
  ['轻破', '轻4', '重4', '重破'],
];

// 假数据：图标、等级等
const EQUIP_ICONS: Record<string, string> = {
  '头盔': '🪖', '防具': '🦺', '战靴': '🥾', '饰品': '💍',
  '混沌': '🌀', '圣物': '🧿', '活物': '🦴', '遗骨': '💀',
  '轻武': '🗡️', '重武': '⚒️', '黄印': '🔶',
};
const SKILL_ICONS: Record<string, string> = {
  '轻切': '⚡', '轻1': '🌪️', '轻2': '🔥', '轻3': '💧', '轻4': '🌟',
  '重切': '💥', '重1': '🌋', '重2': '🌊', '重3': '🌑', '重4': '⭐',
  '轻破': '��', '重破': '🦿',
};

// 假数据：装备/技能词条
const EQUIP_ENTRY_MOCK: Record<string, Record<string, string[]>> = {
  '头盔': { base: ['头盔基础'], rare: ['头盔稀有1'], epic: [], legend: [], ancient: [] },
  '防具': { base: ['防具基础'], rare: [], epic: ['防具史诗1'], legend: [], ancient: [] },
  '战靴': { base: ['战靴基础'], rare: [], epic: [], legend: [], ancient: [] },
  '饰品': { base: ['饰品基础'], rare: ['饰品稀有1'], epic: [], legend: [], ancient: [] },
  '混沌': { base: ['混沌基础'], rare: [], epic: [], legend: [], ancient: [] },
  '圣物': { base: ['圣物基础'], rare: [], epic: [], legend: [], ancient: [] },
  '活物': { base: ['活物基础'], rare: [], epic: [], legend: [], ancient: [] },
  '遗骨': { base: ['遗骨基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻武': { base: ['轻武基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重武': { base: ['重武基础'], rare: [], epic: [], legend: [], ancient: [] },
  '黄印': { base: ['黄印基础1', '黄印基础2'], rare: [], epic: [], legend: [], ancient: [] },
};
const SKILL_ENTRY_MOCK: Record<string, Record<string, string[]>> = {
  '轻切': { base: ['轻切基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻1': { base: ['轻1基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重1': { base: ['重1基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重切': { base: ['重切基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻2': { base: ['轻2基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重2': { base: ['重2基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻3': { base: ['轻3基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重3': { base: ['重3基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻4': { base: ['轻4基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重4': { base: ['重4基础'], rare: [], epic: [], legend: [], ancient: [] },
  '轻破': { base: ['轻破基础'], rare: [], epic: [], legend: [], ancient: [] },
  '重破': { base: ['重破基础'], rare: [], epic: [], legend: [], ancient: [] },
};

// 1. 假数据：装备池和技能池
const EQUIP_POOL = [
  { id: 'h1', name: '神圣头盔', slot: '头盔', icon: '🪖', level: 20, runes: [1,2,3,4] },
  { id: 'h2', name: '暗影头盔', slot: '头盔', icon: '🪖', level: 15, runes: [2,2,2,2] },
  { id: 'a1', name: '龙鳞防具', slot: '防具', icon: '🦺', level: 18, runes: [1,3,2,4] },
  { id: 'b1', name: '疾风战靴', slot: '战靴', icon: '🥾', level: 12, runes: [1,1,1,1] },
  { id: 'r1', name: '王者饰品', slot: '饰品', icon: '💍', level: 25, runes: [4,4,4,4] },
  // ...可继续补充
];
const SKILL_POOL = [
  { id: 's1', name: '雷霆一击', slot: '轻1', icon: '🌪️', level: 10, core: 2 },
  { id: 's2', name: '烈焰斩', slot: '重1', icon: '🌋', level: 12, core: 3 },
  { id: 's3', name: '冰封领域', slot: '轻2', icon: '💧', level: 8, core: 1 },
  { id: 's4', name: '暗影突袭', slot: '重2', icon: '🌑', level: 15, core: 2 },
  // ...可继续补充
];

function BlankCard() {
  return <div className="min-w-[56px] min-h-[56px] aspect-square bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-800 rounded-lg opacity-30" />;
}

type DragCardProps = {
  slot: string;
  icon?: string;
  level?: number;
  runes?: (number | {icon?: string; name?: string})[];
  core?: number | { main?: any; sub?: any };
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
  isDragOver?: boolean;
};

// 词条槽点组件（孔状，点亮时填充颜色，未点亮时为透明孔）
function EntryDots({ entries }: { entries: Record<string, any[]> }) {
  return (
    <div className="flex flex-row gap-1 mt-1 justify-center">
      {(Object.entries(ENTRY_TYPE_SLOTS) as [keyof typeof ENTRY_TYPE_SLOTS, number][]).map(([type, count]) => (
        <div key={type} className="flex flex-row gap-1">
          {Array.from({ length: count }).map((_, i) => {
            const lit = entries[type] && entries[type][i];
            return (
              <span
                key={i}
                className={`inline-block w-4 h-4 rounded-full border-2 border-gray-700 transition-all duration-200 align-middle text-lg
                  ${lit ? ENTRY_TYPE_COLORS[type as keyof typeof ENTRY_TYPE_COLORS] : ENTRY_TYPE_DARK[type as keyof typeof ENTRY_TYPE_DARK]} 
                  ${lit ? 'shadow-[0_0_12px_4px_rgba(0,0,0,0.28)]' : ''}`}
                style={{
                  boxShadow: lit
                    ? `0 0 12px 4px var(--tw-shadow-color, ${ENTRY_TYPE_COLORS[type as keyof typeof ENTRY_TYPE_COLORS]})`
                    : 'none',
                  backgroundColor: lit
                    ? ''
                    : '',
                }}
                title={type}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// 去除Drawer相关，重构EquipCard/SkillCard为纯展示+点击事件
function EquipCard({ slot, icon, level = 15, runes = [1, 2, 3, 4], onClick, isDragOver, entries = {} }: DragCardProps & { entries?: Record<string, any[]> }) {
  if (!slot) return <BlankCard />;
  const hasEquip = !!icon;
  return (
    <div className="relative flex flex-col items-center w-[92px] h-[112px] bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-700 rounded-xl shadow-lg mx-auto group hover:border-yellow-400 hover:shadow-yellow-400/40 transition-all p-0.5">
      {/* 外层卡片边框 */}
      <div
        className={`flex flex-col items-center w-full h-full bg-gray-950/90 rounded-lg border border-gray-700 p-1 ${isDragOver ? 'ring-2 ring-yellow-300' : ''}`}
        onClick={onClick}
        style={{ position: 'relative' }}
      >
        {/* 符文槽区，竖直贴合左侧 */}
        <div className="absolute left-1 top-1 flex flex-col gap-0.5 z-10">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-3.5 h-3.5 flex items-center justify-center rounded bg-gray-800 border border-gray-700">
              {typeof runes[i] === 'object' && runes[i] ? (
                <span className="text-[10px] text-blue-300">{(runes[i] as any).icon || (runes[i] as any).name || ''}</span>
              ) : (
                <span className="text-gray-500 text-base font-bold">+</span>
              )}
            </div>
          ))}
        </div>
        {/* 上方装备图片（更小） */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {hasEquip ? (
            <span className="text-lg mb-0.5 drop-shadow-lg text-yellow-200 group-hover:scale-110 transition-transform">{icon}</span>
          ) : (
            <span className="text-xs text-gray-400 font-bold mb-0.5">{slot}</span>
          )}
        </div>
        {/* 下方词条槽点 */}
        <EntryDots entries={entries} />
      </div>
      {/* 强化等级badge */}
      {hasEquip && (
        <span className="absolute top-1 right-1 bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold shadow border border-yellow-500 text-[10px] rounded-full px-1 py-0.5">
          +{level}
        </span>
      )}
    </div>
  );
}

function SkillCard({ slot, icon, level = 10, core = 1, onClick, isDragOver }: DragCardProps) {
  if (!slot) return <BlankCard />;
  const mainCore = typeof core === 'object' && core !== null && 'main' in core ? core.main : undefined;
  const subCore = typeof core === 'object' && core !== null && 'sub' in core ? core.sub : undefined;
  const mainSlotValue = mainCore || slot;
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-purple-700 rounded-xl shadow-2xl min-w-[64px] min-h-[64px] aspect-square mx-auto cursor-pointer group hover:border-purple-400 hover:shadow-purple-400/40 transition-all ${isDragOver ? 'ring-4 ring-purple-300' : ''}`}
      onClick={onClick}
    >
      <SlotArea className="flex-row gap-2 mt-4">
        <Slot value={mainSlotValue} />
        <Slot value={subCore} />
      </SlotArea>
      <span className="absolute top-1 right-1 bg-gradient-to-r from-purple-200 to-purple-400 text-purple-900 font-bold shadow border border-purple-500 text-xs rounded-full px-2 py-0.5">
        Lv.{level}
      </span>
    </div>
  );
}

function EntryLines({ entries }: { entries: Record<string, string[]> }) {
  return (
    <div className="flex flex-col gap-0.5">
      {ENTRY_TYPES.map(et => (
        entries[et.key] && entries[et.key].length > 0 ? (
          <div key={et.key} className="flex items-center gap-1 text-xs text-gray-300">
            <span className="w-8 text-right text-gray-400">{et.label}</span>
            {entries[et.key].map((v, i) => (
              <span key={i} className="bg-gray-700 px-1 rounded text-gray-200 border border-gray-600">{v}</span>
            ))}
          </div>
        ) : null
      ))}
    </div>
  );
}

// 属性累计展示（垂直单列，扁长卡片风格）
const ATTRS = [
  { key: 'gj', label: '攻击', color: 'text-yellow-300' },
  { key: 'bjl', label: '暴击率', color: 'text-blue-300' },
  { key: 'bjsh', label: '暴击伤害', color: 'text-pink-300' },
  { key: 'yczs', label: '异常增伤', color: 'text-purple-300' },
  { key: 'dbzs', label: '对Boss增伤', color: 'text-red-300' },
  { key: 'zzsh', label: '最终伤害', color: 'text-green-300' },
  { key: 'ct', label: '穿透', color: 'text-orange-300' },
  { key: 'jn', label: '技能增伤', color: 'text-indigo-300' },
];

function AttrSummary({ roleValues }: { roleValues: any }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {ATTRS.map(attr => (
        <div key={attr.key} className="flex items-center gap-2 text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-1 shadow-inner min-w-[90px]">
          <span className={`w-16 text-gray-400`}>{attr.label}</span>
          <span className={`font-bold ${attr.color}`}>{roleValues[attr.key] ?? 0}%</span>
        </div>
      ))}
    </div>
  );
}

function PanelCard({ children, color = 'yellow', className = '' }: { children: React.ReactNode, color?: 'yellow'|'blue'|'purple', className?: string }) {
  const borderColor = color === 'yellow' ? 'border-yellow-700' : color === 'blue' ? 'border-blue-700' : 'border-purple-700';
  return (
    <div className={`w-full bg-gradient-to-br from-gray-900 to-gray-950 border-4 ${borderColor} rounded-2xl shadow-2xl px-6 py-4 flex flex-col justify-center items-start mb-2 ${className}`}>
      {children}
    </div>
  );
}

// 右侧信息面板Tabs
function InfoTabs({ roleValues, selectedEquips, selectedSkills }: { roleValues: any, selectedEquips: any, selectedSkills: any }) {
  const [tab, setTab] = useState<'sum'|'detail'>('sum');
  return (
    <div className="w-full">
      <div className="flex border-b border-gray-700 mb-2">
        <button className={`px-4 py-1 font-bold text-sm ${tab==='sum' ? 'text-yellow-300 border-b-2 border-yellow-400' : 'text-gray-400'}`} onClick={()=>setTab('sum')}>合计</button>
        <button className={`px-4 py-1 font-bold text-sm ml-4 ${tab==='detail' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`} onClick={()=>setTab('detail')}>详情</button>
      </div>
      {tab==='sum' ? (
        <div className="py-2">
          <AttrSummary roleValues={roleValues} />
        </div>
      ) : (
        <div className="py-2">
          {/* 展示各装备/技能词条详情，可自定义美化 */}
          <div className="text-sm text-gray-300 font-bold mb-2">装备词条</div>
          <div className="flex flex-col gap-2 mb-4">
            {Object.entries(selectedEquips).map(([slot, equip]: any) => (
              <div key={slot} className="bg-gray-800/80 rounded-lg px-3 py-1">
                <span className="text-yellow-300 font-bold mr-2">{slot}</span>
                <span className="text-gray-400">{equip?.name}</span>
                {/* 可扩展显示词条内容 */}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-300 font-bold mb-2">技能词条</div>
          <div className="flex flex-col gap-2">
            {Object.entries(selectedSkills).map(([slot, skill]: any) => (
              <div key={slot} className="bg-gray-800/80 rounded-lg px-3 py-1">
                <span className="text-purple-300 font-bold mr-2">{slot}</span>
                <span className="text-gray-400">{skill?.name}</span>
                {/* 可扩展显示词条内容 */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 1区tab标签定义
const POOL_TABS = [
  { key: 'equip', label: '装备' },
  { key: 'runeWord', label: '符文之语' },
  { key: 'rune', label: '符文' },
  { key: 'base', label: '基础' },
  { key: 'rare', label: '稀有' },
  { key: 'epic', label: '史诗' },
  { key: 'legend', label: '传说' },
  { key: 'ancient', label: '远古' },
  { key: 'skill', label: '技能' },
  { key: 'core', label: '魂核' },
  { key: 'empower', label: '赋能' },
];

// 允许tab规则
const ALLOWED_TABS_MAP: Record<string, string[]> = {
  default: ['equip', 'runeWord', 'rune', 'base', 'rare', 'epic', 'legend', 'ancient'],
  huangyin: ['equip', 'base', 'rare', 'epic', 'legend', 'ancient'],
  skill: ['skill', 'core', 'empower'],
};

// 1区内容重构
function PoolContentV2({ type, list, searchTerm, setSearchTerm, viewMode, setViewMode, onItemClick }: any) {
  // 这里只做列表形态
  return (
    <div className="flex flex-col h-full">
      {/* 顶部工具栏 */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="search"
          placeholder="查找"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-2 py-1 rounded border border-gray-400 text-xs"
        />
        <button className={`px-2 py-1 rounded text-xs ${viewMode==='list'?'bg-yellow-200':'bg-gray-200'}`} onClick={()=>setViewMode('list')}>列表</button>
      </div>
      {/* 主体列表 */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-1">描述</th>
              <th className="p-1">等级</th>
              <th className="p-1">数值</th>
              <th className="p-1">提升</th>
              <th className="p-1">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="p-1">{item.desc}</td>
                <td className="p-1">
                  {item.levelMin !== undefined && item.levelMax !== undefined ? (
                    <div className="flex items-center gap-1">
                      <button disabled={item.level <= item.levelMin} onClick={()=>onItemClick(item, 'level-', type)} className="px-1">-</button>
                      <span>{item.level}</span>
                      <button disabled={item.level >= item.levelMax} onClick={()=>onItemClick(item, 'level+', type)} className="px-1">+</button>
                    </div>
                  ) : item.level}
                </td>
                <td className="p-1">
                  {item.valueMin !== undefined && item.valueMax !== undefined ? (
                    <input type="range" min={item.valueMin} max={item.valueMax} value={item.value} onChange={e=>onItemClick(item, 'value', type, +e.target.value)} />
                  ) : item.value}
                </td>
                <td className="p-1 text-green-500">{item.increase ? `+${item.increase}%` : '-'}</td>
                <td className="p-1">
                  <button onClick={()=>onItemClick(item, 'delete', type)} className="text-red-400">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 4区详情/编辑区域（分组展示已拖入条目，支持进度条/移除）
function DetailPanelDynamic({ assignedEntries, onValueChange, onRemove }: any) {
  if (!assignedEntries || Object.keys(assignedEntries).length === 0) {
    return <div className="text-gray-400 text-center mt-8">暂无已分配条目</div>;
  }
  return (
    <div className="p-2">
      {Object.entries(assignedEntries).map(([group, entries]: any) => (
        <div key={group} className="mb-3">
          <div className="font-bold text-sm mb-1">{group}</div>
          {entries.map((entry: any, idx: number) => (
            <div key={entry.id} className="flex items-center gap-2 mb-1 bg-gray-800 rounded px-2 py-1">
              <span className="flex-1 text-xs">{entry.name}</span>
              <input type="range" min={entry.min||0} max={entry.max||100} value={entry.value||0} onChange={e=>onValueChange(group, entry.id, +e.target.value)} className="w-24" />
              <span className="text-xs w-8 text-right">{entry.value||0}</span>
              <button className="text-xs text-red-400 hover:underline" onClick={()=>onRemove(group, entry.id)}>移除</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Cal2() {
  const { roleValues, isLocked, scoreChangeRatio } = useContext(RoleContext);
  // 拖动状态
  const [dragging, setDragging] = useState<{ type: string, from: number, id?: string }|null>(null);
  const [equipList, setEquipList] = useState(EQUIP_LAYOUT.flat().map(slot => slot));
  const [skillList, setSkillList] = useState(SKILL_LAYOUT.flat().map(slot => slot));
  const [selectedEquips, setSelectedEquips] = useState<Record<string, any>>({});
  const [selectedSkills, setSelectedSkills] = useState<Record<string, any>>({});
  const [dragOverIdx, setDragOverIdx] = useState<number|null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string|null>(null);
  // 当前激活池子Tab
  const [activePoolTab, setActivePoolTab] = useState('equip');
  const [selectedDetail, setSelectedDetail] = useState<any>(null); // 当前详情/设置内容

  // 计算当前允许的Tab key数组
  let allowedTabs: string[] = [];
  let selectedCard: any = null;
  let cardType: 'equip'|'skill' = 'equip';
  if (activePoolTab === 'equip') {
    // 选中装备卡片
    selectedCard = Object.values(selectedEquips).find(e => !!e) || null;
    cardType = 'equip';
  } else if (activePoolTab === 'skill') {
    selectedCard = Object.values(selectedSkills).find(s => !!s) || null;
    cardType = 'skill';
  }
  if (selectedCard) {
    allowedTabs = ALLOWED_TABS_MAP[cardType] || [];
  } else {
    // 默认允许全部
    allowedTabs = ['equip', 'skill', 'rune', 'runeWord', 'core', 'empower', 'entry'];
  }

  // 详情/设置区域内容渲染（此处在Cal2组件体内，selectedDetail作用域正确）
  function renderDetailPanel() {
    if (!selectedDetail) {
      return <div className="text-gray-400 text-center mt-8">点击装备/技能卡片或插槽以查看详情和设置</div>;
    }
    // 可根据selectedDetail类型渲染不同详情/设置内容
    return (
      <div className="p-4">
        <div className="text-lg font-bold mb-2">详情/设置</div>
        <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">{JSON.stringify(selectedDetail, null, 2)}</pre>
      </div>
    );
  }

  // 联动：主面板点击切换池子Tab
  function handlePanelTabSwitch(tab: string) {
    setActivePoolTab(tab);
  }

  // 拖拽处理（示例：装备池拖到装备卡槽）
  function handleEquipDrop(idx: number, slot: string) {
    if (dragging && dragging.type === 'equip') {
      if (dragging.id) {
        const equip = EQUIP_POOL.find(e => e.id === dragging.id && e.slot === slot);
        if (equip) setSelectedEquips(prev => ({ ...prev, [slot]: equip }));
      }
    }
    setDragging(null);
    setDragOverIdx(null);
    setDragOverSlot(null);
  }
  function handleSkillDrop(idx: number, slot: string) {
    if (dragging && dragging.type === 'skill') {
      if (dragging.id) {
        const skill = SKILL_POOL.find(s => s.id === dragging.id && s.slot === slot);
        if (skill) setSelectedSkills(prev => ({ ...prev, [slot]: skill }));
      }
    }
    setDragging(null);
    setDragOverIdx(null);
    setDragOverSlot(null);
  }
  function clearEquip(slot: string) {
    setSelectedEquips(prev => { const n = { ...prev }; delete n[slot]; return n; });
  }
  function clearSkill(slot: string) {
    setSelectedSkills(prev => { const n = { ...prev }; delete n[slot]; return n; });
  }

  // 各池子内容渲染
  function renderPoolContent() {
    switch (activePoolTab) {
      case 'equip':
        return (
          <div className="flex flex-row flex-wrap gap-3">
            {EQUIP_POOL.map(equip => (
              <div key={equip.id}
                className="flex flex-col items-center cursor-grab select-none bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-yellow-700 rounded-lg px-2 py-2 shadow hover:border-yellow-400 hover:shadow-yellow-400/40 transition-all min-w-[60px] min-h-[70px] max-w-[70px]"
                draggable
                onDragStart={e => { setDragging({ type: 'equip', from: -1, id: equip.id }); }}
                onClick={() => handlePanelTabSwitch('equip')}
              >
                <span className="text-2xl mb-0.5">{equip.icon}</span>
                <span className="text-xs text-yellow-200 font-bold truncate w-full text-center">{equip.name}</span>
                <span className="text-[10px] text-gray-400">{equip.slot}</span>
                <span className="text-xs bg-yellow-700 text-yellow-200 rounded px-1 mt-0.5">+{equip.level}</span>
              </div>
            ))}
          </div>
        );
      case 'skill':
        return (
          <div className="flex flex-row flex-wrap gap-3">
            {SKILL_POOL.map(skill => (
              <div key={skill.id}
                className="flex flex-col items-center cursor-grab select-none bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-purple-700 rounded-lg px-2 py-2 shadow hover:border-purple-400 hover:shadow-purple-400/40 transition-all min-w-[60px] min-h-[70px] max-w-[70px]"
                draggable
                onDragStart={e => { setDragging({ type: 'skill', from: -1, id: skill.id }); }}
                onClick={() => handlePanelTabSwitch('skill')}
              >
                <span className="text-2xl mb-0.5">{skill.icon}</span>
                <span className="text-xs text-purple-200 font-bold truncate w-full text-center">{skill.name}</span>
                <span className="text-[10px] text-gray-400">{skill.slot}</span>
                <span className="text-xs bg-purple-700 text-purple-200 rounded px-1 mt-0.5">Lv.{skill.level}</span>
              </div>
            ))}
          </div>
        );
      case 'rune':
        return (
          <div className="flex flex-row flex-wrap gap-2">
            {/* 示例符文池内容 */}
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-white font-bold cursor-grab select-none border-2 border-blue-400 hover:border-yellow-300" draggable>{i}</div>
            ))}
          </div>
        );
      case 'core':
        return (
          <div className="flex flex-row flex-wrap gap-2">
            {/* 示例魂核池内容 */}
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold cursor-grab select-none border-2 border-purple-400 hover:border-yellow-300" draggable>{i}</div>
            ))}
          </div>
        );
      case 'empower':
        return (
          <div className="flex flex-row flex-wrap gap-2">
            {/* 示例赋能池内容 */}
            {['攻击%', '防御%', '血量%', '额外属性'].map((v,i) => (
              <div key={i} className="w-14 h-8 bg-green-900 rounded flex items-center justify-center text-green-200 font-bold cursor-grab select-none border-2 border-green-400 hover:border-yellow-300" draggable>{v}</div>
            ))}
          </div>
        );
      case 'runeWord':
        return (
          <div className="flex flex-row flex-wrap gap-2">
            {/* 示例符文之语池内容 */}
            {['符文之语A','符文之语B','符文之语C'].map((v,i) => (
              <div key={i} className="w-16 h-8 bg-yellow-900 rounded flex items-center justify-center text-yellow-200 font-bold cursor-grab select-none border-2 border-yellow-400 hover:border-yellow-300" draggable>{v}</div>
            ))}
          </div>
        );
      case 'entry':
        return (
          <div className="flex flex-row flex-wrap gap-2">
            {/* 示例词条池内容 */}
            {['基础','稀有','史诗','传说','远古'].map((v,i) => (
              <div key={i} className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-gray-200 font-bold cursor-grab select-none border-2 border-gray-400 hover:border-yellow-300" draggable>{v}</div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  // 主面板点击区域自动切换池子Tab
  function handleEquipCardClick() { setActivePoolTab('equip'); }
  function handleSkillCardClick() { setActivePoolTab('skill'); }
  function handleRuneSlotClick() { setActivePoolTab('rune'); }
  function handleCoreSlotClick() { setActivePoolTab('core'); }
  function handleEmpowerClick() { setActivePoolTab('empower'); }
  function handleRuneWordClick() { setActivePoolTab('runeWord'); }
  function handleEntryClick() { setActivePoolTab('entry'); }

  return (
    <div className="w-full min-h-screen flex flex-row items-center justify-center bg-gradient-to-b from-gray-800 to-gray-950 py-6">
      {/* 1. 池化组件区域 30% */}
      <div className="h-[90vh] flex-shrink-0 border-r-2 border-dashed border-gray-600" style={{ width: '30%' }}>
        <PoolSidebar activeTab={activePoolTab} onTabChange={setActivePoolTab} allowedTabs={allowedTabs}>
          {/* 在Cal2主组件中，点击卡片时动态渲染1区和4区内容 */}
          {/* 其余拖拽/插槽规则、条目分配、进度条编辑等细节后续补充 */}
          {activePoolTab === 'equip' ? (
            <PoolContentV2 type="equip" list={Object.entries(selectedEquips).map(([slot, equip]: any) => ({
              id: equip.id,
              name: equip.name,
              desc: `${slot} ${equip.slot}`,
              level: equip.level,
              levelMin: 1,
              levelMax: ENHANCE_MAX,
              value: 0, // 数值待定
              valueMin: 0,
              valueMax: 100,
              valueIsAdjustable: false,
              increase: 0, // 提升幅度待定
            }))} searchTerm="" setSearchTerm={()=>{}} viewMode="list" setViewMode={()=>{}} onItemClick={(item: any, action: string, type: string, value?: number) => {
              if (action === 'level-') {
                setSelectedEquips(prev => ({
                  ...prev,
                  [type]: prev[type].map((e: any) => e.id === item.id ? { ...e, level: Math.max(e.levelMin || 0, e.level - 1) } : e)
                }));
              } else if (action === 'level+') {
                setSelectedEquips(prev => ({
                  ...prev,
                  [type]: prev[type].map((e: any) => e.id === item.id ? { ...e, level: Math.min(e.levelMax || ENHANCE_MAX, e.level + 1) } : e)
                }));
              } else if (action === 'value') {
                setSelectedEquips(prev => ({
                  ...prev,
                  [type]: prev[type].map((e: any) => e.id === item.id ? { ...e, value: value || 0 } : e)
                }));
              } else if (action === 'delete') {
                setSelectedEquips(prev => {
                  const newState = { ...prev };
                  delete newState[type];
                  return newState;
                });
              }
            }} />
          ) : activePoolTab === 'skill' ? (
            <PoolContentV2 type="skill" list={Object.entries(selectedSkills).map(([slot, skill]: any) => ({
              id: skill.id,
              name: skill.name,
              desc: `${slot} ${skill.slot}`,
              level: skill.level,
              levelMin: 1,
              levelMax: 14, // 技能等级上限
              value: skill.core, // 数值为魂核
              valueMin: 0,
              valueMax: 100,
              valueIsAdjustable: false,
              increase: 0, // 提升幅度待定
            }))} searchTerm="" setSearchTerm={()=>{}} viewMode="list" setViewMode={()=>{}} onItemClick={(item: any, action: string, type: string, value?: number) => {
              if (action === 'level-') {
                setSelectedSkills(prev => ({
                  ...prev,
                  [type]: prev[type].map((s: any) => s.id === item.id ? { ...s, level: Math.max(s.levelMin || 0, s.level - 1) } : s)
                }));
              } else if (action === 'level+') {
                setSelectedSkills(prev => ({
                  ...prev,
                  [type]: prev[type].map((s: any) => s.id === item.id ? { ...s, level: Math.min(s.levelMax || 14, s.level + 1) } : s)
                }));
              } else if (action === 'value') {
                setSelectedSkills(prev => ({
                  ...prev,
                  [type]: prev[type].map((s: any) => s.id === item.id ? { ...s, value: value || 0 } : s)
                }));
              } else if (action === 'delete') {
                setSelectedSkills(prev => {
                  const newState = { ...prev };
                  delete newState[type];
                  return newState;
                });
              }
            }} />
          ) : (
            <PoolContentV2 type="default" list={[]} searchTerm="" setSearchTerm={()=>{}} viewMode="list" setViewMode={()=>{}} onItemClick={()=>{}} />
          )}
        </PoolSidebar>
      </div>
      {/* 2. 装备卡片组+技能卡片组 30% */}
      <div className="flex-shrink-0 h-[90vh] border-r-2 border-dashed border-gray-600" style={{ width: '30%' }}>
        <div>
          <div className="grid grid-cols-4 gap-4 h-[40vh]">
            {equipList.map((slot, idx) => (
              <div key={slot + idx}
                onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragOverIdx(idx); setDragOverSlot(slot); }}
                onDrop={(e: React.DragEvent) => handleEquipDrop(idx, slot)}
              >
                <EquipCard
                  slot={slot}
                  icon={selectedEquips[slot]?.icon || EQUIP_ICONS[slot] || ''}
                  level={selectedEquips[slot]?.level}
                  runes={selectedEquips[slot]?.runes}
                  isDragOver={dragOverIdx === idx && dragOverSlot === slot}
                  onClick={() => { handleEquipCardClick(); setSelectedDetail(selectedEquips[slot] || { slot }); }}
                  entries={selectedEquips[slot]?.entries || {}}
                />
                {selectedEquips[slot] && (
                  <div className="flex justify-center mt-1">
                    <button className="text-xs text-gray-400 hover:text-red-400" onClick={() => clearEquip(slot)}>清空</button>
                  </div>
                )}
                {selectedEquips[slot] && (
                  <div className="text-center text-xs text-yellow-200 mt-1">{selectedEquips[slot].name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-4 h-[40vh]">
            {skillList.map((slot, idx) => (
              <div key={slot + idx}
                onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragOverIdx(idx); setDragOverSlot(slot); }}
                onDrop={(e: React.DragEvent) => handleSkillDrop(idx, slot)}
              >
                <SkillCard
                  slot={slot}
                  icon={selectedSkills[slot]?.icon || SKILL_ICONS[slot] || ''}
                  level={selectedSkills[slot]?.level}
                  core={selectedSkills[slot]?.core}
                  isDragOver={dragOverIdx === idx && dragOverSlot === slot}
                  onClick={() => { handleSkillCardClick(); setSelectedDetail(selectedSkills[slot] || { slot }); }}
                />
                {selectedSkills[slot] && (
                  <div className="flex justify-center mt-1">
                    <button className="text-xs text-gray-400 hover:text-red-400" onClick={() => clearSkill(slot)}>清空</button>
                  </div>
                )}
                {selectedSkills[slot] && (
                  <div className="text-center text-xs text-purple-200 mt-1">{selectedSkills[slot].name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 3. 属性面板及详情展示区域 20% */}
      <div className="flex flex-col flex-shrink-0 ml-4 bg-gray-900/80 rounded-xl shadow-lg p-4 h-[90vh] border-r-2 border-dashed border-gray-600" style={{ width: '20%' }}>
        <InfoTabs roleValues={roleValues} selectedEquips={selectedEquips} selectedSkills={selectedSkills} />
      </div>
      {/* 4. 详情/设置区域 20% */}
      <div className="flex flex-col flex-shrink-0 ml-4 bg-gray-900/80 rounded-xl shadow-lg p-4 h-[90vh]" style={{ width: '20%' }}>
        {/* 在Cal2主组件中，点击卡片时动态渲染1区和4区内容 */}
        {/* 其余拖拽/插槽规则、条目分配、进度条编辑等细节后续补充 */}
        {activePoolTab === 'equip' ? (
          <DetailPanelDynamic assignedEntries={selectedEquips} onValueChange={(group: string, id: string, value: number) => {
            // 模拟更新条目值
            setSelectedEquips(prev => ({
              ...prev,
              [group]: prev[group].map((item: any) => item.id === id ? { ...item, value: value } : item)
            }));
          }} onRemove={(group: string, id: string) => {
            // 模拟移除条目
            setSelectedEquips(prev => ({
              ...prev,
              [group]: prev[group].filter((item: any) => item.id !== id)
            }));
          }} />
        ) : activePoolTab === 'skill' ? (
          <DetailPanelDynamic assignedEntries={selectedSkills} onValueChange={(group: string, id: string, value: number) => {
            // 模拟更新条目值
            setSelectedSkills(prev => ({
              ...prev,
              [group]: prev[group].map((item: any) => item.id === id ? { ...item, value: value } : item)
            }));
          }} onRemove={(group: string, id: string) => {
            // 模拟移除条目
            setSelectedSkills(prev => ({
              ...prev,
              [group]: prev[group].filter((item: any) => item.id !== id)
            }));
          }} />
        ) : (
          renderDetailPanel()
        )}
      </div>
    </div>
  );
} 