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

export type SourcesType = Record<string, Record<keyof RoleType, any>>;

export type RoleContextType = {
    roleValues: RoleType;
    sources: SourcesType;
    updateRole: (updater: RoleType,  type: string, operation: 'add' | 'remove') => void;
    isLocked: boolean,
    toggleLock: any,
    lists: any,
    setLists: (any:any) => void,
    effectiveTotalScoreDisplay: number,
    effectiveScoreChangeRatio: number,
};

export const RoleContext = createContext<any>(null);

// 创建角色数值的上下文
export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole 必须在 RoleProvider 内部使用');
    }
    return context;
}