'use client';
import Image from "next/image";
import Cal2 from '@/components/component/cal2';
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
import Cal from '@/components/component/cal';

export default function Simulator() {
  const [activeTab, setActiveTab] = useState("zk");
  const [self, setSelf] = useState(false);
  const [showCal2, setShowCal2] = useState(true); // Cal/Cal2 切换
  return (
      <RoleProvider><UserSelectionProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-0 myth-bg-simulator">
        
        <div className="grid grid-cols-[1fr_10fr_1fr] gap-6 bottom-0 left-0 sm:h-58 h-68 w-200 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none myth-card-area">
          <Tt />
          {showCal2 ? <Cal /> : <Cal2 />}
          <Bd />
        </div>

        {/* 悬浮切换控件 */}
        <div style={{ position: 'fixed', right: 32, bottom: 32, zIndex: 50 }}>
          <button
            className="rounded-full bg-blue-500 text-white px-4 py-2 shadow-lg hover:bg-blue-600 transition"
            onClick={() => setShowCal2((prev) => !prev)}
          >
            {showCal2 ? 'V1' : 'V2'}
          </button>
        </div>

        <div className="flex mt-4 tabs-container justify-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="scrollable-tabs-list tabs-list flex justify-center">
              <TabsTrigger value="zk">主卡</TabsTrigger>
              <TabsTrigger value="fn">赋能</TabsTrigger>
              <TabsTrigger value="jb">羁绊</TabsTrigger>
              <TabsTrigger value="tz">套装</TabsTrigger>
              <TabsTrigger value="zb">装备</TabsTrigger>
              <TabsTrigger value="yg">远古词条</TabsTrigger>
              <TabsTrigger value="hy">黄印词条</TabsTrigger>
              <TabsTrigger value="fw">符文</TabsTrigger>
              <TabsTrigger value="fwzy">符文之语</TabsTrigger>
            </TabsList>
            <TabsContent value="zk" className="tabs-content">
              <Zk />
            </TabsContent>
            <TabsContent value="fn" className="tabs-content">
              <Fn />
            </TabsContent>
            <TabsContent value="jb" className="tabs-content">
              <Jb />
            </TabsContent>
            <TabsContent value="tz" className="tabs-content">
              <Tz />
            </TabsContent>
            <TabsContent value="zb" className="tabs-content">
              <Zb />
            </TabsContent>
            <TabsContent value="yg" className="tabs-content">
              <Yg />
            </TabsContent>
            <TabsContent value="hy" className="tabs-content">
              <Hy />
            </TabsContent>
            <TabsContent value="fwzy" className="tabs-content">
              <Fwzy />
            </TabsContent>
            <TabsContent value="fw" className="tabs-content">
              <Fw />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      </UserSelectionProvider></RoleProvider>
  );
} 