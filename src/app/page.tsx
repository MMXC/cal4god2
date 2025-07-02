'use client';
import Image from "next/image";
import Cal from '@/components/component/cal';
import Zk from '@/components/component/zk';
import Fw from '@/components/component/fw';

import { UserSelectionProvider } from '@/providers/UserSelectionProvider';
import { RoleProvider } from "@/providers/RoleProvider";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import Fwzy from "@/components/component/fwzy";
import Jb from "@/components/component/jb";
import Zb from "@/components/component/zb";
import Tz from "@/components/component/tz";
import Tt from "@/components/component/tt";
import Bd from "@/components/component/bd";
import Hy from "@/components/component/hy";
import Yg from "@/components/component/yg";
import Fn from "@/components/component/fn";
import Self from "@/components/component/self";
import Simulator from "./pages/Simulator";
import Group from "./pages/Group";
import Profile from "./pages/Profile";

const NAVS = [
  { key: "simulator", label: "模拟搭配" },
  { key: "group", label: "旅团信息" },
  { key: "profile", label: "个人设置" }
];

export default function Home() {
  const [active, setActive] = useState("simulator");
  const [self, setSelf] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-0">
      
      <nav className="w-full flex justify-center gap-8 py-6 bg-gradient-to-r from-blue-900 via-blue-400 to-red-400 shadow myth-nav  myth-card-area">
        {NAVS.map(nav => (
          <button
            key={nav.key}
            className={`px-8 py-2 rounded-full font-bold text-lg transition-all border-2 border-white/60 shadow-lg
              ${active === nav.key ? "bg-white/80 text-blue-900 scale-105" : "bg-blue-900/60 text-white hover:bg-white/30"}`}
            onClick={() => setActive(nav.key)}
          >
            {nav.label}
          </button>
        ))}
      </nav>
      <section className="w-full flex-1 flex justify-center items-start py-1">
        {active === "simulator" && <Simulator />}
        {active === "group" && <Group />}
        {active === "profile" && <Profile />}
      </section>
    </main>
  );
}
