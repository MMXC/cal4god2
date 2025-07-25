/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/Y9JygGNgbjn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

 import { Prata } from 'next/font/google'

 prata({
  subsets: ['latin'],
  display: 'swap',
})

 To read more about using these font, please visit the Next.js documentation:
 - App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 - Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
 **/

import {useContext, useEffect, useState} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {RoleContext} from "@/contexts/RoleContext";
import {UserSelectionsContext} from "@/contexts/UserSelectionsContext";

export default function Fn() {
    const [lock, setLock] = useState(false);
    const {userSelections, selectItem, deleteItem, deleteOneItem} = useContext(UserSelectionsContext);
    const {updateRole,lists, calculateDamageIncrease} = useContext(RoleContext);
    const list = lists.fnList;

    const handleCardClick = async (event: any, category: any, card: any) => {
        const cardRect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - cardRect.left;
        const cardWidth = cardRect.width;
        const threshold = cardWidth / 2; // 设定阈值，一半宽度

        let operation = 1;
        if (clickX < threshold) {
            // 左侧点击，增加数量
            operation = 1
        } else {
            // 右侧点击，减少数量
            operation = -1
        }

        if (operation > 0) {
            // 检查数量限制
            if (userSelections.fnSelection.filter((item: any) => item.id === card.id).length + 1 > 12 ) {
                alert('已选赋能超出12，请先移除后再重新选择！');
                return;
            }else {
                selectItem(category, card);
            }
        } else {
            if (userSelections.fnSelection.reduce((acc: any, cur: any) => acc + (cur.id === card.id ? 1 : 0), 0) === 0) {
                return
            } else {
                deleteOneItem(category, card.id);
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState("")
    const filteredFnCards = list.filter((card: any) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="bg-background p-4 mb-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                    <Input
                        type="search"
                        placeholder="输入名称查找"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                    <Button variant="outline">查找</Button>
                </div>
            </div>
            <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 p-4">
                {filteredFnCards.map((card: any) => {
                    const increase = calculateDamageIncrease('fnSelection', card, userSelections);
                    const isSelected = userSelections.fnSelection.some((selected: any) => selected.id === card.id);

                    return (
                        <Card
                            key={card.id}
                            className={`relative overflow-hidden rounded-lg shadow-lg ${
                                isSelected
                                    ? "border-2 golden-glow ring-4 ring-primary-foreground"
                                    : "border-2 border-gold"
                            }`}
                            onClick={(event) => handleCardClick(event, 'fnSelection', card)}
                        >
                            <div className="relative">
                                <img
                                    src={card.pic}
                                    alt={card.name}
                                    width={600}
                                    height={400}
                                    className={`object-cover w-full h-48 ${isSelected ? 'opacity-50' : ''}`}
                                />
                                {(
                                    <div className={`absolute bottom-0 right-0 bg-black bg-opacity-70 px-1 py-0.5 text-xs rounded font-bold ${increase > 0 ? 'text-[#5de011]' : 'text-[#b73030]'}`}>
                                        {increase > 0 ? `+${increase}%` : `${increase}%`}
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4 bg-background">
                                <h3 className="text-xl font-bold">{card.name}</h3>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-sm">
                                        选中数量: {userSelections.fnSelection.reduce((acc, cur) => acc + (cur.id === card.id ? 1 : 0), 0)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
