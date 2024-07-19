"use client";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserSelectionContext } from "@/contexts/UserSelectionContext";
import { RoleContext } from "@/contexts/RoleContext";
import {fetchFwCards, fetchJbCards} from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Fw() {
  const [cardQuantities, setCardQuantities] = useState({});
  const [list, setList] = useState([]);

  const { userSelections, selectItem, deleteItem, deleteOneItem } = useContext(UserSelectionContext);
  const { updateRole } = useContext(RoleContext);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // 只在组件挂载时运行一次
    (async () => {
      const list = await fetchFwCards();
      if (isMounted) {
        setList(list);
      }
    })();

    // 清理函数，确保在组件卸载前取消异步操作
    return () => {
      isMounted = false;
    };
  }, []); // 无依赖数组意味着此 effect 只在挂载时运行一次

  useEffect(() => {
    setLock(true);
    // 恢复状态
    if (userSelections.fwSelection.length > 0) {
      userSelections.fwSelection.map(card => {
        if (userSelections.fwSelection.length > 0) {
          const newQuantities = userSelections.fwSelection.reduce((acc, card) => {
            acc[card.id] = (acc[card.id] || 0) + 1; // 如果不存在，则初始化为0，然后增加1
            return acc;
          }, {});

          setCardQuantities(prevState => ({ ...prevState, ...newQuantities }));
        }
      })
    }
    setLock(false);
  }, [userSelections.fwSelection])

  const handleCardClick = async (event, category, card) => {
    const id = card.id;
    if (lock) return;
    setLock(true);
    try {
      const cardRect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - cardRect.left;
      const cardWidth = cardRect.width;
      const threshold = cardWidth / 2; // 设定阈值，一半宽度

      let newQuantity = cardQuantities[card.id] || 0;
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

      setCardQuantities(prevState => ({ ...prevState, [card.id]: newQuantity }));
      if (operation > 0) {
        // 检查数量限制
        if (userSelections.fwSelection.length + userSelections.fwzySelection.reduce((acc, cur) => acc.num + cur.num, 0) >= 40 ||
            userSelections.fwSelection.filter(item => item.id === card.id).length >= 10) {
          return;
        }
        selectItem(category, card);
        updateRole(card.sx, '符文', 'add');
      } else {

        if (userSelections.fwSelection.reduce((acc, cur) => acc.id === card.id ? 1 : 0 + cur.id === card.id ? 1 : 0, 0) === 0) {
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
  const filteredFwCards = list.filter(card => card.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-6 p-4">
          {filteredFwCards.map(card => (
              <Card
                  key={card.id}
                  className={`relative overflow-hidden rounded-lg shadow-lg ${cardQuantities[card.id] > 0 ? "border-2 border-primary ring-4 ring-primary-foreground" : ""}`}
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
