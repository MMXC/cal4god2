"use client";
import { useEffect, useState } from "react";
import { fetchGroupInfo } from "@/services/api";

export default function Group() {
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    fetchGroupInfo().then(setGroup);
  }, []);

  return (
    <div className="myth-bg-group min-h-[600px] flex flex-col items-center justify-center p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">旅团信息</h2>
      {group ? (
        <div className="bg-white/70 rounded-lg p-6 w-full max-w-2xl">
          <div className="flex items-center mb-4">
            <img src={group.badge} alt="团徽" className="w-16 h-16 rounded-full border-4 border-blue-200 mr-4" />
            <div>
              <div className="text-xl font-semibold text-blue-900">{group.name}</div>
              <div className="text-gray-600">{group.desc}</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-blue-800 mb-2">成员花名册：</div>
            <div className="grid grid-cols-2 gap-4">
              {group.members.map((m: any) => (
                <div key={m.id} className="flex items-center bg-blue-50 rounded-lg p-2 shadow">
                  <img src={m.avatar} alt={m.nickname} className="w-10 h-10 rounded-full border-2 border-blue-300 mr-2" />
                  <div>
                    <div className="font-semibold">{m.nickname}</div>
                    <div className="text-xs text-gray-500">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : <div className="text-white">加载中...</div>}
    </div>
  );
} 