"use client";
import { useEffect, useState } from "react";
import { fetchProfileInfo } from "@/services/api";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfileInfo().then(setProfile);
  }, []);

  return (
    <div className="myth-bg-profile min-h-[600px] flex flex-col items-center justify-center p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">个人设置</h2>
      {profile ? (
        <div className="bg-white/70 rounded-lg p-6 w-full max-w-md flex flex-col items-center">
          <img src={profile.avatar} alt="头像" className="w-24 h-24 rounded-full border-4 border-blue-200 mb-4" />
          <div className="text-xl font-semibold text-blue-900 mb-2">{profile.nickname}</div>
          <div className="text-gray-600 mb-2">{profile.signature}</div>
          <div className="flex gap-4 text-blue-800">
            <span>职业：{profile.role}</span>
            <span>等级：{profile.level}</span>
          </div>
        </div>
      ) : <div className="text-white">加载中...</div>}
    </div>
  );
} 