import React, {createContext, useContext} from 'react';

export type SelfType = {
    zkList: any[];
    zbList: any[];
    jbList: any[];
    fwList: any[];
    fwzyList: any[];
    tzList: any[];
    fnList: any[];
    ygList: any[];
    hyList: any[];
    jnList: any[];
};

export type SelfContextType = {
    self: SelfType
};

export const SelfContext = createContext<SelfContextType>({
    self: {
        zkList: [],
        zbList: [],
        jbList: [],
        fwList: [],
        fwzyList: [],
        tzList: [],
        fnList: [],
        ygList: [],
        hyList: [],
        jnList: []
    }
} as SelfContextType);

// 创建角色数值的上下文
export function useSelf() {
    const context = useContext(SelfContext);
    if (!context) {
        throw new Error('useSelf 必须在 SelfProvider 内部使用');
    }
    return context;
}