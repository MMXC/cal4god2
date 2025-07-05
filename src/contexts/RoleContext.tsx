import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { Selection } from './UserSelectionsContext';
import { fetchProfileInfo } from '@/services/api';

export type RoleType = {
    totalScore: number;
    gj: number;
    bjl: number;
    bjsh: number;
    yczs: number;
    dbzs: number;
    zzsh: number;
    dzdbzs: number;
    hx?: number;
    bm?: number;
    hm?: number;
    lm?: number;
    dm?: number;
    bs?: number;
    hs?: number;
    ls?: number;
    ds?: number;
    qsxsh?: number;
    ct?: number;
    jn?: number;
    hj?: number;
    jk?: number;
    jf?: number;
    pf?: number;
};

export type SourcesType = {
    [key: string]: {
        gj?: number;
        bjl?: number;
        bjsh?: number;
        yczs?: number;
        dbzs?: number;
        zzsh?: number;
        dzdbzs?: number;
        hx?: number;
        bs?: number;
        hs?: number;
        ls?: number;
        ds?: number;
        bm?: number;
        hm?: number;
        lm?: number;
        dm?: number;
        qsxsh?: number;
        ct?: number;
        jn?: number;
        hj?: number;
        jk?: number;
        jf?: number;
        pf?: number;
    };
};

const defaultRoleValues: RoleType = {
    totalScore: 0,
    gj: 0,
    bjl: 0,
    bjsh: 0,
    yczs: 0,
    dbzs: 0,
    zzsh: 0,
    dzdbzs: 0,
    hx: 0,
    bm: 0,
    hm: 0,
    lm: 0,
    dm: 0,
    ct: 0,
    jn: 0,
    hj: 0,
    jk: 0,
    jf: 0,
    pf: 0
};

const defaultLists = {
    zkList: [],
    zbList: [],
    jbList: [],
    fwList: [],
    fnList: [],
    ygList: [],
    fwzyList: [],
    tzList: [],
    hyList: [],
    jnList: []
};


const defaultRole = {
    nickname: "",
    role: "",
    baseAttack: 0,
    panelAttack: 0,
    soulPower: 0,
    expeditionDamage: 0,
    alienScore: 0,
    avatar: "",
    formerNicknames: [],
    display: "",
    linkedRoles: [null, null], // 关联角色
};


export type RoleContextType = {
    roleValues: RoleType;
    sources: SourcesType;
    lists: any;
    setLists: (lists: any) => void;
    updateRole: (userSelections: Selection, newRole: any) => void;
    recalculateRoleAndSources: (userSelections: Selection) => { roleValues: RoleType; sources: any };
    toggleLock: () => void;
    isLocked: boolean;
    scoreChangeRatio: number;
    calculateDamageIncrease: (category: keyof Selection, item: any, currentSelections: Selection) => number;
    calculateJnDamage: (jn: any) => number;
    role: any;
    setRole: (role: any) => void;
};

export const RoleContext = createContext<RoleContextType>({
    roleValues: defaultRoleValues,
    sources: {},
    lists: defaultLists,
    setLists: () => {},
    updateRole: () => {},
    recalculateRoleAndSources: () => ({ roleValues: defaultRoleValues, sources: {} }),
    toggleLock: () => {},
    isLocked: false,
    scoreChangeRatio: 0,
    calculateDamageIncrease: () => 0,
    calculateJnDamage: () => 0,
    role: defaultRole,
    setRole: (role: any) => {},
});

// 创建角色数值的上下文
export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole 必须在 RoleProvider 内部使用');
    }
    return context;
}

export function RoleProvider({ children }: { children: ReactNode }) {
    const [roleValues, setRoleValues] = useState<RoleType>(defaultRoleValues);
    const [sources, setSources] = useState<SourcesType>({});
    const [lists, setLists] = useState(defaultLists);
    const [isLocked, setIsLocked] = useState(false);
    const [scoreChangeRatio, setScoreChangeRatio] = useState(0);
    const [role, setRole] = useState(defaultRole);


    useEffect(() => {
        // 优先本地缓存
        const cached = localStorage.getItem("profile");
        if (cached) {
          setRole(JSON.parse(cached));
        } else {
          // 首次登录从API获取
          fetchProfileInfo().then((data) => {
            setRole(data);
            localStorage.setItem("profile", JSON.stringify(data));
          });
        }
      }, []);
    
    const recalculateRoleAndSources = (userSelections: Selection) => {
        // 这里是你原有的计算逻辑
        return { roleValues: defaultRoleValues, sources: {} };
    };

    const updateRole = (userSelections: Selection, newRole: any) => {
        const { roleValues: newRoleValues, sources: newSources } = recalculateRoleAndSources(userSelections);
        setRoleValues(newRoleValues);
        setSources(newSources);
        setRole(newRole);
        localStorage.setItem("profile", JSON.stringify(newRole));
    };

    const toggleLock = () => {
        setIsLocked(!isLocked);
    };

    const calculateDamageIncrease = (category: keyof Selection, item: any, currentSelections: Selection): number => {
        // 创建新的 selections 用于计算
        const newSelections = {...currentSelections} as Selection;
        
        // 根据不同类型的卡片,添加到对应的数组中
        if (category === 'fwSelection') {
            newSelections[category] = [...(currentSelections[category] || []), item];
        } else {
            newSelections[category] = [...(currentSelections[category] || []), item];
        }

        // 计算新的角色数值
        const newValues = recalculateRoleAndSources(newSelections);
        const currentValues = recalculateRoleAndSources(currentSelections);

        // 计算伤害提升百分比
        const increase = ((newValues.roleValues.totalScore - currentValues.roleValues.totalScore) / currentValues.roleValues.totalScore) * 100;
        
        return Number(increase.toFixed(1));
    };

    const calculateJnDamage = (jn: any) => {
        // Implementation of calculateJnDamage
        return 0; // Placeholder return, actual implementation needed
    };

    return (
        <RoleContext.Provider value={{
            roleValues,
            sources,
            lists,
            setLists,
            updateRole,
            role,
            setRole,
            recalculateRoleAndSources,
            toggleLock,
            isLocked,
            scoreChangeRatio,
            calculateDamageIncrease,
            calculateJnDamage,
        }}>
            {children}
        </RoleContext.Provider>
    );
}