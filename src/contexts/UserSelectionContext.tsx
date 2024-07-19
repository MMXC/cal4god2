// contexts/UserSelectionContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';

export type Selection = {
    zkSelection: any[];
    zbSelection: any[];
    jbSelection: any[];
    fwSelection: any[];
    fwzySelection: any[];
    tzSelection: any[];
};

type UserSelectionContextType = {
    userSelections: Selection;
    selectItem: (category: keyof Selection, item: any) => void;
    deleteItem: (category: keyof Selection, item: any) => void;
    deleteOneItem: (category: keyof Selection, item: any) => void;
};

export const UserSelectionContext = createContext<UserSelectionContextType>({
    userSelections: {zkSelection: [], zbSelection: [], jbSelection: [], fwSelection: [], fwzySelection: [], tzSelection: []},
    selectItem: () => {},
    deleteItem: () => {},
    deleteOneItem: () => {}
});



export function useUserSelection() {
    const context = useContext(UserSelectionContext);
    if (!context) {
        throw new Error('useUserSelection must be used within a UserSelectionProvider');
    }
    return context;
}
