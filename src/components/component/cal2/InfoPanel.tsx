import React, { useState, useContext } from 'react';
import { RoleContext } from '@/contexts/RoleContext';
import { EquipDetail, SkillDetail, useCal2, CT, TYPE_COLORS, showSummary } from './Cal2Context';


const ATTRS = [
  { key: '攻击', label: '攻击力', color: 'red' },
  { key: '生命', label: '生命值', color: 'blue' },
  { key: '防御', label: '防御力', color: 'gray' },
  { key: '暴击率', label: '暴击率', color: 'purple' },
  { key: '暴击伤害', label: '暴击伤害', color: 'yellow' },
  { key: '最终伤害', label: '最终伤害', color: 'teal' },
  { key: '全属性伤害', label: '全属性伤害', color: 'blue' },
  { key: '火伤', label: '火伤', color: 'red' },
  { key: '雷伤', label: '雷伤', color: 'yellow' },
  { key: '毒伤', label: '毒伤', color: 'green' },
  { key: '冰伤', label: '冰伤', color: 'cyan' },
  { key: '穿透', label: '穿透', color: 'orange' },
  { key: '减抗', label: '减抗', color: 'green' },
  { key: '技能伤害', label: '技能伤害', color: 'red' },
  { key: '普攻伤害', label: '普攻伤害', color: 'purple' },
  { key: '破招伤害', label: '破招伤害', color: 'purple' },
  { key: '对首领目标伤害提升', label: '对首领目标伤害提升', color: 'cyan' },
  { key: '对异常目标伤害提升', label: '对异常目标伤害提升', color: 'gray' },
];

const CONDITIONS = [
  { key: '进入战斗后', label: '进入战斗后', color: 'red' },
  { key: '释放技能时', label: '释放技能时', color: 'blue' },
  { key: '自身生命值等于100%时', label: '自身生命值等于100%时', color: 'blue' },
  { key: '自身生命值高于80%时', label: '自身生命值高于80%时', color: 'gray' },
  { key: '自身生命值高于50%时', label: '自身生命值高于50%时', color: 'purple' },
  { key: '自身生命值低于30%时', label: '自身生命值低于30%时', color: 'yellow' },
  { key: '自身生命值低于20%时', label: '自身生命值低于20%时', color: 'teal' },
  { key: '自身生命值低于40%时', label: '自身生命值低于40%时', color: 'orange' },
  { key: '自身生命值低于80%时', label: '自身生命值低于80%时', color: 'green' },
  { key: '自身生命值低于100%时', label: '自身生命值低于100%时', color: 'red' },
  { key: '目标生命值等于100%时', label: '目标生命值等于100%时', color: 'blue' },
  { key: '目标生命值高于80%时', label: '目标生命值高于80%时', color: 'gray' },
  { key: '目标生命值高于50%时', label: '目标生命值高于50%时', color: 'purple' },
  { key: '目标生命值低于30%时', label: '目标生命值低于30%时', color: 'yellow' },
  { key: '目标生命值低于20%时', label: '目标生命值低于20%时', color: 'teal' },
  { key: '目标生命值低于40%时', label: '目标生命值低于40%时', color: 'orange' },
  { key: '目标生命值低于80%时', label: '目标生命值低于80%时', color: 'green' },
  { key: '目标生命值低于100%时', label: '目标生命值低于100%时', color: 'red' },
  { key: '自身生命值低于30%时', label: '自身生命值低于30%时', color: 'yellow' },
  { key: '闪避后', label: '闪避后', color: 'teal' },
  { key: '余魂后', label: '余魂后', color: 'orange' },
  { key: '破招成功后', label: '破招成功后', color: 'green' },
  { key: '对异常目标', label: '对异常目标', color: 'red' },
  { key: '首次造成技能伤害时', label: '首次造成技能伤害时', color: 'blue' },
  { key: '对首领目标', label: '对首领目标', color: 'gray' },
  { key: '对普通目标', label: '对普通目标', color: 'purple' },
  { key: '对冰异常目标', label: '对冰异常目标', color: 'cyan' },
  { key: '对毒异常目标', label: '对毒异常目标', color: 'teal' },
  { key: '对火异常目标', label: '对火异常目标', color: 'orange' },
  { key: '对雷异常目标', label: '对雷异常目标', color: 'yellow' },
  { key: '雷属性伤害附加', label: '雷属性伤害附加', color: 'yellow' },
  { key: '火属性伤害附加', label: '火属性伤害附加', color: 'orange' },
  { key: '毒属性伤害附加', label: '毒属性伤害附加', color: 'teal' },
  { key: '冰属性伤害附加', label: '冰属性伤害附加', color: 'cyan' },
  { key: '攻击附加', label: '攻击附加', color: 'gray' },
  { key: '普攻附加', label: '普攻附加', color: 'orange' }
];

const UNITS = [
  { key: '%', label: '百分比', color: 'yellew' },
  { key: 's', label: '秒', color: 'blue' },
  { key: '', label: '基础', color: 'gray' }
];

const InfoPanel: React.FC<{}> = () => {
  const { roleValues } = useContext(RoleContext);
  const { data, validEntriesSummary } = useCal2();
  console.log("validEntriesSummary:", validEntriesSummary);
  // 使用全局汇总数据，不再需要临时计算
  const [tab, setTab] = useState<'sum'|'detail'>('sum');
  
  return (
    <div className="w-full p-4 rounded-xl shadow-lg ml-4">
      <div className="flex border-b border-gray-700 mb-2">
        <button className={`px-4 py-1 font-bold text-sm ${tab==='sum' ? 'text-blue-300 border-b-2 border-blue-400' : 'text-gray-400'}`} onClick={()=>setTab('sum')}>合计</button>
        <button className={`px-4 py-1 font-bold text-sm ml-4 ${tab==='detail' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`} onClick={()=>setTab('detail')}>详情</button>
      </div>
      {tab==='sum' ? (
        <div className="py-2">
          {showSummary.map((item: any, index: number) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between text-xs text-gray-300 mb-1" title={validEntriesSummary.attrSummary[item.key]?.sources?.map((source: any) => source.sourceName).join(', ')}>
                <span>{item.key}</span>
                <span className="font-bold text-white">{validEntriesSummary.attrSummary[item.key]?.total}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-2">          
          {validEntriesSummary.ctEntries.length > 0 && (
            <div className="mb-2">
              {validEntriesSummary.ctEntries.sort((a, b) => (a.condition?.length||0) - (b.condition?.length||0)).map((ct: CT, index: number) => (
                <div key={index} className="bg-gray-800/80 rounded-lg px-3 py-1 mb-1" style={{color: TYPE_COLORS[ct.quality||'base']}}>
                  <span className="text-xs text-gray-500 ml-2">来源: {ct.sourceName}</span>
                  <span className="text-blue-300 font-bold mr-2">{ct.condition}</span>
                  <span className="text-blue-300 font-bold mr-2">{ct.name?ct.name:ct.desc}</span>
                  <span className="text-gray-400">{ct.calculatedValue} {ct.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
