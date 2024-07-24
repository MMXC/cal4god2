import React, {createContext, useContext} from 'react';

export type RoleType = {
    gj?: number;
    bs?: number;
    hs?: number;
    ds?: number;
    ls?: number;
    bm?: number;
    dm?: number;
    lm?: number;
    hm?: number;
    hx?: number;
    bjl?: number;
    bjsh?: number;
    qsxsh?: number;
    yczs?: number;
    dbzs?: number;
    zzsh?: number;
    dzdbzs?: number;
    pf?: number;
    totalScore?: number;
};

export type SourcesType = Record<string, Record<string, any>>;

export type RoleContextType = {
    roleValues: RoleType;
    sources: SourcesType;
    updateRole: (userSelections: Selection|{}) => void;
    isLocked: boolean,
    toggleLock: any,
    lists: any,
    setLists: (any: any) => void,
    scoreChangeRatio: any
};

export const RoleContext = createContext<RoleContextType>({
    roleValues: {},
    sources: {},
    updateRole: ({}) => {},
    isLocked: false,
    toggleLock: () => {},
    lists: [],
    setLists: () => {},
    scoreChangeRatio: 0
});

// 创建角色数值的上下文
export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole 必须在 RoleProvider 内部使用');
    }
    return context;
}