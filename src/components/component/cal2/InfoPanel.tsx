import React, { useState, useContext } from 'react';
import { RoleContext } from '@/contexts/RoleContext';
import { EquipDetail, SkillDetail } from './Cal2Context';


export interface InfoPanelProps {
  equips: Record<string, EquipDetail[]>;
  skills: Record<string, SkillDetail[]>;
}

const ATTRS = [
  { key: 'gj', label: '攻击力', color: 'bg-red-500' },
  { key: 'hp', label: '生命值', color: 'bg-blue-500' },
  { key: 'def', label: '防御力', color: 'bg-gray-400' },
  { key: 'bjl', label: '暴击率', color: 'bg-purple-400' },
  { key: 'bjsh', label: '暴击伤害', color: 'bg-yellow-400' },
  { key: 'move', label: '移动速度', color: 'bg-teal-400' },
  { key: 'element', label: '元素伤害', color: 'bg-orange-400' },
];

const InfoPanel: React.FC<InfoPanelProps> = ({ equips, skills }) => {
  const { roleValues } = useContext(RoleContext);
  const [tab, setTab] = useState<'sum'|'detail'>('sum');
  return (
    <div className="w-full bg-[#181f2a] p-4 rounded-xl shadow-lg ml-4">
      <div className="flex border-b border-gray-700 mb-2">
        <button className={`px-4 py-1 font-bold text-sm ${tab==='sum' ? 'text-blue-300 border-b-2 border-blue-400' : 'text-gray-400'}`} onClick={()=>setTab('sum')}>合计</button>
        <button className={`px-4 py-1 font-bold text-sm ml-4 ${tab==='detail' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`} onClick={()=>setTab('detail')}>详情</button>
      </div>
      {tab==='sum' ? (
        <div className="py-2">
          {ATTRS.map(attr => (
            <div key={attr.key} className="mb-2">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>{attr.label}</span>
                <span className="font-bold text-white">{roleValues[attr.key as keyof typeof roleValues] ?? 0}</span>
              </div>
              <div className="w-full h-2 rounded bg-gray-700 overflow-hidden">
                <div className={`${attr.color} h-2 rounded`} style={{width: `${Math.min(100, Number(roleValues[attr.key as keyof typeof roleValues]) / 200 * 100)}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-2">
          <div className="text-sm text-gray-300 font-bold mb-2">装备词条</div>
          {Object.entries(equips).map(([group, list]) => (
            <div key={group} className="mb-2">
              <div className="text-xs text-gray-400 mb-1">{group}</div>
              {list.map((equip, idx) => (
                <div key={idx} className="bg-gray-800/80 rounded-lg px-3 py-1 mb-1">
                  <span className="text-yellow-300 font-bold mr-2">{equip.name}</span>
                  <span className="text-gray-400">{equip.basects.map(ct=>ct.name).join('、')}</span>
                </div>
              ))}
            </div>
        ))}
          <div className="text-sm text-gray-300 font-bold mb-2">技能词条</div>
          {Object.entries(skills).map(([group, list]) => (
            <div key={group} className="mb-2">
              <div className="text-xs text-gray-400 mb-1">{group}</div>
              {list.map((skill, idx) => (
                <div key={idx} className="bg-gray-800/80 rounded-lg px-3 py-1 mb-1">
                  <span className="text-purple-300 font-bold mr-2">{skill.name}</span>
                  <span className="text-gray-400">{skill?.mainSoul.activeSkill}</span>
                </div>
              ))}
            </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default InfoPanel;
