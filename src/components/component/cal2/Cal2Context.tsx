import React, { createContext, useContext, useState, useEffect } from 'react';

// 类型定义
export interface CT {
  code: string; // 词条唯一标识
  name: string;
  condition: string;
  desc: string;
  value: number;
  quality: string;
  isEdit: boolean;
  min?: number;
  max?: number;
  unit?: string;
}

export interface FW {
  code: string;
  name: string;
  condition: string;
  pic: string;
  desc: string;
  value: number;
  quality: string;
  isEdit: boolean;
  min?: number;
  max?: number;
  unit?: string;
  relatedLvN?: Record<string, number>;
}

export interface EquipDetail {
  type: string;
  name: string;
  zb: any; // 装备本体
  fws: FW[];
  fwzy: any;
  basects: CT[];
  rarects: CT[];
  epiccts: CT[];
  legendcts: CT[];
  ancientcts: CT[];
  tz: string;
  fwzycts?: any[];
}

export interface SkillDetail {
  type: string;
  name: string;
  skill: any;
  mainSoul: SoulSkill;
  subSoul: SoulSkill;
}

export interface SoulSkill {
  type: string;
  code: string;
  name: string;
  pic: string;
  image: string;
  star: number;
  bond: string;
  activeSkill: any;
  passiveSkill: any;
  tempSkill: any;
  staminaSkill: any;
  cooldownSkill: any;
  relatedDamageSkill: any;
  empower?: any;
}



export interface Cal2ContextType {
  [code: string]: EquipDetail | SkillDetail | any;
}

// 新增 context value 类型
export interface Cal2ContextValue {
  data: Cal2ContextType;
  jobCode: string;
  talentCode: string;
  setData: React.Dispatch<React.SetStateAction<Cal2ContextType>>;
  setJobCode: React.Dispatch<React.SetStateAction<string>>;
  setTalentCode: React.Dispatch<React.SetStateAction<string>>;
  handleDropToDetail: (e: React.DragEvent, targetCode?: string) => void;
}

// 默认装备 code
const defaultEquipCodes = [
  'tk',
  'qw',
  'zw',
  'fj',
  'zx',
  'sp',
  'hd',
  'hw',
  'sw',
  'yg',
  'hy',
];

// 默认技能 code（6个轻武器技能+6个重武器技能）
const defaultSkillCodes = [
    'qq',
    'zq',
    'qp',
    'zp',
    'q1',
    'q2',
    'q3',
    'q4',
    'z1',
    'z2',
    'z3',
    'z4'
];

// 默认 EquipDetail
function getDefaultEquipDetail(code: string): EquipDetail {
  return {
    type: 'equip',
    name: '',
    zb: { code, name: '', quality: '', image: '' },
    fws: [],
    fwzy: {},
    basects: [],
    rarects: [],
    epiccts: [],
    legendcts: [],
    ancientcts: [],
    tz: '',
  };
}
// 默认 SkillDetail
function getDefaultSkillDetail(code: string): SkillDetail {
  return {
    type: 'skill',
    name: '',
    skill: { code, name: '', level: 1, growth: 0, multiplier: 1, image: '' },
    mainSoul: {
      type: 'mainSoul',
      code: '', name: '', image: '', star: 1, bond: '', pic: '',
      activeSkill: null, passiveSkill: null, tempSkill: null, staminaSkill: null, cooldownSkill: null, relatedDamageSkill: null, empower: null
    },
    subSoul: {
      type: 'subSoul',
      code: '', name: '', image: '', star: 1, bond: '', pic: '',
      activeSkill: null, passiveSkill: null, tempSkill: null, staminaSkill: null, cooldownSkill: null, relatedDamageSkill: null, empower: null
    },
  };
}

function getDefaultCal2Data(): Cal2ContextType {
  const equips: Cal2ContextType = Object.fromEntries(
    defaultEquipCodes.map(code => [code, getDefaultEquipDetail(code)])
  );
  const skills: Cal2ContextType = Object.fromEntries(
    defaultSkillCodes.map(code => [code, getDefaultSkillDetail(code)])
  );
  return { ...equips, ...skills };
}

const Cal2Context = createContext<Cal2ContextValue | null>(null);

export const useCal2 = () => {
  const ctx = useContext(Cal2Context);
  if (!ctx) throw new Error('Cal2Context not found');
  return ctx;
};

export const QUALITY_LIST = [
  { key: 'all', label: '全部' },
  { key: 'base', label: '基础' },
  { key: 'rare', label: '稀有' },
  { key: 'epic', label: '史诗' },
  { key: 'legend', label: '传说' },
  { key: 'mythic', label: '原初' },
  { key: 'tz', label: '套装' },
  { key: 'ancient', label: '远古' },
  { key: 'myth', label: '神话' },
  { key: 'immortal', label: '不朽' }
];

// 精简后的Tab
export const POOL_TABS = [
  { key: 'zb', label: '装备', icon: '🛡️' },
  { key: 'fw', label: '符文', icon: '🔮' },
  { key: 'ct', label: '词条', icon: '📜' },
  { key: 'jn', label: '技能', icon: '⚡' },
  { key: 'hh', label: '魂核', icon: '💠' },
  { key: 'fn', label: '赋能', icon: '✨' },
  { key: 'tz', label: '套装', icon: '💎' },
  { key: 'fwzy', label: '符文之语', icon: '🔮' }
];


export const TYPE_COLORS: Record<string, string> = {
  '稀有': 'bg-blue-500',
  '史诗': 'bg-purple-500',
  '传说': 'bg-orange-500',
  '远古': 'bg-cyan-500',
  '基础': 'bg-gray-500',
};

export const DOT_COLORS: Record<string, string> = {
  '基础': 'bg-gray-400',
  '稀有': 'bg-blue-400',
  '史诗': 'bg-purple-400',
  '传说': 'bg-orange-400',
  '远古': 'bg-cyan-400',
};

// 16宫格装备区槽位定义
export const equipGridSlots = [
  [ {type: 'tk'}, {type: 'qw'}, {type: 'disabled'}, {type: 'zw'} ],
  [ {type: 'fj'}, {type: 'disabled'}, {type: 'hd'}, {type: 'disabled'} ],
  [ {type: 'zx'}, {type: 'hw'}, {type: 'hy'}, {type: 'sw'} ],
  [ {type: 'sp'}, {type: 'disabled'}, {type: 'yg'}, {type: 'disabled'} ],
];

export const typeLabels: Record<string, string> = {
  tk: '头盔',
  qw: '轻武器',
  zw: '重武器',
  fj: '防具',
  hd: '混沌',
  hw: '活物',
  hy: '黄印',
  sw: '圣物',
  yg: '遗骨',
  zx: '战靴',
  sp: '饰品',
  qq: '轻切',
  zq: '重切',
  qp: '轻破',
  zp: '重破',
  q1: '轻技1',
  q2: '轻技2',
  q3: '轻技3',
  q4: '轻技4',
  z1: '重技1',
  z2: '重技2',
  z3: '重技3',
  z4: '重技4',
  disabled: '',
};

// 16宫格技能区槽位定义
export const skillGridSlots = [
  [ {type: 'qq'}, {type: 'q1'}, {type: 'z1'}, {type: 'zq'} ],
  [ {type: 'disabled'}, {type: 'q2'}, {type: 'z2'}, {type: 'disabled'} ],
  [ {type: 'disabled'}, {type: 'q3'}, {type: 'z3'}, {type: 'disabled'} ],
  [ {type: 'qp'}, {type: 'q4'}, {type: 'z4'}, {type: 'zp'} ],
];


export const Cal2Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const raw = localStorage.getItem('cal2_data');
  let initialData: Cal2ContextType = getDefaultCal2Data();
  let initialJobCode = '';
  let initialTalentCode = '';
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.data) initialData = parsed.data;
        if (typeof parsed.jobCode === 'string') initialJobCode = parsed.jobCode;
        if (typeof parsed.talentCode === 'string') initialTalentCode = parsed.talentCode;
      }
    } catch {}
  }
  const [data, setData] = useState<Cal2ContextType>(initialData);
  const [jobCode, setJobCode] = useState<string>(initialJobCode);
  const [talentCode, setTalentCode] = useState<string>(initialTalentCode);

  // 拖动添加
  function handleDropToDetail(e: React.DragEvent, targetCode?: string) {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    console.log('raw', raw);
    if (!raw) return;
    const { code, type, data: dragData } = JSON.parse(raw);

    setData(prev => {
      let newData = { ...prev };
      console.log('newData', newData);
      if (type === 'ct') {
        // 词条类型，需要添加到指定装备或技能的对应品质词条列表中
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'equip') {
            // 装备词条
            const equipTarget = target as EquipDetail;
            const quality = dragData.quality;
            let ctArray: CT[] = [];
            
            switch (quality) {
              case 'base':
                ctArray = [...equipTarget.basects];
                break;
              case 'rare':
                ctArray = [...equipTarget.rarects];
                break;
              case 'epic':
                ctArray = [...equipTarget.epiccts];
                break;
              case 'legend':
                ctArray = [...equipTarget.legendcts];
                break;
              case 'ancient':
                ctArray = [...equipTarget.ancientcts];
                break;
              default:
                ctArray = [...equipTarget.basects];
            }
            
            // 避免重复添加
            if (!ctArray.find(ct => ct.code === code && ct.quality === quality)) {
              const newCT: CT = {
                code: dragData.code,
                name: dragData.desc,
                desc: dragData.condition || '',
                value: dragData.value,
                quality: dragData.quality,
                isEdit: dragData.isEdit,
                min: dragData.min,
                max: dragData.max,
                condition: dragData.condition || '',
                unit: dragData.unit || ''
              };
              
              switch (quality) {
                case 'base':
                  newData[targetCode] = { ...equipTarget, basects: [...ctArray, newCT] };
                  break;
                case 'rare':
                  newData[targetCode] = { ...equipTarget, rarects: [...ctArray, newCT] };
                  break;
                case 'epic':
                  newData[targetCode] = { ...equipTarget, epiccts: [...ctArray, newCT] };
                  break;
                case 'legend':
                  newData[targetCode] = { ...equipTarget, legendcts: [...ctArray, newCT] };
                  break;
                case 'ancient':
                  newData[targetCode] = { ...equipTarget, ancientcts: [...ctArray, newCT] };
                  break;
              }
            }
          }
        }
      } else if (type === 'zb') {
        // 装备类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'equip') {
            newData[targetCode] = { ...target, name: dragData.desc, zb: dragData };
          }
        }
      } else if (type === 'fw') {
        // 符文类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'equip') {
            newData[targetCode] = { ...target, fws: [...target.fws, dragData] };
          }
        }
      }else if (type === 'fwzy') {
        // 符文类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'equip') {
            newData[targetCode] = { ...target, fwzy: dragData };
            target['fws'] = dragData.fws;
            target['fwzycts'] = dragData.fwzycts;
          }
        }
      }else if (type === 'skill') {
        // 技能类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'skill') {
            newData[targetCode] = { ...target, skill: dragData };
          }
        }
      }
      
      return newData;
    });
  }

  useEffect(() => {
    localStorage.setItem('cal2_data', JSON.stringify({
      data,
      jobCode,
      talentCode
    }));
  }, [data, jobCode, talentCode]);


  return (
    <Cal2Context.Provider value={{ 
      data, 
      setData, 
      jobCode, 
      setJobCode, 
      talentCode, 
      setTalentCode,
      handleDropToDetail
    }}>
      {children}
    </Cal2Context.Provider>
  );
}; 