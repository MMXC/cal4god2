// providers/UserSelectionProvider.tsx

import {useEffect, useState} from "react";
import {SelfContext, SelfType} from "@/contexts/SelfContext"

type Props = {
    children: React.ReactNode;
};

export function SelfProvider({children}: Props) {
    const [self, setSelf] = useState<SelfType>({
        zkList: [],
        zbList: [],
        jbList: [],
        fwList: [],
        fwzyList: [],
        tzList: [],
    });
    useEffect(() => {
        // 这里可以添加一些副作用，比如保存数据到localStorage或数据库
        localStorage.removeItem('self');
        localStorage.setItem('self', JSON.stringify(self));
    }, [self]);


    return (
        <SelfContext.Provider value={{self}}>
            {children}
        </SelfContext.Provider>
    );
}
