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


export default function Home() {
  const [activeTab, setActiveTab] = useState("zk"); // 将 "active" 改为 "zk" 或其他tab的值
  const [self, setSelf] = useState(false);
  return (
      <RoleProvider><UserSelectionProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex sm:flex w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="flex sm:flex left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <code className="font-mono font-bold">不俍人&冰与火之歌: </code>
            <span style={{fontSize: "12px", color: "#999"}} title={"注：(符文之语默认9级 符文默认8级 会心暂时按50:1折算暴击率)"}> &nbsp;古魂经典服角色搭配模拟器V2&nbsp; </span>
          </p>

          <div className="bottom-0 left-0 flex place-items-center h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
              <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
                  By:{"未来·诗寇蒂"}
                  <Image
                    src="/pr.svg"
                    alt="不俍人出品"
                    className="dark:invert"
                    width={100}
                    height={24}
                    priority
                  />
                  <button id="self" onClick={() => {
                      setSelf(!self);
                  }
                  }>我的</button>
                  {/*清空缓存并重新加载网页*/}
                  <button id="clearStorageBtn" onClick={() => {
                      self? localStorage.removeItem('selflist'):localStorage.removeItem('userSelections');
                      // localStorage.clear();
                      window.location.reload();
                    }
                  }>重置</button>

              </div>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_8fr_2fr] gap-6 bottom-0 left-0 sm:h-58 h-68 w-200 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Tt />
          {
            !self?<Cal />:<Self />
          }
          <Bd />
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
