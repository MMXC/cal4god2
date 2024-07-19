// contexts/UserSelectionContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';

type Selection = {
    zkSelection: any[];
    zbSelection: any[];
    jbSelection: any[];
    fwSelection: any[];
    fwzySelection: any[];
    tzSelection: any[];
};

type UserSelectionContextType = {
    userSelections: Selection;
    selectItem: (category: string, item: string) => void;
    deleteItem: (category: keyof Selection, item: string) => void;
    deleteOneItem: (category: keyof Selection, item: string) => void;
};

export const UserSelectionContext = createContext<UserSelectionContextType | null>(null);

export function useUserSelection() {
    const context = useContext(UserSelectionContext);
    if (!context) {
        throw new Error('useUserSelection must be used within a UserSelectionProvider');
    }
    return context;
}
