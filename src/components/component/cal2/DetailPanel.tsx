import React from 'react';
import { useCal2, EquipDetail, SkillDetail, QUALITY_LIST, TYPE_COLORS, JobDetail } from './Cal2Context';
import { FLOAT, float } from 'html2canvas/dist/types/css/property-descriptors/float';

export interface DetailPanelProps {
  code: string; // 传入 code
  onEdit?: (patch: any) => void;
  onRemove?: () => void;
  onRemoveEntry?: (entryCode: string, group: string, id?: string) => void; // 新增：移除词条
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
function ProgressBar({ value, min = 0, max = 100, onChange, quality = 'base', step = 0.1 }: { 
  value: number, 
  min?: number, 
  max?: number, 
  onChange?: (v: number) => void,
  quality?: string ,
  step?: number
}) {
  step = step || 0.1;
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
      {onChange && <button className="px-2 bg-gray-200 rounded" onClick={()=>onChange(Math.max(Number(min), (Number(value)-step)))}>-</button>}
      {/*添加双击可手动输入数值*/}
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={e=>onChange && onChange(Number(e.target.value))} 
        className={`w-full ${getProgressColor(quality)}`} 
      />
      {onChange && <button className="px-2 bg-gray-200 rounded" onClick={()=>onChange(Math.min(Number(max), (Number(value)+step)))}>+</button>}
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
  } else if (type === 'jn') {
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
  } else {
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-4">
        {/* 词条分组骨架 */}
        {["角色基础", "天赋属性", "界限超越","时装", "称号"].map((group, gi) => (
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
          group.entries?.length > 0 && group.entries[0]?.code && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries
              .map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group" style={{color: TYPE_COLORS[entry.value<2?'rare':(entry.value<5?'epic':(entry.value<9?'legend':'myth'))]}}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.name}</span>
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
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
                    equip.fwzycts?.filter(fwzyct=>fwzyct.relatedLvN?.[entry.value.toString()]).map(fwzyct=>
                      <div className="flex items-center gap-2 mb-1" key={fwzyct.code}>
                        <div className="text-xs flex-1 text-gray-500">{('·' + ((fwzyct.condition)||' ') + fwzyct.desc)}</div>
                        <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{fwzyct.relatedLvN?.[equip.fwzy.value.toString()]}</span>
                      </div>
                    )
                  )}
                  <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v, condition: entry.condition}):undefined} quality={entry.quality} />
                </div>
              ))}
            </div>
          )
        ))}


        {/* 词条分组渲染 */}
        {[{label:'基础属性',entries:equip.basects,color:'gray'},{label:'强化',entries:equip.qhcts||[],color:'gray'},{label:'稀有词条',entries:equip.rarects,color:'blue-700'},{label:'史诗词条',entries:equip.epiccts,color:'purple-700'},{label:'传说词条',entries:equip.legendcts,color:'orange-700'},{label:'远古词条',entries:equip.ancientcts,color:'cyan-700'}].map(group=>(
          group.entries?.length > 0 && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1" style={{color: TYPE_COLORS[entry.quality]}}>
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.name||entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value + (entry.unit||'')}</span>
                    {onRemoveEntry && (
                      <button 
                        onClick={() => onRemoveEntry(entry.code, group.label, entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs px-1"
                        title="移除词条"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {entry.isEdit?<ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({ code, group: group.label, entryCode: entry.code, value: v, condition: entry.condition,id: entry.id||''}):undefined} quality={entry.quality} />:''}
                </div>
              ))}
            </div>
          )
        ))}
      
        {/* 套装 */}
        <div className="font-bold text-sm text-green-700 mb-1">套装词条</div>
        {equip.zb.tzcts && equip.zb.tzcts?.map((tzct:any)=>{
          const tzjs = equip.zb.tz.relatedZb.reduce((acc:number,z:string)=>acc+(data[z]?.zb?.tz?.code===equip.zb.tz.code?1:0)+(data[z]?.ancientcts?.find((ct:any)=>ct.code==='tzjsjy')?1:0),0);
          console.log("tzjs:", tzct.need, tzjs);
          return (
          tzct.need<=tzjs && 
          <div className="mt-2" key={tzct.code} style={{color: 'green'}}>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-bold text-sm text-green-700 mb-1">{equip.zb.tz?.name + '(' + tzct.need + ')'}</div>
                <span className="flex-1 text-xs text-gray-700">{tzct.desc}</span>
                <span className={`text-xs ${ENTRY_QUALITY_COLORS[tzct.quality] || 'text-gray-600'}`}>{tzct.value + (tzct.unit||'')}</span>
              </div>
            </div>
          </div>
        )})}
      </div>
    );
  }
  // 技能详情
  if ('jn' in detail) {
    const skill = detail as SkillDetail;
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-4">
        {/* 顶部：名称+图片 */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xl font-bold">{skill.jn?.name}</div>
            <div className="mt-1 text-sm text-gray-500">Lv{skill.jn.level} {Number(skill.jn.multiplier)+(skill.jn?.level-1)*(skill.jn?.growth)}%</div>
            {skill.jn.isEdit ? <ProgressBar value={skill.jn.level} min={skill.jn.min} max={skill.jn.max} onChange={onEdit? v=>onEdit({code, group: '技能', entryCode: 'jn', value: v}):undefined} quality={skill.jn.quality} /> : ''}
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
            {skill.jn?.pic ? <img src={skill.jn.pic} alt={skill.jn.name} className="object-cover w-full h-full" /> : <span className="text-3xl text-gray-400">+</span>}
          </div>
        </div>
        {/* 主卡魂核 */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-1">
              {skill.zk?.pic ? <img src={skill.zk.pic} alt={skill.zk.name} className="w-14 h-14 rounded-full" /> : <span className="text-2xl text-gray-400">+</span>}
            </div>
            {/* 星级 */}
            <div className="flex items-center gap-0.2">
              {Array.from({length: Math.floor(skill.zk?.value/4)}).map((_,i)=>(
                <span key={'sun-'+i} title="太阳" className="text-yellow-400 text-sm">☀️</span>
              ))}
              {Array.from({length: skill.zk?.value%4}).map((_,i)=>(
                <span key={'star-'+i} title="星星" className="text-yellow-400 text-sm">⭐</span>
              ))}
            </div>
            <ProgressBar value={skill.zk?.value} min={skill.zk?.min} max={skill.zk?.max} onChange={onEdit? v=>onEdit({code, group: '主卡', entryCode: 'jn', value: v, condition: ''}):undefined} quality={skill.jn.quality} />
          </div>
          {/* 副卡魂核 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-1">
              {skill.fk?.pic ? <img src={skill.fk?.pic} alt={skill.fk?.name} className="w-14 h-14 rounded-full" /> : <span className="text-2xl text-gray-400">+</span>}
            </div>
            {/* 星级 */}
            <div className="flex items-center gap-0.2">
              {Array.from({length: Math.floor(skill.fk?.value/4)}).map((_,i)=>(
                <span key={'sun-'+i} title="太阳" className="text-yellow-400 text-sm">☀️</span>
              ))}
              {Array.from({length: skill.fk?.value%4}).map((_,i)=>(
                <span key={'star-'+i} title="星星" className="text-yellow-400 text-sm">⭐</span>
              ))}
            </div>
            <ProgressBar value={skill.fk?.value} min={skill.fk?.min} max={skill.fk?.max} onChange={onEdit? v=>onEdit({code, group: '副卡', entryCode: 'jn', value: v, condition: ''}):undefined} quality={skill.jn.quality} />
          </div>
        </div>

        {/* 技能词条分组渲染 */}
        {[
          {label:'基础属性',entries:skill.zk.basects||[],color:'gray-800'}
        ].map(group=>(
          group.entries?.length > 0 && group.entries[0] && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value + (entry.unit||'')}</span>
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
                  {entry.isEdit ? <ProgressBar value={entry.value} min={entry.min} max={entry.max} step={1} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v, condition: ''}):undefined} quality={entry.quality} /> : ''}
                </div>
              ))}
            </div>
          )
        ))}

        {/* 技能词条分组渲染 */}
        {[
          {label:'主动魂技',entries:[skill.zk.hj1],color:'gray-800'},
          {label:'被动魂技',entries:[skill.zk.hj2],color:'gray-800'},
          {label:'临时魂技',entries:[skill.zk.hj3],color:'gray-800'},
          {label:'灵',entries:[skill.zk.hj4],color:'gray-800'},
          {label:'躯',entries:[skill.zk.hj5],color:'gray-800'},
          {label:'忆',entries:[skill.zk.hj6],color:'gray-800'}
        ].map(group=>(
          group.entries?.length > 0 && group.entries[0] && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.relatedLvN?.[entry.value] + (entry.unit||'')}</span>
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
                  {entry.isEdit ? <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v, condition: ''}):undefined} quality={entry.quality} /> : ''}
                </div>
              ))}
            </div>
          )
        ))}

        {/* 羁绊 */}
        {[
          // {label:'羁绊',entries:[skill.zk.fn],color:'purple-700'},
          {label:skill.fk.jb?skill.fk.jb.name:skill.zk.jb?.name,entries:skill.fk.jb?(skill.fk.jbcts.filter(ct=>ct.isActive)):(skill.zk.jbcts.filter(ct=>ct.isActive)),color:'blue-700'}
        ].map(group=>(
          group.entries?.length>0 &&(
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.calculatedValue + (entry.unit||'')}</span>
                    {onRemoveEntry && (
                      <button 
                        onClick={() => onRemoveEntry(entry.code, group?.label||'')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs px-1"
                        title="移除词条"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {entry.isEdit ? <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v, condition: ''}):undefined} quality={entry.quality} /> : ''}
                </div>
              ))}
            </div>
          )
        ))

        }
        {/* 赋能 */}
        {[
          {label:skill.fn?.name,entries:[skill.fn],color:'purple-700'}
        ].map(group=>(
          skill.fn && group.entries?.length>0 &&(
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value + (entry.unit||'')}</span>
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
                  {entry.isEdit ? <ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: "赋能", entryCode: entry.code, value: v, condition: entry.condition}):undefined} quality={entry.quality} />:''}
                </div>
              ))}
            </div>
          )
        ))

        }
        {/* 注灵 */}
        {[
          {label:"注灵",entries:[...skill.zk.zlcts?skill.zk.zlcts:[]],color:'purple-700'}
        ].map(group=>(
          skill.zk && group.entries?.length>0 &&(
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}突破次数</div>
              <ProgressBar value={group.entries[0].value} min={0} max={9} onChange={onEdit? v=>onEdit({code, group: "注灵", entryCode: "zl", value: v, condition: ''}):undefined} quality={group.entries[0]?.quality} />
              {group.entries.map((entry,i)=>(
                <div key={entry.code||i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value*entry.multiplier + (entry.unit||'')}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ))
        }
      </div>
    );
  }
  // 角色
  if (detail.type === 'job') {
    const job = detail as JobDetail;
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-4">
        {/* 词条分组渲染 */}
        {[{label:'角色属性',entries:job.jccts,color:'gray'},{label:'天赋',entries:job.tfcts,color:'blue-700'},{label:'命运星盘',entries:job.xpcts,color:'purple-700'},{label:'界限超越',entries:job.cycts,color:'orange-700'},{label:'时装',entries:job.szcts,color:'cyan-700'},{label:'称号',entries:job.chcts,color:'cyan-700'}].map(group=>(
          group.entries?.length > 0 && (
            <div className="mt-2" key={group.label}>
              <div className={`font-bold text-sm text-${group.color} mb-1`}>{group.label}</div>
              {group.entries.map((entry,i)=>(
                <div key={i} className="mb-2 relative group">
                  <div className="flex items-center gap-2 mb-1" style={{color: TYPE_COLORS[entry.quality]}}>
                    {entry.condition&&entry.condition!==''?<span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.condition||''}</span>:''}
                    <span className={`flex-1 text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.desc}</span>
                    <span className={`text-xs ${ENTRY_QUALITY_COLORS[entry.quality] || 'text-gray-600'}`}>{entry.value + (entry.unit||'')}</span>
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
                  {entry.isEdit?<ProgressBar value={entry.value} min={entry.min} max={entry.max} onChange={onEdit? v=>onEdit({code, group: group.label, entryCode: entry.code, value: v, condition: entry.condition}):undefined} quality={entry.quality} />:''}
                </div>
              ))}
            </div>
          )
        ))}
      
      </div>
    );
  }
  return null;
};

export default DetailPanel;
