"use client";
import {useContext, useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {UserSelectionsContext} from "@/contexts/UserSelectionsContext";
import {RoleContext} from "@/contexts/RoleContext";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Fw() {
    const {userSelections, selectItem, deleteItem, deleteOneItem} = useContext(UserSelectionsContext);
    const {updateRole, lists, calculateDamageIncrease} = useContext(RoleContext);
    const list = lists.fwList;

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
            const types:string[] = userSelections.fwSelection.filter((item: any) => ['jm', 'ty', 'j'].includes(item.type)).map((item: any) => item.type);
            if (userSelections.fwSelection.length + userSelections.fwzySelection.reduce((acc: any, cur: any) => acc + cur.num, 0) + 1 > 40 ||
                userSelections.fwSelection.filter((item: any) => item.id === card.id).length + 1 > 10 ) {
                alert('已选总符文超出40或单类型符文超出10，请先移除后再重新选择！');
                return;
            }else if(['jm', 'ty', 'j'].includes(card.type)&&types&&types.length>0&&!types.includes(card.type)){
                alert('增伤符文请选择同种类（太阳/寂灭/剑）！');
                return;
            }else {
                selectItem(category, card);
            }
        } else {
            if (userSelections.fwSelection.reduce((acc: any, cur: any) => acc + (cur.id === card.id ? 1 : 0), 0) === 0) {
                return
            } else {
                deleteOneItem(category, card.id);
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState("");
    const filteredFwCards = list.filter((card: any) => card.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            {/* Search bar */}
            <div className="bg-background p-4 mb-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                    <Input
                        type="search"
                        placeholder="输入名称查找"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                    <Button variant="outline">查找</Button>
                </div>
            </div>

            {/* Cards grid */}
            <div
                className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-6 p-4">
                {filteredFwCards.map((card:any) => {
                    const increase = calculateDamageIncrease('fwSelection', card, userSelections);
                    const isSelected = userSelections.fwSelection.some((selected: any) => selected.id === card.id);

                    return (
                        <Card
                            key={card.id}
                            className={
                                `relative overflow-hidden rounded-lg shadow-lg 
                                ${userSelections.fwSelection.reduce((acc, cur) => acc + (cur.id === card.id ? 1 : 0), 0) > 0 ? 
                                    "border-2 golden-glow ring-4 ring-primary-foreground" : 
                                    ""}`
                            }
                            onClick={event => handleCardClick(event, 'fwSelection', card)}
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
                                        选中数量: {userSelections.fwSelection.reduce((acc, cur) => acc + (cur.id === card.id ? 1 : 0), 0)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
