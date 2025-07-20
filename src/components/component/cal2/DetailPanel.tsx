import React from 'react';
import { useCal2, EquipDetail, SkillDetail, QUALITY_LIST } from './Cal2Context';
import { FLOAT, float } from 'html2canvas/dist/types/css/property-descriptors/float';

export interface DetailPanelProps {
  code: string; // 传入 code
  onEdit?: (patch: any) => void;
  onRemove?: () => void;
  onRemoveEntry?: (entryCode: string, group: string) => void; // 新增：移除词条
}

// 装备品质颜色映射
const QUALITY_COLORS: Record<string, string> = {
  'legend': 'text-orange-500',
  'ancient': 'text-cyan-500',
  'suit': 'text-green-500',
  'myth': 'text-purple-500',
  'immortal': 'text-yellow-500',
};

// 词条品质颜色映射
const ENTRY_QUALITY_COLORS: Record<string, string> = {
  'base': 'text-gray-600',
  'rare': 'text-blue-500',
  'epic': 'text-purple-500',
  'legend': 'text-orange-500',
  'ancient': 'text-cyan-500',
  'myth': 'text-purple-600',
  'immortal': 'text-yellow-500',
};

// 进度条组件
function ProgressBar({ value, min = 0, max = 100, onChange, quality = 'base' }: { 
  value: number, 
  min?: number, 
  max?: number, 
  onChange?: (v: number) => void,
  quality?: string 
}) {
  const step = 0.1; // 支持小数点后1位
  
  // 根据品质获取进度条颜色
  const getProgressColor = (quality: string) => {
    switch (quality) {
      case 'base': return 'bg-gray-300';
      case 'rare': return 'bg-blue-300';
      case 'epic': return 'bg-purple-300';
      case 'legend': return 'bg-orange-300';
      case 'ancient': return 'bg-cyan-300';
      case 'myth': return 'bg-purple-400';
      case 'immortal': return 'bg-yellow-300';
      default: return 'bg-gray-300';
    }
  };
  
  return (
    <div className="flex items-center gap-2 w-full">
      {/* <span className="text-xs w-12 text-right">{min.toFixed(1)}</span> */}
      {onChange && <button className="px-2 bg-gray-200 rounded" onClick={()=>onChange(Math.max(min, Math.round((value-step)*10)/10))}>-</button>}
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={e=>onChange && onChange(Number(e.target.value))} 
        className={`w-full ${getProgressColor(quality)}`}
      />
      {onChange && <button className="px-2 bg-gray-200 rounded" onClick={()=>onChange(Math.min(max, Math.round((value+step)*10)/10))}>+</button>}
      {/* <span className="text-xs w-12 text-right">{max.toFixed(1)}</span> */}
    </div>
  );
}

// 骨架mock卡片
function SkeletonPanel({ type }: { type: string }) {
  if (type === 'equip') {
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-6 opacity-70 animate-pulse">
        {/* 顶部：大图占位+标题 */}
        <div className="flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-7 w-40 bg-gray-300 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-28 h-28 bg-gray-300 rounded-xl flex items-center justify-center text-5xl text-gray-400">
            <span className="">🗃️</span>
          </div>
        </div>
        {/* 符文孔区 */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1">
            {[0,1,2,3].map(i=>(
              <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-300 bg-gray-200 flex items-center justify-center text-2xl text-gray-400">+</div>
            ))}
          </div>
        </div>
        {/* 属性分组骨架 */}
        {["基础属性", "稀有词条", "史诗词条", "传说词条", "远古词条", "套装词条"].map((group, gi) => (
          <div key={gi} className="mt-2">
            <div className="h-5 w-28 bg-gray-200 rounded mb-2" >{group}</div>
            {[0,1].map(j=>(
              <div key={j} className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex-1 h-4 bg-gray-200 rounded w-32" />
                  <span className="h-4 w-10 bg-gray-200 rounded" />
                </div>
                <div className="h-4 bg-gray-300 rounded w-full" />
              </div>
            ))}
            <div className="border-b border-dashed border-gray-200 my-2" />
          </div>
        ))}
      </div>
    );
  } else {
    // skill
  return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-6 opacity-70 animate-pulse">
        {/* 顶部：大图占位+标题 */}
        <div className="flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-7 w-40 bg-gray-300 rounded mb-2" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
          <div className="w-28 h-28 bg-gray-300 rounded-xl flex items-center justify-center text-5xl text-gray-400">
            <span className="">✨</span>
          </div>
        </div>
        {/* 主副魂核占位 */}
        <div className="flex items-center gap-10">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-gray-400">★</div>
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-gray-400">★</div>
        </div>
        {/* 词条分组骨架 */}
        {["主卡魂技", "副卡羁绊", "赋能词条"].map((group, gi) => (
          <div key={gi} className="mt-2">
            <div className="h-5 w-28 bg-gray-200 rounded mb-2" >{group}</div>
            {[0,1].map(j=>(
              <div key={j} className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex-1 h-4 bg-gray-200 rounded w-32" />
                  <span className="h-4 w-10 bg-gray-200 rounded" />
                </div>
                <div className="h-4 bg-gray-300 rounded w-full" />
              </div>
            ))}
            <div className="border-b border-dashed border-gray-200 my-2" />
          </div>
        ))}
    </div>
  );
}
}

const DetailPanel: React.FC<DetailPanelProps> = ({ code, onEdit, onRemove, onRemoveEntry }) => {
  const { data } = useCal2();
  if (!code) return <div className="text-gray-400">未选择任何对象</div>;
  const detail = data[code];
  console.log("code:", code,"data:", data, "detail:", detail);
  // 判断是否需要显示骨架：1. 没有数据 
  let showSkeleton = false;
  let type: string = detail?.type || 'equip';
  if (!detail || detail.name==='') {
    showSkeleton = true;
  }
  if (showSkeleton) {
    return <SkeletonPanel type={type} />;
  }

  // 装备详情
  if ('zb' in detail) {
    const equip = detail as EquipDetail;
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-4">
        {/* 顶部：大图占位+标题 */}
        <div className="flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-7 w-40 bg-gray-300 rounded mb-2">名称：{equip.zb?.desc || code}</div>
            <div className="h-5 w-24 bg-gray-200 rounded">品质：{QUALITY_LIST.find(q=>q.key===equip.zb?.quality)?.label || ' '}</div>
          </div>
          <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-5xl text-gray-400">
            {equip.zb?.pic ? <img src={equip.zb.pic} alt={equip.zb.name} className="object-cover w-full h-full" key={equip.zb.pic} /> : <span className="text-3xl text-gray-400">+</span>}
          </div>
        </div>
        {/* 符文孔区 */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1">
            {[0,1,2,3].map(i=>(
              <div className="items-center" key={i}>
                <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-300 bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                  {equip.fws[i] ? <img src={equip.fws[i].pic||''} alt={equip.fws[i].name} className="w-16 h-11 rounded-full" key={equip.fws[i].pic} /> : '+'}
                </div>
                <span className="text-sm text-gray-500">{(equip.fws[i]?.name)||'待选' + (equip.fws[i]?.value||'')}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 符文词条渲染 */}
        {[{label:'符文之语',entries:[equip.fwzy],color:'gray-800'},{label:'符文',entries:equip.fws,color:'blue-700'}].map(group=>(
          group.entries?.length > 0 && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.name}</span>
                    {group.label==='符文'&&<div className="text-xs text-gray-500">{(equip.fws[i].desc + ' ' + equip.fws[i].relatedLvN?.[entry.value.toString()]||' ')}</div>}
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>Lv{entry.value}</span>
                    {onRemoveEntry && (
                      <button 
                        onClick={() => onRemoveEntry(entry.code, group.label)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs px-1"
                        title="移除词条"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {group.label==='符文之语'&&(
                    equip.fwzycts?.map(fwzyct=>
                      <div className="flex items-center gap-2 mb-1" key={fwzyct.code}>
                        <div className="text-xs flex-1 text-gray-500">{('·' + ((fwzyct.condition)||' ') + fwzyct.desc)}</div>
                        <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{fwzyct.relatedLvN?.[entry.value.toString()]}</span>
                      </div>
                    )
                  )}
                  <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v}):undefined} quality={entry.quality} />
                </div>
              ))}
            </div>
          )
        ))}


        {/* 词条分组渲染 */}
        {[{label:'基础属性',entries:equip.basects,color:'gray-800'},{label:'稀有词条',entries:equip.rarects,color:'blue-700'},{label:'史诗词条',entries:equip.epiccts,color:'purple-700'},{label:'传说词条',entries:equip.legendcts,color:'orange-700'},{label:'远古词条',entries:equip.ancientcts,color:'cyan-700'}].map(group=>(
          group.entries?.length > 0 && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.name}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value}</span>
                    {onRemoveEntry && (
                      <button 
                        onClick={() => onRemoveEntry(entry.code, group.label)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs px-1"
                        title="移除词条"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v}):undefined} quality={entry.quality} />
                </div>
              ))}
            </div>
          )
        ))}
       
        {/* 套装 */}
        {equip.tz && <div className="mt-2 font-bold text-green-700">Suit: {equip.tz}</div>}
      </div>
    );
  }
  // 技能详情
  if ('skill' in detail) {
    const skill = detail as SkillDetail;
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-4">
        {/* 顶部：名称+图片 */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xl font-bold">{skill.skill?.name || code}</div>
            <div className="mt-1 text-sm text-gray-500">Lv: {skill.skill?.level} Growth: {skill.skill?.growth}</div>
            <div className="mt-1 text-sm text-gray-500">Multiplier: {skill.skill?.multiplier}</div>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            {skill.skill?.image ? <img src={skill.skill.image} alt={skill.skill.name} className="object-cover w-full h-full" /> : <span className="text-3xl text-gray-400">+</span>}
          </div>
        </div>
        {/* 主卡魂核 */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-1">
              {skill.mainSoul?.image ? <img src={skill.mainSoul.image} alt={skill.mainSoul.name} className="w-14 h-14 rounded-full" /> : <span className="text-2xl text-gray-400">+</span>}
            </div>
            <div className="flex gap-1 items-center">
              {[1,2,3,4].map((n,i)=>(<span key={i} className={n<=skill.mainSoul.star ? (n===4 ? 'text-yellow-500' : 'text-orange-400') : 'text-gray-300'}>{n===4?'☀':'★'}</span>))}
            </div>
          </div>
          {/* 副卡魂核 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-1">
              {skill.subSoul?.image ? <img src={skill.subSoul.image} alt={skill.subSoul.name} className="w-14 h-14 rounded-full" /> : <span className="text-2xl text-gray-400">+</span>}
            </div>
            <div className="text-xs text-gray-500">Star: {skill.subSoul?.star}</div>
          </div>
        </div>
        {/* 主卡魂技词条 */}
        {skill.mainSoul.activeSkill && (
          <div className="mt-2">
            <div className="font-bold text-sm text-gray-800 mb-1">Active Skill</div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex-1 text-xs text-gray-700">{skill.mainSoul.activeSkill.desc}</span>
                <span className="text-xs">{skill.mainSoul.activeSkill.value}</span>
              </div>
              <ProgressBar value={skill.mainSoul.activeSkill.value} min={skill.mainSoul.activeSkill.min} max={skill.mainSoul.activeSkill.max} onChange={onEdit? v=>onEdit({code, group:'mainSoul', entryCode: skill.mainSoul.activeSkill.code, value:v}):undefined} quality={skill.mainSoul.activeSkill.quality} />
            </div>
          </div>
        )}
        {/* 赋能词条 */}
        {skill.mainSoul.empower && (
          <div className="mt-2">
            <div className="font-bold text-sm text-purple-700 mb-1">Empower</div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex-1 text-xs text-purple-700">{skill.mainSoul.empower.desc}</span>
                <span className="text-xs">{skill.mainSoul.empower.value}</span>
              </div>
              <ProgressBar value={skill.mainSoul.empower.value} min={skill.mainSoul.empower.min} max={skill.mainSoul.empower.max} onChange={onEdit? v=>onEdit({code, group:'mainSoulEmpower', entryCode: skill.mainSoul.empower.code, value:v}):undefined} quality={skill.mainSoul.empower.quality} />
            </div>
          </div>
        )}
        {/* 副卡羁绊词条 */}
        {skill.subSoul.bond && (
          <div className="mt-2">
            <div className="font-bold text-sm text-blue-700 mb-1">Bond</div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex-1 text-xs text-blue-700">{skill.subSoul.bond}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default DetailPanel;
