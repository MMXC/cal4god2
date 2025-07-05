"use client";
import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import Pe from "@/components/component/pe";
import Cal from "@/components/component/cal";

const roles = [
  { nickname: "海拉", avatar: "/placeholder.svg", soulPower: 100, baseAttack: 200, alienScore: 300, expeditionDamage: 400, display: "冥界女王" },
  { nickname: "卡奥斯", avatar: "/placeholder.svg", soulPower: 120, baseAttack: 220, alienScore: 320, expeditionDamage: 420, display: "混沌之主" },
  { nickname: "伊斯特", avatar: "/placeholder.svg", soulPower: 110, baseAttack: 210, alienScore: 310, expeditionDamage: 410, display: "智慧女神" },
];

export default function Profile() {
  const { role, setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState(0);
  const currentRole = roles[selectedRole];

  return (

    <main className="flex flex-col min-h-screen w-full myth-bg-simulator relative">
      {/* pe区域：角色大图+基础描述+属性 */}
      <section className="w-full flex flex-col items-center justify-center py-8 bg-white/80">
        <Pe role={currentRole} />
      </section>
      {/* cal区域：只读搭配详情 */}
      <section className="w-full flex flex-col items-center justify-center py-8 bg-white/90">
        <Cal readOnly role={currentRole} />
      </section>
      {/* 右下角悬浮角色选择栏 */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-center">
        {roles.map((r, idx) => (
          <button
            key={r.nickname}
            className={`w-16 h-16 rounded-full border-4 shadow-lg bg-white/90 flex flex-col items-center justify-center transition-all duration-150
              ${selectedRole === idx ? "border-blue-500 scale-110" : "border-gray-300 opacity-70 hover:opacity-100"}`}
            onClick={() => setSelectedRole(idx)}
            title={r.nickname}
          >
            <img src={r.avatar} alt={r.nickname} className="w-12 h-12 rounded-full mb-1" />
            <span className="text-xs font-bold text-blue-900">{r.nickname}</span>
          </button>
        ))}
      </div>
    </main>
  );
} 