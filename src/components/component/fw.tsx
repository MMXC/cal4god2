"use client";
import {useContext, useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {UserSelectionsContext} from "@/contexts/UserSelectionsContext";
import {RoleContext} from "@/contexts/RoleContext";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Fw() {
    const [cardQuantities, setCardQuantities] = useState<any>({});

    const {userSelections, selectItem, deleteItem, deleteOneItem} = useContext(UserSelectionsContext);
    const {updateRole, lists} = useContext(RoleContext);
    const [lock, setLock] = useState(false);
    const list = lists.fwList;
    useEffect(() => {
        setLock(true);
        // 恢复状态
        if (userSelections.fwSelection.length > 0) {
            const cardQuantities = userSelections.fwSelection.reduce((acc, card) => {
                acc[card.id] = (acc[card.id] || 0) + 1;
                return acc;
            }, {});
            // Now cardQuantities contains the counts of each unique card.id
            // To update state with these quantities:
            setCardQuantities(cardQuantities);
        }
        setLock(false);
    }, [userSelections.fwSelection])

    const handleCardClick = async (event: any, category: any, card: any) => {
        if (lock) return;
        setLock(true);
        try {
            const cardRect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - cardRect.left;
            const cardWidth = cardRect.width;
            const threshold = cardWidth / 2; // 设定阈值，一半宽度

            let newQuantity = (card.id in cardQuantities) ? cardQuantities[card.id] : 0;
            let operation = 1;
            if (clickX < threshold) {
                // 左侧点击，增加数量
                operation = 1
            } else {
                // 右侧点击，减少数量
                operation = -1
            }
            newQuantity += operation;
            newQuantity = Math.max(newQuantity, 0);

            if (operation > 0) {
                // 检查数量限制
                if (userSelections.fwSelection.length + userSelections.fwzySelection.reduce((acc: any, cur: any) => acc.num + cur.num, 0) + 1 > 40 ||
                    userSelections.fwSelection.filter((item: any) => item.id === card.id).length + 1 > 10 ||
                    userSelections.fwSelection.length + 1 > 10) {
                    alert('已选总符文超出40或单类型符文超出10，请先移除后再重新选择！');
                    return;
                } else {
                    setCardQuantities((prevState: any) => ({...prevState, [card.id]: newQuantity}));
                    selectItem(category, card);
                    updateRole(card.sx, '符文', 'add');
                }
            } else {
                if (userSelections.fwSelection.reduce((acc: any, cur: any) => acc.id === card.id ? 1 : 0 + cur.id === card.id ? 1 : 0, 0) === 0) {
                    return
                } else {
                    deleteOneItem(category, card.id);
                    updateRole(card.sx, '符文', 'remove');
                }
            }
        } finally {
            setLock(false);
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
                {filteredFwCards.map((card:any) => (
                    <Card
                        key={card.id}
                        className={`relative overflow-hidden rounded-lg shadow-lg ${cardQuantities[card.id] > 0 ? "border-2 golden-glow ring-4 ring-primary-foreground" : ""}`}
                        onClick={event => handleCardClick(event, 'fwSelection', card)}
                    >
                        <div className="relative">
                            <img
                                src={card.pic}
                                alt={card.name}
                                width={600}
                                height={400}
                                className="object-cover w-full h-48"
                            />
                        </div>
                        <CardContent className="p-4 bg-background">
                            <h3 className="text-xl font-bold">{card.name}</h3>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-sm">选中数量: {cardQuantities[card.id] || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
