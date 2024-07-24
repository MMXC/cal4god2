// providers/UserSelectionProvider.tsx

import {useContext, useEffect, useState} from "react";
import {UserSelectionsContext,Selection} from "@/contexts/UserSelectionsContext"
type Props = {
    children: React.ReactNode;
};
import {RoleContext} from "@/contexts/RoleContext"

export function UserSelectionProvider({ children }: Props) {
    const [userSelections, setUserSelections] = useState<Selection>({
        zkSelection: [],
        zbSelection: [],
        jbSelection: [],
        fwSelection: [],
        fwzySelection: [],
        tzSelection: [],
    });
    const {updateRole} = useContext(RoleContext);
    useEffect(() => {
        // 这里可以添加一些副作用，比如保存数据到localStorage或数据库
        updateRole(userSelections);
        localStorage.clear();
        localStorage.setItem('userSelections', JSON.stringify(userSelections));
    }, [userSelections]);

    const selectItem = async (category: keyof Selection, item: any) => {
        setUserSelections((prevState) => ({
            ...prevState,
            [category]: [...prevState[category], item],
        }));
    };

    const deleteItem = async (category: keyof Selection, itemId: string) => {
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
    const deleteOneItem = async (category: keyof Selection, itemId: string) => {
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
    return (
        <UserSelectionsContext.Provider value={{ userSelections, selectItem, deleteItem, deleteOneItem }}>
            {children}
        </UserSelectionsContext.Provider>
    );
}
