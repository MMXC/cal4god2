import React, { useState, useRef } from "react";
import html2canvas from 'html2canvas';
import { Button } from "../ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import { BombIcon } from "lucide-react";
import Cal from "./cal";

const roles = ["斩魂者", "影舞者", "代行者", "圣者", "亡语者", "猎人", "魔王", "魂刃", "战将"];

const baseInfoFields = [
  { key: "nickname", label: "昵称" },
  { key: "soulPower", label: "魂力" },
  { key: "alienScore", label: "异星积分" },
  { key: "expeditionDamage", label: "远征伤害" },
  { key: "display", label: "个性化展示" },
];

const advancedFields = [
  { key: "baseAttack", label: "基础攻击" },
  { key: "panelAttack", label: "面板攻击" },
  { key: "critRate", label: "暴击率" },
  { key: "critDamage", label: "暴击伤害" },
  { key: "role", label: "职业" },
];

export default function Pe({ role }: { role: any }) {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-8 items-center">
      {/* 左侧：角色实图 */}
      <div className="flex justify-center">
        <div className="relative w-[220px] h-[320px] rounded-2xl overflow-hidden shadow-lg border-4 border-blue-300 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
          <img src={role.gameAvatar || role.avatar} alt="角色实图" className="object-cover w-full h-full" />
        </div>
      </div>
      {/* 中间：玩家卡牌 */}
      <div className="flex flex-col items-center bg-white/90 rounded-2xl shadow-lg border-2 border-blue-200 p-6 min-h-[320px]">
        <div className="text-2xl font-bold text-blue-900 mb-2">{role.nickname}</div>
        <div className="text-base text-blue-700 mb-1">{role.display}</div>
        {role.oldNicknames && (
          <div className="text-xs text-gray-500 mb-2">曾用名：{role.oldNicknames.join("、")}</div>
        )}
        {/* 其他个性化展示 */}
        <div className="text-sm text-gray-600">{role.customShow || "暂无个性化展示"}</div>
      </div>
      {/* 右侧：属性竖排 */}
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 w-full">
          <span className="text-gray-500">魂力</span>
          <span className="text-2xl font-bold text-blue-800">{role.soulPower ?? "未设置"}</span>
        </div>
        <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 w-full">
          <span className="text-gray-500">基础攻击</span>
          <span className="text-2xl font-bold text-blue-800">{role.baseAttack ?? "未设置"}</span>
        </div>
        <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 w-full">
          <span className="text-gray-500">面板攻击</span>
          <span className="text-2xl font-bold text-blue-800">{role.panelAttack ?? "未设置"}</span>
        </div>
        <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 w-full">
          <span className="text-gray-500">远征伤害</span>
          <span className="text-2xl font-bold text-blue-800">{role.expeditionDamage ?? "未设置"}</span>
        </div>
        <div className="flex flex-col items-center bg-blue-50 rounded-lg p-3 w-full">
          <span className="text-gray-500">异星积分</span>
          <span className="text-2xl font-bold text-blue-800">{role.alienScore ?? "未设置"}</span>
        </div>
      </div>
    </div>
  );
}