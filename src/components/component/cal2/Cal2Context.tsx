import React, { createContext, useContext, useState, useEffect } from 'react';

// 类型定义
export interface CT {
  id?: string; // 词条唯一标识
  code: string;
  name: string;
  type?: string;
  condition: string;
  desc: string;
  value: number;
  quality: string;
  isEdit: boolean;
  min?: number;
  max?: number;
  unit?: string;
  needMin?: number;
  needMax?: number;
  relatedLvN?: Record<string, number>;
  // 新增：来源类型和来源信息
  sourceType?: string; // 'base', 'rune', 'runeWord', 'set', 'bond', 'empower', 'soulCore'
  sourceCode?: string; // 来源的具体代码
  sourceName?: string; // 来源的名称
  isActive?: boolean; // 是否生效
  calculatedValue?: number; // 计算后的实际值
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
  // 新增：符文词条
  cts?: CT[];
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
  tz: any;
  fwzycts?: any[];
  tzcts?: any[];
  qhcts?: any[];
}

export interface SkillDetail {
  type: string;
  name: string;
  jn: any;
  zk: HH;
  fk: HH;
  fn: any
}

export interface JobDetail {
  type: string;
  name: string;
  code: any;
  jccts: CT[];
  xpcts: CT[];
  tfcts: CT[];
  cycts: CT[];
  szcts: CT[];
  chcts: CT[];
}

export interface HH {
  type: string;
  code: string;
  name: string;
  pic: string;
  star: number;
  bond: string;
  level: number;
  multi: number;
  growth: number;
  min: number;
  max: number;
  value: number;
  isEdit: boolean;
  required: number;
  isGroup: number;
  maxLegendCtNum: number;
  hj1: any;
  hj2: any;
  hj3: any;
  hj4: any;
  hj5: any;
  hj6: any;
  jb?: CT;
  jbcts:CT[],
  fn?: CT;
  zlcts?: any[];
  empower?: any;
  basects?: any[];
}



export interface Cal2ContextType {
  [code: string]: EquipDetail | SkillDetail | any;
}

export interface sxkey {
  id: string;
  key: string;
  condition: string;
  unit: string;
}
// 新增：有效词条汇总接口
export interface ValidEntriesSummary {
  // 装备词条汇总
  ctEntries: CT[],
  // 按属性类型汇总
  attrSummary: {
    [key: string]: {
      total: number;        // 总数值
      sources: Array<{      // 来源详情
        code: string;
        name: string;
        condition?: string;
        desc?: string;
        value: number;
        unit: string;
        sourceType: string;
        sourceCode: string;
        sourceName?: string;
      }>;
    };
  };
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
  // 新增：实时更新词条数据的函数
  updateCalculatedEntries: ()=>void;
  // 新增：有效词条汇总数据
  validEntriesSummary: ValidEntriesSummary;
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

// 默认 Job code
const defaultJobCodes = [
  'zh',
  'yw',
  'wy',
  'sz',
  'mw',
  'zj'
];

// 默认 JobDetail
function getDefaultJobDetail(code: string): JobDetail {
  return {
    type: 'job',
    name: '',
    code: code,
    jccts: [],
    xpcts: [],
    tfcts: [],
    cycts: [],
    szcts: [],
    chcts: []
  };
}
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
    type: 'jn',
    name: '',
    jn: { code, name: '', min:1, max:15, value: 1, growth: 0, multiplier: 1, pic: '' },
    zk: {
      type: 'zk',
      basects:[],
      code: '', name: '', value: 1, bond: '', pic: '',
      hj1: null, hj2: null, hj3: null, hj4: null, hj5: null, hj6: null, empower: null,
      level: 1,
      multi: 1,
      growth: 0,
      min: 1,
      max: 15,
      required: 0,
      isGroup: 1,
      maxLegendCtNum: 0,
      star: 1,
      isEdit: true,
      jbcts: []
    },
    fk: {
      type: 'fk',
      basects:[],
      code: '', name: '', value: 1, bond: '', pic: '',
      hj1: null, hj2: null, hj3: null, hj4: null, hj5: null, hj6: null, empower: null,
      level: 1,
      multi: 1,
      growth: 0,
      min: 1,
      max: 15,
      required: 0,
      isGroup: 1,
      maxLegendCtNum: 0,
      star: 1,
      isEdit: true,
      jbcts: []
    },
    fn: null
  };
}

function getDefaultCal2Data(): Cal2ContextType {
  const equips: Cal2ContextType = Object.fromEntries(
    defaultEquipCodes.map(code => [code, getDefaultEquipDetail(code)])
  );
  const skills: Cal2ContextType = Object.fromEntries(
    defaultSkillCodes.map(code => [code, getDefaultSkillDetail(code)])
  );
  const jobs: Cal2ContextType =  Object.fromEntries(
    defaultJobCodes.map(code => [code, getDefaultJobDetail(code)])
  );
  return { ...equips, ...skills, ...jobs };
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
  { key: 'fwzy', label: '符文之语', icon: '🔮' },
  { key: 'tz', label: '套装', icon: '💎' },
  { key: 'qh', label: '强化', icon: '✨' },
  { key: 'ct', label: '词条', icon: '📜' },
  { key: 'jn', label: '技能', icon: '⚡' },
  { key: 'zk', label: '主卡', icon: '💠' },
  { key: 'fk', label: '副卡', icon: '💠' },
  { key: 'fn', label: '赋能', icon: '✨' },
  { key: 'jb', label: '羁绊', icon: '🔗' },
  { key: 'js', label: '角色', icon: '👤' },
  { key: 'xp', label: '星盘', icon: '✨' },
  { key: 'tf', label: '天赋', icon: '⚡' },
  { key: 'cy', label: '界限超越', icon: '📜' },
  { key: 'sz', label: '时装', icon: '💎' },
  { key: 'ch', label: '称号', icon: '🔮' }

];


export const TYPE_COLORS: Record<string, string> = {
  'base': 'gray',
  'rare': 'blue',
  'epic': 'purple',
  'legend': 'orange',
  'ancient': 'cyan',
  'mythic': 'yellow',
  'myth': 'red',
  'immortal': 'green',
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


export const showSummary = [
  { key: '[攻击]', label: '基础攻击力', color: 'red', sxSet:['gj','gjl','jcgj','jcgjl','q3'] },
  { key: '[额外攻击力]', label: '额外攻击力', color: 'purple', sxSet:['xpgj','cygj','szgj'] },
  { key: '[百分比攻击力]', label: '百分比攻击力', color: 'red', sxSet:['gj%','gjl%','自身生命值高于80%时gjl%'] },
  { key: '[面板攻击力]', label: '面板攻击力', color: 'red', sxSet:[''] },
  { key: '[会心]', label: '会心', color: 'purple', sxSet:['hx','hj1'] },
  { key: '[暴击率]', label: '暴击率', color: 'purple', sxSet:['bjl%','ty3%','ty3'] },
  { key: '[基础暴击伤害]', label: '基础暴击伤害', color: 'yellow', sxSet:['bjsh%','my3%','my3'] },
  { key: '[额外暴击伤害]', label: '额外暴击伤害', color: 'yellow', sxSet:['erbjsh%','进入战斗后erbjsh%'] },
  { key: '[基础最终伤害]', label: '基础最终伤害', color: 'teal', sxSet:['zzsh%','进入战斗后zzsh%','对首领目标zzsh%','对异常目标zzsh%'] },
  { key: '[额外最终伤害]', label: '额外最终伤害', color: 'teal', sxSet:['erzzsh%','进入战斗后erzzsh%'] },
  { key: '[全属性伤害]', label: '全属性伤害', color: 'purple', sxSet:['qsxsh%','qs%'] },
  { key: '[额外全属性伤害]', label: '额外全属性伤害', color: 'purple', sxSet:['erqsxsh%'] },
  { key: '[火伤]', label: '火伤', color: 'red', sxSet:['hs%'] },
  { key: '[雷伤]', label: '雷伤', color: 'yellow', sxSet:['ls%'] },
  { key: '[毒伤]', label: '毒伤', color: 'green', sxSet:['ds%'] },
  { key: '[冰伤]', label: '冰伤', color: 'cyan', sxSet:['bs%'] },
  { key: '[穿透]', label: '穿透', color: 'orange', sxSet:['ct%'] },
  { key: '[减抗]', label: '减抗', color: 'green', sxSet:['jk%'] },
  { key: '[技能伤害]', label: '技能伤害', color: 'red', sxSet:['jnsh%','hp3%'] },
  { key: '[普攻伤害]', label: '普攻伤害', color: 'purple', sxSet:['pgsh%'] },
  { key: '[破招伤害]', label: '破招伤害', color: 'purple', sxSet:['pzsh%','lz1%'] },
  { key: '[对首领目标伤害提升]', label: '对首领目标伤害提升', color: 'cyan', sxSet:['对首领目标shts%'] },
  { key: '[对冰属性首领目标伤害提升]', label: '对冰属性首领目标伤害提升', color: 'cyan', sxSet:['对冰属性首领目标shts%'] },
  { key: '[对火属性首领目标伤害提升]', label: '对火属性首领目标伤害提升', color: 'cyan', sxSet:['对火属性首领目标shts%'] },
  { key: '[对雷属性首领目标伤害提升]', label: '对雷属性首领目标伤害提升', color: 'cyan', sxSet:['对雷属性首领目标shts%'] },
  { key: '[对毒属性首领目标伤害提升]', label: '对毒属性首领目标伤害提升', color: 'cyan', sxSet:['对毒属性首领目标shts%'] },
  { key: '[对异常目标伤害提升]', label: '对异常目标伤害提升', color: 'gray', sxSet:['对异常目标shts%'] },

  { key: '[首刀百分比攻击力]', label: '首刀百分比攻击力', color: 'red', sxSet:['gj%','gjl%','自身生命值高于80%时gjl%', '进入战斗后gj%', '进入战斗后gjl%'] },
  { key: '[首刀暴击率]', label: '首刀暴击率', color: 'red', sxSet:['bjl%','进入战斗后bjl%','ty3%','ty3'] },
  { key: '[首刀属性伤害]', label: '首刀属性伤害', color: 'red', sxSet:[''] },
  { key: '[首刀最终伤害]', label: '首刀最终伤害', color: 'red', sxSet:['zzsh%','进入战斗后zzsh%','对首领目标zzsh%','对异常目标zzsh%','目标生命值高于80%时zzsh%'] },
  { key: '[首刀暴击伤害]', label: '首刀暴击伤害', color: 'red', sxSet:['bjsh%','my3%','my3','进入战斗后bjsh%','对首领目标bjsh%','对异常目标bjsh%'] },
  { key: '[首刀对首领增伤]', label: '首刀对首领增伤', color: 'red', sxSet:['对首领目标shts%'] },
  { key: '[首刀伤害提升]', label: '首刀伤害提升', color: 'red', sxSet:['shts%'] },
  { key: '[首刀技能伤害]', label: '首刀技能伤害', color: 'red', sxSet:['jnsh%','hp3%'] },
  { key: '[首刀穿透]', label: '首刀穿透', color: 'red', sxSet:['ct%'] },
  { key: '[首刀减抗]', label: '首刀减抗', color: 'red', sxSet:['jk%'] },
  { key: '[首刀伤害预估]', label: '首刀伤害预估', color: 'red', sxSet:[''] }
];

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
  const [validEntriesSummary, setValidEntriesSummary] = useState<ValidEntriesSummary>({
    ctEntries: [],
    attrSummary: {}
  });
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
            if (!ctArray.find(ct => ct.code === code && ct.quality === quality && ct.unit === dragData.unit && ct.condition === dragData.condition)||dragData.relatedZb?.includes('hy')) {
              const id = new Date().getTime().toString();
              const newCT: CT = {
                id: id,//唯一标识
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
            // 避免重复添加
            if (!target.fws?.find((fw: any) => fw.code === dragData.code)) {
              newData[targetCode] = { ...target, fws: [...target.fws, dragData] };
            }
          }
        }
      }else if (type === 'qh') {
        // 强化类型
        if (targetCode && newData[targetCode]) {
          // 避免重复添加
          const target = newData[targetCode];
          if (!newData[targetCode].qhcts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, qhcts: [...(target.qhcts||[]), dragData] };
          }
        }
      }
      else if (type === 'fwzy') {
        // 符文类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          if (target.type === 'equip') {
            newData[targetCode] = { ...target, fwzy: dragData };
            target['fws'] = dragData.fws;
            target['fwzycts'] = dragData.fwzycts;
          }
        }
      }else if (type === 'jn') {
        // 技能类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          newData[targetCode] = { ...target, jn: dragData, name: dragData.name };
        }
      }else if (type === 'zk') {
        // 主卡类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          console.log('target', target);
          console.log('dragData', dragData);
          newData[targetCode] = { ...target, zk: dragData};
        }
      }else if (type === 'fk') {
        // 副卡类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          newData[targetCode] = { ...target, fk: dragData };
        }
      }else if (type === 'fn') {
        // 赋能类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          newData[targetCode] = { ...target, fn: dragData };
        }
      }else if (type === 'sz') {
        console.log('targetCode:', targetCode);
        // 时装类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.szcts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, name: targetCode, szcts: [...target.szcts, dragData] };
          }
        }
      }else if (type === 'ch') {
        // 称号类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.chcts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, name: targetCode, chcts: [...target.chcts, dragData] };
          }
        }
      }else if (type === 'xp') {
        // 星盘类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.xpcts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, name: targetCode, xpcts: [...target.xpcts, dragData] };
          }
        }
      }else if (type === 'tf') {
        // 天赋类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.tfcts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, name: targetCode, tfcts: [...target.tfcts, dragData] };
          }

        }
      }else if (type === 'cy') {
        // 界限超越类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.cycts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, name: targetCode, cycts: [...target.cycts, dragData] };
          }
        }
      }else if (type === 'js') {
        // 角色类型
        if (targetCode && newData[targetCode]) {
          const target = newData[targetCode];
          // 避免重复添加
          if (!target.jccts?.find((ct: any) => ct.code === dragData.code && ct.unit === dragData.unit)) {
            newData[targetCode] = { ...target, jccts: [...target.jccts, dragData] };
          }
        }
      }
      return newData;
    });
  }

  // 新增：更新装备词条的函数
  function updateEquipEntries(data: Cal2ContextType, equip: EquipDetail) {
    // 更新符文词条
    if (equip.fws) {
      equip.fws.forEach((ct: CT) => {
        ct.sourceType = 'rune';
        ct.sourceCode = ct.code;
        ct.sourceName = ct.name;
        ct.isActive = true;
        ct.calculatedValue = ct.relatedLvN?.[ct.value] || ct.value;
      });
    }

    // 更新符文之语词条
    if (equip.fwzy && equip.fwzycts) {
      equip.fwzycts.forEach((ct: any) => {
        ct.sourceType = 'runeWord';
        ct.sourceCode = equip.fwzy.code;
        ct.sourceName = equip.fwzy.name;
        ct.isActive = true;
        ct.calculatedValue = ct.relatedLvN?.[ct.value] || ct.value;
      });
    }

    // 更新器魂词条
    if (equip.qhcts) {
      equip.qhcts.forEach((ct: any) => {
        ct.sourceType = 'qh';
        ct.sourceCode = ct.code;
        ct.sourceName = "强化";
        ct.isActive = true;
        ct.calculatedValue = ct.value;
      });
    }

    // 更新套装词条
    if (equip.zb?.tz && equip.zb.tzcts) {
      // 计算套装件数
      const setCount = Object.values(data).reduce((acc: number, item: any) => {
        if (item.type === 'equip' && item.zb?.tz?.code === equip.zb.tz.code) {
          acc += 1;
        }
        // 检查是否有套装加成词条
        if (item.type === 'equip' && item.ancientcts?.find((ct: any) => ct.code === 'tzjsjy')) {
          acc += 1;
        }
        return acc;
      }, 0);

      equip.zb.tzcts.forEach((ct: any) => {
        ct.sourceType = 'set';
        ct.sourceCode = equip.zb.tz.code;
        ct.sourceName = equip.zb.tz.name;
        ct.isActive = setCount >= ct.need;
        ct.calculatedValue = ct.isActive ? ct.value : 0;
      });
    }

    // 更新基础属性词条
    equip.basects?.forEach((ct: CT) => {
      ct.sourceType = 'base';
      ct.sourceCode = 'base';
      ct.sourceName = '基础属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
    equip.rarects?.forEach((ct: CT) => {
      ct.sourceType = 'quality';
      ct.sourceCode = 'rarects';
      ct.sourceName = '稀有属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
    equip.epiccts?.forEach((ct: CT) => {
      ct.sourceType = 'quality';
      ct.sourceCode = 'epiccts';
      ct.sourceName = '史诗属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
    equip.legendcts?.forEach((ct: CT) => {
      ct.sourceType = 'quality';
      ct.sourceCode = 'legendcts';
      ct.sourceName = '传说属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
    equip.ancientcts?.forEach((ct: CT) => {
      ct.sourceType = 'quality';
      ct.sourceCode = 'ancientcts';
      ct.sourceName = '远古属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
  }

  // 新增：更新技能词条的函数
  function updateSkillEntries(data: Cal2ContextType, skill: SkillDetail) {
    // 更新主卡魂核词条
    if (skill.zk) {
      updateSoulCoreEntries(skill.zk);
      
      // 更新羁绊词条
      if (skill.zk.jb && skill.zk.jbcts) {
        skill.zk.jbcts.forEach((ct: CT) => {
          ct.sourceType = 'bond';
          ct.sourceCode = skill.zk.jb!.code;
          ct.sourceName = skill.zk.jb!.name;
          ct.isActive = (ct.needMin || 0) <= skill.zk.value && skill.zk.value < (ct.needMax || 999) && !skill.fk?.name;
          ct.calculatedValue = ct.isActive ? ct.value : 0;
        });
      }

      // 更新注灵词条
      if (skill.zk.zlcts) {
        skill.zk.zlcts.forEach((ct: any) => {
          ct.sourceType = 'soulCore';
          ct.sourceCode = 'zl';
          ct.sourceName = '注灵属性';
          ct.isActive = true;
          ct.calculatedValue = ct.value * (ct.multiplier || 1);
        });
      }
    }

    // 更新副卡魂核词条
    if (skill.fk) {
      // updateSoulCoreEntries(skill.fk, 'sub');
      
      // 更新羁绊词条
      if (skill.fk.jb && skill.fk.jbcts) {
        skill.fk.jbcts.forEach((ct: CT) => {
          ct.sourceType = 'bond';
          ct.sourceCode = skill.fk.jb!.code;
          ct.sourceName = skill.fk.jb!.name;
          ct.isActive = (ct.needMin || 0) <= skill.fk.value && skill.fk.value < (ct.needMax || 999);
          ct.calculatedValue = ct.isActive ? ct.value : 0;
        });
      }
    }

    // 更新赋能词条
    if (skill.fn) {
      skill.fn.sourceType = 'empower';
      skill.fn.sourceCode = skill.fn.code;
      skill.fn.sourceName = skill.fn.name;
      skill.fn.isActive = true;
      skill.fn.calculatedValue = skill.fn.value;
    }
  }

  // 新增：更新魂核词条
  function updateSoulCoreEntries(soulCore: any) {
    // 更新基础属性
    if (soulCore.basects) {
      soulCore.basects.forEach((ct: CT) => {
        ct.sourceType = 'soulCore';
        ct.sourceCode = soulCore.code;
        ct.sourceName = soulCore.name;
        ct.isActive = true;
        ct.calculatedValue = ct.value;
      });
    }

    // 更新魂技词条
    ['hj1', 'hj2', 'hj3', 'hj4', 'hj5', 'hj6'].forEach(hjKey => {
      if (soulCore[hjKey]) {
        const hj = soulCore[hjKey];
        hj.sourceType = 'soulCore';
        hj.sourceCode = hjKey;
        hj.sourceName = hj.name;
        hj.isActive = true;
        hj.calculatedValue = hj.relatedLvN?.[hj.value] || hj.value;
      }
    });
  }

  // 新增：生成有效词条汇总
  function generateValidEntriesSummary(data: Cal2ContextType): ValidEntriesSummary {
    const summary: ValidEntriesSummary = {
      ctEntries: [],
      attrSummary: {}
    };

    // 遍历所有装备和技能，收集有效词条
    Object.values(data).forEach(item => {
      console.log("item:", item);
      [item.fws||[], item.fwzycts||[], item.basects||[], item.rarects||[], item.epiccts||[], item.legendcts||[], item.ancientcts||[], item.zb?.tzcts||[], item.qhcts||[],
        item.zk?.basects||[], item.fk?(item.fk?.jbcts||[]):(item.zk?.jbcts||[]), item.zk?.zlcts||[], [item.fn], [item.zk?.hj2],
        jobCode===item.code?item.jccts:[], jobCode===item.code?item.tfcts:[], jobCode===item.code?item.xpcts:[], jobCode===item.code?item.cycts:[], jobCode===item.code?item.szcts:[], jobCode===item.code?item.chcts:[]
      ].forEach((cts: CT[]) => {
        
        cts.forEach((ct: CT) => {
          if(ct?.type==='cy'){
            console.log("cyct:", ct);
          }
          if (ct?.isActive) {
            summary.ctEntries.push(ct);
          }
        });
      });
    });
    addToAttrSummary(summary);
    return summary;
  }

  // 新增：添加到属性汇总
  function addToAttrSummary(summary: any) {
    // 这里可以根据词条名称或类型来分类属性
    // 暂时使用词条名称作为属性键
    // summary.ctEntries.forEach((ct: CT) => {
    //   const attrKey =  (ct?.condition || '') +  (ct?.name?ct.name:ct.desc || '')  + (ct?.unit || '');
    //   if (!summary.attrSummary[attrKey]) {
    //     summary.attrSummary[attrKey] = {
    //       total: 0,
    //       sources: []
    //     };
    //   }
    //   summary.attrSummary[attrKey].total += Number(ct?.calculatedValue || ct?.value || 0);
    //   summary.attrSummary[attrKey].sources.push({
    //     code: ct?.code,
    //     name: ct?.name,
    //     value: ct?.calculatedValue || ct?.value || 0,
    //     unit: ct?.unit || '',
    //     sourceName: ct?.sourceName || '',
    //     sourceType: ct?.sourceType || 'unknown',
    //     sourceCode: ct?.sourceCode || 'unknown'
    //   });
    // });
    console.log("summary.ctEntries:", summary.ctEntries);
    console.log("showSummary:", showSummary);
    summary.attrSummary = {};

    showSummary.forEach((item: any) => {
        if (!summary.attrSummary[item.key]) {
          summary.attrSummary[item.key] = {
            total: 0,
            sources: []
          };
        }
    });

    summary.ctEntries.forEach((ct: CT) => {
      showSummary.forEach((item: any) => {
        if (item.sxSet?.includes(ct.condition+ct.code+ct.unit)) {
          if (!summary.attrSummary[item.key]) {
            summary.attrSummary[item.key] = {
              total: 0,
              sources: []
            };
          }
          summary.attrSummary[item.key].total += Number(ct.calculatedValue || ct.value || 0);
          if(Number(ct.calculatedValue || ct.value || 0)!==0){
            summary.attrSummary[item.key].sources.push({
              code: ct?.code,
              name: ct?.name,
              value: ct?.calculatedValue || ct?.value || 0,
              unit: ct?.unit || '',
              sourceName: ct?.sourceName || '',
              sourceType: ct?.sourceType || 'unknown',
              sourceCode: ct?.sourceCode || 'unknown'
            });
          }
        }
      })
      
    });
    
    //先处理特殊条件词条
    summary.ctEntries.filter((ct: CT) => ct.condition === '每装备一个原初及以上品质魂核' && ct.code==='gjl' && ct.isActive).forEach((ct: CT) => {
      console.log("计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='myth' || item[1].zk?.quality==='mythic')).length);
      summary.attrSummary['[百分比攻击力]'].total += (ct.calculatedValue || ct.value || 0) * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='myth' || item[1].zk?.quality==='mythic')).length;
      summary.attrSummary['[百分比攻击力]'].sources.push({
        code: '每装备一个原初及以上品质魂核',
        name: '每装备一个原初及以上品质魂核',
        sourceName: '每装备一个原初及以上品质魂核',
        sourceType: 'soulCore',
        sourceCode: '每装备一个原初及以上品质魂核'
      });
    });
    //先处理特殊条件词条
    summary.ctEntries.filter((ct: CT) => ct.condition === '每装备一个原初魂核' && ct.code==='gjl' && ct.isActive).forEach((ct: CT) => {
      console.log("计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='mythic')).length);
      summary.attrSummary['[百分比攻击力]'].total += (ct.calculatedValue || ct.value || 0) * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='mythic')).length;
      summary.attrSummary['[百分比攻击力]'].sources.push({
        code: '深空星海',
        name: '深空星海',
        sourceName: '深空星海',
        sourceType: 'soulCore',
        sourceCode: '深空星海'
      });
    });
        //先处理特殊条件词条
    summary.ctEntries.filter((ct: CT) => ct.condition === '每装备一个原初至臻魂核' && ct.code==='qsxsh' && ct.isActive).forEach((ct: CT) => {
      console.log("计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='mythic')).length);
      summary.attrSummary['[全属性伤害]'].total += (ct.calculatedValue || ct.value || 0) * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='mythic')).length;
      summary.attrSummary['[全属性伤害]'].sources.push({
        code: '深空星海',
        name: '深空星海',
        sourceName: '深空星海',
        sourceType: 'soulCore',
        sourceCode: '深空星海'
      });
    });
    //先处理特殊条件词条
    summary.ctEntries.filter((ct: CT) => ct.condition === '每装备一个神话至臻魂核' && ct.code==='qsxsh' && ct.isActive).forEach((ct: CT) => {
      console.log("计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='myth')).length);
      summary.attrSummary['[全属性伤害]'].total += (ct.calculatedValue || ct.value || 0) * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.quality==='myth')).length;
      summary.attrSummary['[全属性伤害]'].sources.push({
        code: '深空星海',
        name: '深空星海',
        sourceName: '深空星海',
        sourceType: 'soulCore',
        sourceCode: '深空星海'
      });
    });
    //再处理星盘额外攻击力
    summary.ctEntries.filter((ct: CT) =>ct.code==='jggj').forEach((ct: CT) => {

      console.log("进攻魂核计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='jg')).length);
      console.log("进攻魂核攻击力合计:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='jg')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));
      console.log("进攻魂核攻击力提供额外攻击力:", (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='jg')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));

      summary.attrSummary['[额外攻击力]'].total += (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='jg')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0);
      summary.attrSummary['[额外攻击力]'].sources.push({
        code: '星盘进攻攻击',
        name: '星盘进攻攻击',
        sourceName: '星盘进攻攻击',
        sourceType: 'soulCore',
        sourceCode: '星盘进攻攻击'
      });
    });
    summary.ctEntries.filter((ct: CT) =>ct.code==='shgj').forEach((ct: CT) => {

      console.log("守护魂核计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sh')).length);
      console.log("守护魂核攻击力合计:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sh')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));
      console.log("守护魂核攻击力提供额外攻击力:", (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sh')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));

      summary.attrSummary['[额外攻击力]'].total += (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sh')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0);
      summary.attrSummary['[额外攻击力]'].sources.push({
        code: '星盘守护攻击',
        name: '星盘守护攻击',
        sourceName: '星盘守护攻击',
        sourceType: 'soulCore',
        sourceCode: '星盘守护攻击'
      });
    });
    summary.ctEntries.filter((ct: CT) =>ct.code==='lngj').forEach((ct: CT) => {

      console.log("灵能魂核计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='ln')).length);
      console.log("灵能魂核攻击力合计:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='ln')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));
      console.log("灵能魂核攻击力提供额外攻击力:", (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='ln')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));

      summary.attrSummary['[额外攻击力]'].total += (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='ln')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0);
      summary.attrSummary['[额外攻击力]'].sources.push({
        code: '星盘灵能攻击',
        name: '星盘灵能攻击',
        sourceName: '星盘灵能攻击',
        sourceType: 'soulCore',
        sourceCode: '星盘灵能攻击'
      });
    });
    summary.ctEntries.filter((ct: CT) =>ct.code==='scgj').forEach((ct: CT) => {

      console.log("生存魂核计数:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sc')).length);
      console.log("生存魂核攻击力合计:", (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sc')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));
      console.log("生存魂核攻击力提供额外攻击力:", (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sc')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0));

      summary.attrSummary['[额外攻击力]'].total += (ct.calculatedValue || ct.value || 0)/100 * (Object.entries(data).filter((item: any) => item[1].type === 'jn').filter((item:any)=>item[1].zk?.direction==='sc')).reduce((a: number, b: any) => a + (b[1].zk?.basects?.find((ct: any) => ct.code==='jcgj')?.calculatedValue || 0), 0);
      summary.attrSummary['[额外攻击力]'].sources.push({
        code: '星盘生存攻击',
        name: '星盘生存攻击',
        sourceName: '星盘生存攻击',
        sourceType: 'soulCore',
        sourceCode: '星盘生存攻击'
      });
    });
    // 修正属性汇总
    summary.attrSummary = {...summary.attrSummary, 
      '[攻击]':summary.attrSummary['[攻击]']||{total: 0, sources: []}, 
      '[百分比攻击力]':{total: summary.attrSummary['[百分比攻击力]']?.total||0, sources: summary.attrSummary['[百分比攻击力]']?.sources||[]}, 
      '[额外攻击力]':{total: summary.attrSummary['[额外攻击力]']?.total||0, sources: summary.attrSummary['[额外攻击力]']?.sources||[]}};
    summary.attrSummary = {...summary.attrSummary, '[面板攻击力]':{total: (summary.attrSummary['[攻击]']?.total||0)*(summary.attrSummary['[百分比攻击力]']?.total+100)/100 + (summary.attrSummary['[额外攻击力]']?.total||0), sources:[]}};

  }

  // 新增：实时更新词条数据的函数
  function updateCalculatedEntries() {
    Object.values(data).forEach(item => {
      if (item.type === 'equip') {
        updateEquipEntries(data, item as EquipDetail);
      } else if (item.type === 'jn') {
        updateSkillEntries(data, item as SkillDetail);
      } else if (item.type === 'job') {
        updateJobEntries(data, item as JobDetail);
      }
    });
    // 重新生成有效词条汇总
    setValidEntriesSummary(generateValidEntriesSummary(data));
  }

  // 新增：更新角色词条的函数
  function updateJobEntries(data: Cal2ContextType, job: JobDetail) {
    // 更新角色属性词条
    [...(job.jccts||[]), ...(job.tfcts||[]), ...(job.xpcts||[]), ...(job.cycts||[]), ...(job.szcts||[]), ...(job.chcts||[])].forEach((ct: CT) => {
      ct.sourceType = 'job';
      ct.sourceCode = 'base';
      ct.sourceName = '角色属性';
      ct.isActive = true;
      ct.calculatedValue = ct.value;
    });
  }

  useEffect(() => {
    localStorage.setItem('cal2_data', JSON.stringify({
      data,
      jobCode,
      talentCode
    }));
    updateCalculatedEntries();
  }, [data, jobCode, talentCode]);


  return (
    <Cal2Context.Provider value={{ 
      data, 
      setData, 
      jobCode, 
      setJobCode, 
      talentCode, 
      setTalentCode,
      handleDropToDetail,   
      updateCalculatedEntries,
      validEntriesSummary
    }}>
      {children}
    </Cal2Context.Provider>
  );
}; 