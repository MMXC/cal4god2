// providers/RoleProvider.tsx
'use client';
import React, {useState} from 'react';
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
        totalScore: 1,
    });
    const calculateTotalScore = (values: ScoreValues) => {
        const maxBhsds = Math.max(values.bs, values.hs, values.ls, values.ds);
        return (values.gj + 100) / 100 *
            (maxBhsds + values.qsxsh + 100) / 100 *
            values.bjl / 100 *
            (values.bjsh + 100) / 100 *
            (values.yczs + 100) / 100 *
            (values.dbzs + 100) / 100 *
            (values.zzsh + 100) / 100 *
            (values.dzdbzs + 100) / 100;
    };
    const [oldRoleValues, setOldRoleValues] = useState<RoleType>(roleValues);
    const [sources, setSources] = useState<SourcesType | {}>({
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
    const [lockScoreSnapshot, setLockScoreSnapshot] = useState<number | null>(null); // Store the snapshot of the score when locked
    const [scoreChangeRatio, setScoreChangeRatio] = useState<number | null>(null); // Store the ratio of change since unlock
    roleValues.totalScore = calculateTotalScore(roleValues);
    const updateRole = (updater: RoleType, type: string, operation: 'add' | 'remove') => {
        setRoleValues(prev => {
            const updatedValues = { ...prev };
            const updatedSources = { ...sources };
            for (const key in updater) {
                if (updater.hasOwnProperty(key)) {
                    const value = updater[key];

                    // Update role values
                    updatedValues[key as keyof RoleType] = operation === 'add'
                        ? prev[key as keyof RoleType] + value
                        : prev[key as keyof RoleType] - value;

                    // Update sources
                    if (!updatedSources[type]) {
                        updatedSources[type] = {};
                    }
                    if (!updatedSources[type][key as keyof RoleType]) {
                        updatedSources[type][key as keyof RoleType] = 0;
                    }
                    if (operation === 'add') {
                        updatedSources[type][key as keyof RoleType] += value;
                    } else if (operation === 'remove') {
                        updatedSources[type][key as keyof RoleType] -= value;
                    }
                }
            }

            // Update total score
            updatedValues.totalScore = calculateTotalScore(updatedValues);
            return updatedValues;
        });
        roleValues.totalScore  = calculateTotalScore(roleValues);
        setSources(sources);
        const ratio = ((roleValues.totalScore - lockScoreSnapshot) / lockScoreSnapshot)*100;
        setScoreChangeRatio(ratio);
        if(!isLocked){
            setLockScoreSnapshot(calculateTotalScore(roleValues));
            setOldRoleValues(roleValues);
        }

    };

    const toggleLock = () => {
        if (!isLocked) {
            // Save the current score when locking
            setOldRoleValues({
                ...roleValues,
                totalScore: calculateTotalScore(roleValues),
            });
            setLockScoreSnapshot(roleValues.totalScore)
            setScoreChangeRatio(0); // Reset ratio on lock
        } else {
            // No action needed when unlocking, ratio will be calculated in updateRole
            setScoreChangeRatio(0);
        }
        setIsLocked(!isLocked);
    };

    return (
        <RoleContext.Provider value={{
            roleValues,
            sources,
            updateRole,
            isLocked,
            toggleLock,
            lockScoreSnapshot,
            scoreChangeRatio
        }}>
            {children}
        </RoleContext.Provider>
    );
}
