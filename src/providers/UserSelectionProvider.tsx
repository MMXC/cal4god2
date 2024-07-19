// providers/UserSelectionProvider.tsx
import {useEffect, useState} from 'react';
import {UserSelectionContext} from '@/contexts/UserSelectionContext';

type Selection = {
    zkSelection: string[];
    zbSelection: string[];
    jbSelection: string[];
    fwSelection: string[];
    fwzySelection: string[];
    tzSelection: string[];
};

type Props = {
    children: React.ReactNode;
};

export function UserSelectionProvider({ children }: Props) {
    const [userSelections, setUserSelections] = useState<Selection>({
        zkSelection: [],
        zbSelection: [],
        jbSelection: [],
        fwSelection: [],
        fwzySelection: [],
        tzSelection: [],
    });

    const selectItem = (category: keyof Selection, item: any) => {
        if (userSelections[category].length < 12) {
            setUserSelections((prevState) => ({
                ...prevState,
                [category]: [...prevState[category], item],
            }));
            console.log('card pic:', item.pic); // 打印更新前的状态

        }
    };

    const deleteItem = (category: keyof Selection, itemId: string) => {
        console.log('Before deletion:', userSelections); // 打印更新前的状态

        setUserSelections((prevState) => {
            const updatedState = {
                ...prevState,
                [category]: prevState[category].filter(item => item.id !== itemId),
            };

            console.log('Updated state before setting:', updatedState); // 打印即将设置的状态

            return updatedState;
        });

        console.log('After deletion:', userSelections); // 尝试打印更新后的状态，但这可能不会立即反映最新状态
    };
    const deleteOneItem = (category: keyof Selection, itemId: string) => {
        console.log('Before deletion:', userSelections); // 打印更新前的状态

        setUserSelections((prevState) => {
            const index = prevState[category].findIndex(item => item.id === itemId);
            let updatedCategoryItems = [...prevState[category]];

            if (index !== -1) {
                // 删除找到的元素
                updatedCategoryItems = [
                    ...updatedCategoryItems.slice(0, index),
                    ...updatedCategoryItems.slice(index + 1)
                ];
            }

            return {
                ...prevState,
                [category]: updatedCategoryItems,
            };
        });

        console.log('After deletion:', userSelections); // 尝试打印更新后的状态，但这可能不会立即反映最新状态
    };


    useEffect(() => {
        // 这里可以添加一些副作用，比如保存数据到localStorage或数据库
        localStorage.setItem('userSelections', JSON.stringify(userSelections));
    }, [userSelections]);

    return (
        <UserSelectionContext.Provider value={{ userSelections, selectItem, deleteItem, deleteOneItem }}>
            {children}
        </UserSelectionContext.Provider>
    );
}
