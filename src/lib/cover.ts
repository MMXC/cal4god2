import { RoleType } from '@/contexts/RoleContext'; // 假设这是你的类型定义文件路径

type RadarDataType = {
    name: string;
    value: number;
};

export const convertToRadarData = (role: RoleType): RadarDataType[] => {
    const maxBhsds = Math.max(role.bs, role.hs, role.ls, role.ds);

    return [
        { name: '攻击', value: role.gj },
        { name: '主属伤', value: maxBhsds + role.qsxsh },
        { name: '暴击率', value: role.bjl },
        { name: '暴击伤害', value: role.bjsh },
        { name: '异常增伤', value: role.yczs },
        { name: '对Boss增伤', value: role.dbzs },
        { name: '最终伤害', value: role.zzsh },
        { name: '对指定Boss增伤', value: role.dzdbzs },
    ];
};
