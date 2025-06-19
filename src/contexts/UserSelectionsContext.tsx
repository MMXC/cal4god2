// contexts/UserSelectionContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Selection = {
    zkSelection: any[];
    zbSelection: any[];
    jbSelection: any[];
    fwSelection: any[];
    fwzySelection: any[];
    tzSelection: any[];
    fnSelection: any[];
    ygSelection: any[];
    hySelection: any[];
    jnSelection: any[];
};

type UserSelectionContextType = {
    userSelections: Selection;
    selectItem: (category: any, item: any) => void;
    deleteItem: (category: any, item: any) => void;
    deleteOneItem: (category: any, item: any) => void;
    setUserSelections: (selections: Selection) => void;
};

export const UserSelectionsContext = createContext<UserSelectionContextType>({
    userSelections: {
        zkSelection: [],
        zbSelection: [],
        jbSelection: [],
        fwSelection: [],
        fwzySelection: [],
        tzSelection: [],
        fnSelection: [],
        ygSelection: [],
        hySelection: [],
        jnSelection: []
    },
    selectItem: async () => { },
    deleteItem: async () => { },
    deleteOneItem: async () => { },
    setUserSelections: () => {},
});

export function useUserSelections() {
    const context = useContext(UserSelectionsContext);
    if (!context) {
        throw new Error('useUserSelection must be used within a UserSelectionProvider');
    }
    return context;
}
