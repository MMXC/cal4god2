// providers/RoleProvider.tsx
'use client';
import React, {useEffect, useRef, useState} from 'react';
import {RoleContext, RoleType, SourcesType} from '@/contexts/RoleContext';

// Define specific types for calculateTotalScore
interface ScoreValues extends RoleType {}

export function RoleProvider({ children }: { children?: React.ReactNode }) {
    const [roleValues, setRoleValues] = useState<RoleType & { totalScore: number }>({
        gj: 0,
        bs: 0,
        hs: 0,
        ds: 0,
        ls: 0,
        bm: 20,
        dm: 20,
        lm: 20,
        hm: 20,
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

    const calculateTotalScore = (values: ScoreValues) => {
        const maxBhsds = Math.max(values.bs??0, values.hs??0, values.ls??0, values.ds??0);
        return ((values.gj??0) + 100) / 100 *
            (maxBhsds + (values.qsxsh??0) + 100) / 100 *
            (values.bjl??0) / 100 *
            ((values.bjsh??0) + 100) / 100 *
            ((values.yczs??0) + 100) / 100 *
            ((values.dbzs??0) + 100) / 100 *
            ((values.zzsh??0) + 100) / 100 *
            ((values.dzdbzs??0) + 100) / 100;
    };
    // 一个简单的深拷贝实现，用于复制对象
    const deepCopy = (obj:any) => {
        if (obj === null || typeof obj !== "object") {
            return obj;
        }

        let copy = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key as keyof typeof obj] = deepCopy(obj[key]);
            }
        }
        return copy;
    };


    const [sources, setSources] = useState<any>({
        '强化': {qsxsh: 3, bjl: 9, bjsh: 20, zzsh: 6,},
        '基础': {bjsh: 150,bjl: 10,},
        '天赋': {},
        '主卡': {},
        '套装': {},
        '羁绊': {},
        '装备': {zzsh: 15},
        '符文': {},
        '符文之语': {}
    });

    const [isLocked, setIsLocked] = useState(false);
    const [scoreChangeRatio, setScoreChangeRatio] = useState<number | null>(null); // Store the ratio of change since unlock
    roleValues.totalScore = calculateTotalScore(roleValues);
    const [oldRoleValues, setOldRoleValues] = useState<RoleType>(deepCopy(roleValues));
    const oldRoleValuesRef = useRef(oldRoleValues);
    const updateRole = (updater: RoleType, type: keyof SourcesType, operation: 'add' | 'remove') => {
        setRoleValues((prev:any) => {
            if(!isLocked){
                setOldRoleValues(deepCopy(roleValues));
            }
            const updatedValues = { ...prev };
            const updatedSources = { ...sources };
            for (const key in updater) {
                if (updater.hasOwnProperty(key)) {
                    const value = updater[key as keyof RoleType];

                    // Update role values
                    updatedValues[key as keyof RoleType] = operation === 'add'
                        ? (prev[key as keyof RoleType]??0) + (value??0)
                        : (prev[key as keyof RoleType]??0) - (value??0);

                    // Update sources
                    if (!updatedSources[type as keyof typeof sources]) {
                        updatedSources[type as keyof typeof sources] = {};
                    }
                    if (!updatedSources[type as keyof typeof sources][key as keyof RoleType]) {
                        updatedSources[type as keyof typeof sources][key as keyof RoleType] = 0;
                    }
                    if (operation === 'add') {
                        updatedSources[type as keyof typeof sources][key as keyof RoleType] += (value??0);
                    } else if (operation === 'remove') {
                        updatedSources[type as keyof typeof sources][key as keyof RoleType] -= (value??0);
                    }
                }
            }
            return updatedValues;
        });
        roleValues.totalScore  = calculateTotalScore(roleValues);
        setSources(sources);
        const ratio = (((roleValues.totalScore??0) - (oldRoleValues.totalScore??0.86)) / (oldRoleValues.totalScore??0.86))*100;
        setScoreChangeRatio(ratio);
    };

    const toggleLock = () => {
        setOldRoleValues(deepCopy(roleValues));
        setScoreChangeRatio(0);
        setIsLocked(!isLocked);
    };

    return (
        <RoleContext.Provider value={{
            roleValues,
            sources,
            updateRole,
            isLocked,
            toggleLock,
            scoreChangeRatio
        }}>
            {children}
        </RoleContext.Provider>
    );
}
