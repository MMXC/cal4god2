// providers/RoleProvider.tsx
'use client';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {RoleContext, RoleType, SourcesType} from '@/contexts/RoleContext';
import {UserSelectionsContext, Selection} from "@/contexts/UserSelectionsContext";
import {
    fetchFwCards,
    fetchFwzyCards,
    fetchJbCards,
    fetchTtCards,
    fetchTzCards,
    fetchZbCards,
    fetchZkCards,
    fetchFnCards,
    fetchYgCards,
    fetchHyCards,
    fetchJnCards
} from "@/services/api";

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
        qsxsh: 8,
        yczs: 0,
        dbzs: 0,
        zzsh: 21,
        dzdbzs: 0,
        pf: 0,
        ct: 8,
        jn: 12,
        hj: 0,
        jk: 0,
        jf: 0,
        totalScore: 0.86,
    });

    const [lists, setLists] = useState<any>({
        zkList: [],
        jbList: [],
        fwList: [],
        zbList: [],
        tzList: [],
        fwzyList: [],
        ttList: [],
        fnList: [],
        ygList: [],
        hyList: [],
        jnList: []
    });
    useEffect(() => {
        Promise.all([
            fetchZkCards(),
            fetchJbCards(),
            fetchFwCards(),
            fetchZbCards(),
            fetchTzCards(),
            fetchFwzyCards(),
            fetchTtCards(),
            fetchFnCards(),
            fetchYgCards(),
            fetchHyCards(),
            fetchJnCards()
        ]).then(([zkList, jbList, fwList, zbList, tzList, fwzyList, ttList, fnList, ygList, hyList, jnList]) => {
            // 更新状态
            setLists({
                zkList: zkList,
                jbList: jbList,
                fwList: fwList,
                zbList: zbList,
                tzList: tzList,
                fwzyList: fwzyList,
                ttList: ttList,
                fnList: fnList,
                ygList: ygList,
                hyList: hyList,
                jnList: jnList
            });
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);
    const calculateTotalScore = (values: ScoreValues) => {
        const maxBhsds = Math.max(values.bs ?? 0, values.hs ?? 0, values.ls ?? 0, values.ds ?? 0);
        const zzbjl = Math.min(values.bjl ?? 0, 100);
        const fy = Math.max((50 - (values.ct ?? 0)), 0);
        return ((values.gj ?? 0) + 100) / 100 *
            (maxBhsds + (values.qsxsh ?? 0) + 100) / 100 *
            Math.min(values.bjl ?? 0, 100) / 100 *
            ((values.bjsh ?? 0)) / 100 *
            ((values.yczs ?? 0) + 100) / 100 *
            ((values.dbzs ?? 0) + (values.dzdbzs ?? 0) + 100) / 100 *
            ((values.zzsh ?? 0) + 100) / 100 *
            ((values.jn ?? 0) + 100) / 100 *
            // 防御区
            ((100 - fy)) / 100 *
            // 抗性区
            (100 - 15 + (values.jk ?? 0)) / 100
            ;
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
        '装备': {zzsh: 15},
        '符文': {},
        '符文之语': {},
        '赋能': {},
        '黄印词条': {},
        '远古词条': {},
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
            dm: 0,
            lm: 0,
            hm: 5.3,
            hx: 0,
            bjl: 19,
            bjsh: 170,
            qsxsh: 8,
            yczs: 0,
            dbzs: 0,
            zzsh: 21,
            dzdbzs: 0,
            pf: 0,
            ct: 8,
            jn: 12,
            hj: 0,
            totalScore: 0.86,
        };
        let newSources: SourcesType = {
            '强化': {qsxsh: 3, bjl: 9, bjsh: 20, zzsh: 6,},
            '基础': {bjsh: 150, bjl: 10,},
            '天赋': {},
            '主卡': {},
            '套装': {},
            '羁绊': {},
            '装备': { zzsh: 15},
            '符文': {},
            '赋能': {},
            '符文之语': {},
            '黄印词条': {},
            '远古词条': {},
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
            "fnSelection": "赋能",
            "ygSelection": "远古词条",
            "hySelection": "黄印词条",
        };


        function processSelections(items: any[], type: keyof Selection, newRoleValues: any, newSources: any, specialCondition?: (item: any) => boolean): { updatedRoleValues: any, updatedSources: any } {
            for (const item of items) {
                // ... (保留原有逻辑)
                if (specialCondition && !specialCondition(item)) continue;

                let sx = item.sx;
                if (type === 'jbSelection') {
                    sx = item.level === '四级' ? item.forth :
                        item.level === '三级' ? item.third :
                            item.level === '二级' ? item.second :
                                item.level === '一级' ? item.first : item.forth;
                }

                Object.entries(sx).forEach(([key, value]:[any,any]) => {
                    if (key in newRoleValues) {
                        newRoleValues[key as keyof RoleType] = (newRoleValues[key as keyof RoleType] ?? 0) + value;
                        newSources[nameReflection[type]][key as keyof RoleType] = (newSources[nameReflection[type]][key as keyof RoleType] ?? 0) + value;
                    }
                });
            }
            return { updatedRoleValues: newRoleValues, updatedSources: newSources };
        }

        // Process all selections except 'jbSelection'
        function handleSelectionType(items: any[], type: keyof Selection, newRoleValues: any, newSources: any, filter?: (item: any) => boolean) {
            try {
                if (type === 'jbSelection') {
                    return  processSelections(items, type, newRoleValues, newSources, filter);
                } else {
                    return processSelections(items, type, newRoleValues, newSources );
                }
            } catch (error) {
                console.error(`Error processing selections for type ${type}:`, error);
                throw error;
            }
        }

        Object.keys(nameReflection).forEach((type:any) => {
            const filter = type === 'jbSelection' ? (item:any) => item.level !== undefined : undefined;
            const {updatedRoleValues, updatedSources} = handleSelectionType(userSelections[type as keyof (Selection|{})], type as keyof (Selection|{}), newRoleValues, newSources, filter);
            Object.entries(updatedRoleValues ?? {}).forEach(([key, value]:[any, any]) => {
                newRoleValues[key as keyof RoleType] = value;
            });

            Object.entries(updatedSources ?? {}).forEach(([sourceKey, sourceValue]) => {
                newSources[sourceKey as string] = newSources[sourceKey as string] || {};
                Object.entries(sourceValue ?? {}).forEach(([roleKey, roleValue]) => {
                    (newSources[sourceKey as string])[roleKey as string] = roleValue;
                });
            });
        });

        // Special handling for '深空星海' and '万物之母'
        const zkSelection = userSelections['zkSelection' as keyof (Selection|{})];
        const jbSelectionContains = (name: string) => {
            const jbSelection = userSelections['jbSelection' as keyof (Selection|{})];
            return (jbSelection as Array<{name: string}>)?.some(item => item.name === name) ?? false;
        };
        const zbSelectionContains = (name: string) => {
            const zbSelection = userSelections['zbSelection' as keyof (Selection|{})];
            return (zbSelection as Array<{name: string}>)?.some(item => item.name === name) ?? false;
        };


        // Continue with the rest of your calculations...
        const midMaxSx = Math.max(newRoleValues?.bs??0, newRoleValues?.hs??0, newRoleValues?.ls??0, newRoleValues?.ds??0);
        switch (midMaxSx){
            case newRoleValues.bs:
                newSources['装备'].bs += 15 * 2;
                newRoleValues.bs = (newRoleValues.bs??0) + 15 * 2;
                break;
            case newRoleValues.hs:
                newSources['装备'].hs += 15 * 2;
                newRoleValues.hs = (newRoleValues.hs??0) + 15 * 2;
                break;
            case newRoleValues.ls:
                newSources['装备'].ls += 15 * 2;
                newRoleValues.ls = (newRoleValues.ls??0) + 15 * 2;
                break;
            case newRoleValues.ds:
                newSources['装备'].ds += 15 * 2;
                newRoleValues.ds = (newRoleValues.ds??0) + 15 * 2;
                break;
        }
        if (jbSelectionContains('万物之母')) {
            const lastMaxSx = Math.max(newRoleValues?.bs!, newRoleValues?.hs!, newRoleValues?.ls!, newRoleValues?.ds!);
            const otherSums = (newRoleValues?.qsxsh??0) * 3 + 15 * 4 + (newRoleValues?.bs!) + (newRoleValues?.hs!) + (newRoleValues?.ls!) + (newRoleValues?.ds!) - lastMaxSx - 13;
            switch (lastMaxSx) {
                case newRoleValues.bs:
                    newSources['万物之母'].bs = otherSums * 0.2 + (10 * 2 + (newRoleValues?.bm!)) * 0.65;
                    newRoleValues.bs = (newRoleValues?.bs!) + newSources['万物之母'].bs;
                    break;
                case newRoleValues.hs:
                    newSources['万物之母'].hs = otherSums * 0.2 + (10 * 2 + (newRoleValues?.hm!)) * 0.65;
                    newRoleValues.hs = (newRoleValues?.hs!) + newSources['万物之母'].hs;
                    break;
                case newRoleValues.ls:
                    newSources['万物之母'].ls = otherSums * 0.2 + (10 * 2 + (newRoleValues?.lm!)) * 0.65;
                    newRoleValues.ls = (newRoleValues?.ls!) + newSources['万物之母'].ls;
                    break;
                case newRoleValues.ds:
                    newSources['万物之母'].ds = otherSums * 0.2 + (10 * 2 + (newRoleValues?.dm!)) * 0.65;
                    newRoleValues.ds = (newRoleValues?.ds!) + newSources['万物之母'].ds;
                    break;
            }

        }

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

        // 针对装备圣骸遗骨特殊处理 暴击伤害提升为原总暴击伤害的50%
        if (zbSelectionContains('圣骸遗骨     ')) {
            newSources['装备'].bjsh = (newSources['装备'].bjsh ?? 0) - 50 + ((newRoleValues.bjsh ?? 0) - 50) * 0.5;
            newRoleValues.bjsh = ((newRoleValues.bjsh ?? 0) - 50) * 1.5;
        }

        // Update totalScore after all calculations are done
        newRoleValues.totalScore = calculateTotalScore(newRoleValues);

        return { newRoleValues, newSources };
    };


    const updateRole = async (userSelections: Selection|{}) => {
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

    // 计算伤害提升幅度
    const calculateDamageIncrease = (category: keyof Selection, item: any, currentSelections: Selection): number => {
        const newSelections = { ...currentSelections } as Selection;
        if (category === 'fwSelection') {
            newSelections[category] = [...(currentSelections[category] || []), item];
        } else {
            newSelections[category] = [...(currentSelections[category] || []), item];
        }
        // 复用本文件的 recalculateRoleAndSources
        const { newRoleValues: after } = recalculateRoleAndSources(newSelections);
        const { newRoleValues: before } = recalculateRoleAndSources(currentSelections);
        if (!before.totalScore) return 0;
        const increase = ((after.totalScore - before.totalScore) / before.totalScore) * 100;
        return Number(increase.toFixed(1));
    };

    // 计算技能伤害（示例实现，可根据实际需求调整）
    const calculateJnDamage = (jn: any) => {
        if (!jn) return 0;
        // 假设技能伤害 = 倍率 * 技能等级 * 基础攻击（这里用 roleValues.gj 代替）
        const base = roleValues.gj || 0;
        const multiplier = jn.multiplier || 1;
        const level = jn.level || 1;
        return Math.round(base * multiplier * level * 100);
    };

    return (
        <RoleContext.Provider value={{
            roleValues,
            sources,
            lists,
            setLists,
            updateRole,
            recalculateRoleAndSources,
            toggleLock,
            isLocked,
            scoreChangeRatio: scoreChangeRatio ?? 0,
            calculateDamageIncrease,
            calculateJnDamage,
        }}>
            {children}
        </RoleContext.Provider>
    );
}
