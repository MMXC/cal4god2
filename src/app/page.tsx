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


export default function Home() {
  const [activeTab, setActiveTab] = useState("zk"); // 将 "active" 改为 "zk" 或其他tab的值
  return (
      <RoleProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <code className="font-mono font-bold">不俍人: </code>
            <span style={{fontSize: "12px", color: "#999"}} title={"注：(万物之母-默认130全属伤 深海星空默认42%攻击 42%全属伤 符文之语默认9级 符文默认8级 会心暂时按50:1折算暴击率)"}> &nbsp;古魂角色搭配模拟器&nbsp; </span>

          </p>

          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By:{" "}
              <Image
                src="/pr.svg"
                alt="不俍人出品"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>
        <UserSelectionProvider>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          {/*<Image*/}
          {/*  className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"*/}
          {/*  src="/next.svg"*/}
          {/*  alt="Next.js Logo"*/}
          {/*  width={180}*/}
          {/*  height={37}*/}
          {/*  priority*/}
          {/*/>*/}
          <Cal />
        </div>
        </UserSelectionProvider>

        <div className="mt-4 tabs-container justify-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="tabs-list flex justify-center">
              <TabsTrigger value="zk">主卡</TabsTrigger>
              <TabsTrigger value="zb">装备</TabsTrigger>
              <TabsTrigger value="fw">符文</TabsTrigger>
              <TabsTrigger value="fwzy">符文之语</TabsTrigger>
              <TabsTrigger value="tz">套装</TabsTrigger>
              <TabsTrigger value="jb">羁绊</TabsTrigger>
            </TabsList>
            <TabsContent value="zk" className="tabs-content">
              <Zk />
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
            <TabsContent value="fwzy" className="tabs-content">
              <Fwzy />
            </TabsContent>
            <TabsContent value="fw" className="tabs-content">
              <Fw />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      </RoleProvider>
  );
}
