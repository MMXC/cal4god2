// providers/RoleProvider.tsx
'use client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {RoleContext, RoleType, SourcesType} from '@/contexts/RoleContext';
import {UserSelectionsContext, Selection} from "@/contexts/UserSelectionsContext";
import {fetchFwCards, fetchFwzyCards, fetchJbCards, fetchTzCards, fetchZbCards, fetchZkCards} from "@/services/api";

// Define specific types for calculateTotalScore
interface ScoreValues extends RoleType {
}

export function RoleProvider({children}: { children?: React.ReactNode }) {
    const [roleValues, setRoleValues] = useState<RoleType>({
        gj: 0,
        bs: 0,
        hs: 0,
        ds: 0,
        ls: 0,
        bm: 5.3,
        dm: 5.3,
        lm: 5.3,
        hm: 5.3,
        hx: 0,
        bjl: 19,
        bjsh: 170,
        qsxsh: 38,
        yczs: 0,
        dbzs: 0,
        zzsh: 21,
        dzdbzs: 0,
        pf: 0,
        totalScore: 0.86,
    });

    const [lists, setLists] = useState<any>({
        zkList: [],
        jbList: [],
        fwList: [],
        zbList: [],
        tzList: [],
        fwzyList: [],
    });
    useEffect(() => {
        Promise.all([
            fetchZkCards(),
            fetchJbCards(),
            fetchFwCards(),
            fetchZbCards(),
            fetchTzCards(),
            fetchFwzyCards(),
        ]).then(([zkList, jbList, fwList, zbList, tzList, fwzyList]) => {
            // 更新状态
            setLists({
                zkList: zkList,
                jbList: jbList,
                fwList: fwList,
                zbList: zbList,
                tzList: tzList,
                fwzyList: fwzyList,
            });
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);
    const calculateTotalScore = (values: ScoreValues) => {
        const maxBhsds = Math.max(values.bs ?? 0, values.hs ?? 0, values.ls ?? 0, values.ds ?? 0);
        const zzbjl = Math.min(values.bjl ?? 0, 100);
        return ((values.gj ?? 0) + 100) / 100 *
            (maxBhsds + (values.qsxsh ?? 0) + 100) / 100 *
            Math.min(values.bjl ?? 0, 100) / 100 *
            ((values.bjsh ?? 0) + 100) / 100 *
            ((values.yczs ?? 0) + 100) / 100 *
            ((values.dbzs ?? 0) + 100) / 100 *
            ((values.zzsh ?? 0) + 100) / 100 *
            ((values.dzdbzs ?? 0) + 100) / 100;
    };
    // // 一个简单的深拷贝实现，用于复制对象
    // const deepCopy = (obj: any): any => {
    //     if (obj === null || typeof obj !== "object") {
    //         return obj;
    //     }
    //
    //     let copy: Record<string, any> = {};
    //     for (let key in obj) {
    //         if (obj.hasOwnProperty(key)) {
    //             copy[key] = deepCopy(obj[key]);
    //         }
    //     }
    //     return copy;
    // };


    const [sources, setSources] = useState<any>({
        '强化': {qsxsh: 3, bjl: 9, bjsh: 20, zzsh: 6,},
        '基础': {bjsh: 150, bjl: 10,},
        '天赋': {},
        '主卡': {},
        '套装': {},
        '羁绊': {},
        '装备': {qsxsh: 30, zzsh: 15},
        '符文': {},
        '符文之语': {},
        '深空星海': {},
        '万物之母': {},
    });

    const [isLocked, setIsLocked] = useState(false);
    const [scoreChangeRatio, setScoreChangeRatio] = useState<number | null>(null); // Store the ratio of change since unlock
    const [oldRoleValues, setOldRoleValues] = useState<RoleType>(roleValues);

    const recalculateRoleAndSources = (userSelections: Selection|{}): { newRoleValues: RoleType, newSources: SourcesType } => {
        let newRoleValues: RoleType = {
            gj: 0,
            bs: 0,
            hs: 0,
            ds: 0,
            ls: 0,
            bm: 5.3,
            dm: 5.3,
            lm: 5.3,
            hm: 5.3,
            hx: 0,
            bjl: 19,
            bjsh: 170,
            qsxsh: 38,
            yczs: 0,
            dbzs: 0,
            zzsh: 21,
            dzdbzs: 0,
            pf: 0,
            totalScore: 0.86,
        };
        let newSources: SourcesType = {
            '强化': {qsxsh: 3, bjl: 9, bjsh: 20, zzsh: 6,},
            '基础': {bjsh: 150, bjl: 10,},
            '天赋': {},
            '主卡': {},
            '套装': {},
            '羁绊': {},
            '装备': {qsxsh: 30, zzsh: 15},
            '符文': {},
            '符文之语': {},
            '深空星海': {},
            '万物之母': {},
        };

        const nameReflection = {
            "zkSelection": "主卡",
            "zbSelection": "装备",
            "jbSelection": "羁绊",
            "fwSelection": "符文",
            "fwzySelection": "符文之语",
            "tzSelection": "套装",
        };

        const processSelections = (items: any[], type: keyof Selection, specialCondition?: (item: any) => boolean) => {
            for (const item of items) {
                if (specialCondition && !specialCondition(item)) continue;

                let sx = item.sx;
                if (type === 'jbSelection') {
                    sx = item.level === '四级' ? item.forth :
                        item.level === '三级' ? item.third :
                            item.level === '二级' ? item.second :
                                item.level === '一级' ? item.first : item.forth;
                }

                Object.entries(sx).forEach((key: keyof RoleType|any, value:any) => {
                    if (key in newRoleValues) {
                        newRoleValues[key as keyof RoleType] = (newRoleValues[key as keyof RoleType] ?? 0) + value;
                        newSources[nameReflection[type]][key as keyof RoleType] = (newSources[nameReflection[type]][key as keyof RoleType] ?? 0) + value;
                    }
                });
            }
        };

        // Process all selections except 'jbSelection'
        function handleSelectionType(items: any[], type: keyof Selection, filter?: (item: any) => boolean) {
            try {
                if (type === 'jbSelection') {
                    processSelections(items, type, filter);
                } else {
                    processSelections(items, type);
                }
            } catch (error) {
                console.error(`Error processing selections for type ${type}:`, error);
                throw error;
            }
        }

        Object.keys(nameReflection).forEach((type:any) => {
            const filter = type === 'jbSelection' ? (item:any) => item.level !== undefined : undefined;
            handleSelectionType(userSelections[type as keyof (Selection|{})], type as keyof (Selection|{}), filter);
        });

        // Special handling for '深空星海' and '万物之母'
        const zkSelection = userSelections['zkSelection' as keyof (Selection|{})];
        const jbSelectionContains = (name: string) => {
            const jbSelection = userSelections['jbSelection' as keyof (Selection|{})];
            return (jbSelection as Array<{name: string}>)?.some(item => item.name === name) ?? false;
        };

        if (jbSelectionContains('深空星海')) {
            let gj = 0;
            let qsxsh = 0;
            (zkSelection as any[])?.forEach(item => {
                if (item.type === '神话' && item.quality === '至臻') {
                    gj += 4;
                    qsxsh += 4;
                } else if (item.type === '神话' || (item.type === '原初' && item.quality === '至臻')) {
                    gj += 3;
                    qsxsh += 3;
                } else if (item.type === '原初') {
                    gj += 2.5;
                    qsxsh += 2.5;
                }
            });
            newRoleValues.gj = (newRoleValues.gj ?? 0) + gj;
            newRoleValues.qsxsh = (newRoleValues.qsxsh ?? 0) + qsxsh;
            newSources['深空星海'].gj = (newSources['深空星海'].gj ?? 0) + gj;
            newSources['深空星海'].qsxsh = (newSources['深空星海'].qsxsh ?? 0) + qsxsh;
        }

        // Continue with the rest of your calculations...

        // Update totalScore after all calculations are done
        newRoleValues.totalScore = calculateTotalScore(newRoleValues);

        return { newRoleValues, newSources };
    };


    const updateRole = (userSelections: Selection|{}) => {
        if (!isLocked) {
            setOldRoleValues(roleValues);
        }
        const {newRoleValues, newSources} = recalculateRoleAndSources(userSelections);
        setRoleValues((prevState:any) => ({ ...prevState, ...newRoleValues }));
        setSources((prevState:any) => ({ ...prevState, ...newSources }));
        // Calculate score change ratio if needed
        const ratio = (((roleValues.totalScore ?? 0) - (oldRoleValues.totalScore ?? 0.86)) / (oldRoleValues.totalScore ?? 0.86)) * 100;
        setScoreChangeRatio(ratio);
    };

    const toggleLock = () => {
        setOldRoleValues((prevState:any) => {
            const newState = { ...prevState };
            Object.keys(roleValues).forEach(key => {
                newState[key as keyof RoleType] = roleValues[key as keyof RoleType]??0;
            });
            return newState;
        });
        setScoreChangeRatio(0);
        setIsLocked(!isLocked);
    };

    return (
        <RoleContext.Provider value={{
            roleValues,
            sources,
            updateRole,
            isLocked,
            lists,
            setLists,
            toggleLock,
            scoreChangeRatio
        }}>
            {children}
        </RoleContext.Provider>
    );
}
