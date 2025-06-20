import React, {createContext, useContext, useState, ReactNode} from 'react';
import { Selection } from './UserSelectionsContext';

export type RoleType = {
    totalScore: number;
    gj: number;
    bjl: number;
    bjsh: number;
    yczs: number;
    dbzs: number;
    zzsh: number;
    dzdbzs: number;
    bs?: number;
    hs?: number;
    ls?: number;
    ds?: number;
    qsxsh?: number;
    ct?: number;
    jn?: number;
    hj?: number;
    jk?: number;
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
        bs?: number;
        hs?: number;
        ls?: number;
        ds?: number;
        qsxsh?: number;
        ct?: number;
        jn?: number;
        hj?: number;
        jk?: number;
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
    ct: 0,
    jn: 0,
    hj: 0,
    jk: 0
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

export type RoleContextType = {
    roleValues: RoleType;
    sources: SourcesType;
    lists: any;
    setLists: (lists: any) => void;
    updateRole: (userSelections: Selection) => void;
    recalculateRoleAndSources: (userSelections: Selection) => { roleValues: RoleType; sources: any };
    toggleLock: () => void;
    isLocked: boolean;
    scoreChangeRatio: number;
    calculateDamageIncrease: (category: keyof Selection, item: any, currentSelections: Selection) => number;
    calculateJnDamage: (jn: any) => number;
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

    const recalculateRoleAndSources = (userSelections: Selection) => {
        // 这里是你原有的计算逻辑
        return { roleValues: defaultRoleValues, sources: {} };
    };

    const updateRole = (userSelections: Selection) => {
        const { roleValues: newRoleValues, sources: newSources } = recalculateRoleAndSources(userSelections);
        setRoleValues(newRoleValues);
        setSources(newSources);
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