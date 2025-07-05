"use client";
import { useEffect, useState, useRef } from "react";
import { fetchGroupInfo, fetchHistoryGroups } from "@/services/api";
import html2canvas from "html2canvas";

// 古风SVG装饰
const BorderSVG = ({ className = "" }) => (
  <svg className={className} width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 30 Q24 2 46 30" stroke="#C2B28F" strokeWidth="2" fill="none"/>
    <circle cx="24" cy="8" r="2" fill="#C2B28F"/>
  </svg>
);

// 展开/收起三角SVG
const TriangleIcon = ({ direction = 'down', ...props }) => (
  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" {...props}>
    {direction === 'down' ? (
      <polygon points="24,18 4,4 44,4" fill="#bfa76a" />
    ) : (
      <polygon points="24,2 4,16 44,16" fill="#bfa76a" />
    )}
  </svg>
);

// 名称竖排渲染函数
function verticalName(name: string) {
  return name.split('').map((char, idx) => <span key={idx}>{char}</span>);
}

// 奖励内容选项
const BADGE_OPTIONS = [
  { value: '团长', label: '团长' },
  { value: '副团', label: '副团' },
  { value: '钥匙', label: '钥匙' }
];

// 随机颜色生成函数
function getRandomColor(seed: number) {
  // 固定种子，保证每组颜色稳定
  const colors = [
    '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124', '#45B8AC', '#EFC050', '#5B5EA6'
  ];
  return colors[seed % colors.length];
}

// 爆炸标签渐变色组
const explosionGradients = [
  ['#ff512f', '#f9d423'],
  ['#f7971e', '#ffd200'],
  ['#f953c6', '#b91d73'],
  ['#43cea2', '#185a9d'],
  ['#fa709a', '#fee140'],
  ['#30cfd0', '#330867'],
  ['#a8ff78', '#78ffd6'],
  ['#f857a6', '#ff5858'],
  ['#ff9966', '#ff5e62'],
  ['#00c3ff', '#ffff1c'],
  ['#f54ea2', '#ff7676'],
  ['#17ead9', '#6078ea'],
];
function getExplosionGradient(idx: number) {
  const g = explosionGradients[idx % explosionGradients.length];
  return `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
}

export default function Group() {
  const [group, setGroup] = useState<any>(null);
  const [visibleGroupCount, setVisibleGroupCount] = useState(6); // 初始展示6组
  const [expanded, setExpanded] = useState(false);
  // badge数据结构: { groupIndex: number, badge: string, leaderId: number }
  const [badges, setBadges] = useState<{ groupIndex: number, badge: string, leaderId: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('group-badges') || '[]');
    } catch {
      return [];
    }
  });
  // 历史分组
  const [historyGroups, setHistoryGroups] = useState<any[]>([]);
  // 临时分组
  const [savedGroups, setSavedGroups] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-groups') || '[]');
    } catch {
      return [];
    }
  });
  // 当前分组数据（可被历史/临时分组覆盖）
  const [currentGroup, setCurrentGroup] = useState<any>(null);

  // 弹窗状态
  const [badgeModal, setBadgeModal] = useState<{ open: boolean, groupIdx: number | null, leaderId: number | null }>({ open: false, groupIdx: null, leaderId: null });
  const [badgeValue, setBadgeValue] = useState('钥匙');
  const modalRef = useRef<HTMLDivElement>(null);

  // 记录所有成员池（group.json list）
  const [allMembers, setAllMembers] = useState<any[]>([]);

  // 在Group组件内，添加分数编辑状态
  const [scoreEditIdx, setScoreEditIdx] = useState<number|null>(null);
  const scoreInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (scoreEditIdx !== null && scoreInputRef.current) {
      scoreInputRef.current.focus();
    }
  }, [scoreEditIdx]);

  useEffect(() => {
    const saved = localStorage.getItem('saved-groups');
    fetchGroupInfo().then(data => {
      console.log('data:', data);
      if (data && Array.isArray(data)) {
        setAllMembers(data);
      }
      fetchHistoryGroups().then(his => {
        setHistoryGroups(his);
        if (saved) {
          const arr = JSON.parse(saved);
          if (arr.length > 0) {
            setGroup(arr[0]);
            setCurrentGroup(arr[0]);
            return;
          }
        }
        if (his && his.length > 0) {
          setGroup(his[0]);
          setCurrentGroup(his[0]);
        } else if (data && Array.isArray(data)) {
          setGroup({ id: 'init', range: '', desc: '', groups: [ { members: data, badge: null } ] });
          setCurrentGroup({ id: 'init', range: '', desc: '', groups: [ { members: data, badge: null } ] });
        }
      });
    });
  }, []);
  // 持久化badge
  useEffect(() => {
    localStorage.setItem('group-badges', JSON.stringify(badges));
  }, [badges]);
  // 持久化临时分组
  useEffect(() => {
    localStorage.setItem('saved-groups', JSON.stringify(savedGroups));
  }, [savedGroups]);


  // 记录未分组成员
  const getUnGroupedMembers = () => {
    console.log('allMembers:', allMembers);
    console.log('currentGroup:', currentGroup);
    if (!allMembers.length || !currentGroup.groups) return [];
    const groupedIds = currentGroup.groups.flatMap((g: any) => Array.isArray(g.members) ? g.members.map((m: any) => m.id) : []);
    return allMembers.filter(m => !groupedIds.includes(m.id));
  };

  if (!currentGroup) {
    return (
      <div className="myth-bg-simulator min-h-screen flex flex-col items-center py-10">
        <div className="text-yellow-900 text-xl mt-32">加载中...</div>
      </div>
    );
  }

  // 所有成员统一展示
  const normalMembers = currentGroup.groups?.flatMap((g: any) => g.members) || [];

  // 组分组
  const groupSize = 3;
  const maxGroups = 6;
  let groups: any[][] = [];
  for (let i = 0; i < normalMembers.length; i += groupSize) {
    groups.push(normalMembers.slice(i, i + groupSize));
  }
  // 补足空组，确保每组为{members: []}
  while (groups.length < maxGroups) {
    groups.push([]);
  }
  // 保证currentGroup.groups结构始终为6组且每组有members数组
  if (currentGroup.groups && currentGroup.groups.length < maxGroups) {
    currentGroup.groups = [
      ...currentGroup.groups.map((g: any) => ({ ...g, members: Array.isArray(g.members) ? g.members : [] })),
      ...Array.from({ length: maxGroups - currentGroup.groups.length }, () => ({ members: [] }))
    ];
  }
  // 初始化/修正分组结构，保证id为1~6且顺序固定
  if (currentGroup.groups) {
    const fixedIds = [1,2,3,4,5,6];
    // 以id为主，补全缺失分组
    let groupMap = new Map((currentGroup.groups||[]).map((g:any)=>[g.id,g]));
    currentGroup.groups = fixedIds.map(id => groupMap.get(id) || {id, members: []});
  }
  // 渲染分组卡片时严格按id顺序
  const visibleGroups = currentGroup.groups;

  // 处理分组排序：有badge的分组靠前
  const badgeMap = new Map(badges.map(b => [b.groupIndex, b]));
  const sortedGroups = [
    ...groups.map((g, idx) => ({ g, idx, badge: badgeMap.get(idx) })).filter(x => x.badge),
    ...groups.map((g, idx) => ({ g, idx, badge: badgeMap.get(idx) })).filter(x => !x.badge)
  ];

  // 每行3组
  const rowSize = 3;
  type GroupObj = { g: any[]; idx: number; badge: { groupIndex: number; badge: string; leaderId: number } | undefined };
  let visibleRows: GroupObj[][] = [];
  if (!expanded) {
    // 收起时：只展示前6组，分两行
    const showGroups = sortedGroups.slice(0, visibleGroupCount);
    for (let i = 0; i < showGroups.length; i += rowSize) {
      visibleRows.push(showGroups.slice(i, i + rowSize));
    }
  } else {
    // 展开时：全部分组，每行3组
    for (let i = 0; i < sortedGroups.length; i += rowSize) {
      visibleRows.push(sortedGroups.slice(i, i + rowSize));
    }
  }

  // 导出图片功能
  const handleExportImage = () => {
    if (currentGroup) {
      // 只输出分组主内容，避免循环引用
      console.log('导出分组完整JSON：', JSON.stringify(currentGroup, null, 2));
    }
    const el = document.getElementById("group-export-area");
    if (el) {
      html2canvas(el, {useCORS: true, backgroundColor: null}).then(canvas => {
        const link = document.createElement("a");
        link.download = "group.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  function handleBadgeConfirm() {
    if (badgeModal.groupIdx !== null && badgeModal.leaderId !== null) {
      setCurrentGroup((prev: any) => {
        const newGroup = { ...prev };
        newGroup.groups = newGroup.groups.map((gg: any, idx: number) => {
          if (idx === badgeModal.groupIdx) {
            return {
              ...gg,
              badge: {
                label: badgeValue,
                received: gg.badge?.received || false,
                memberId: badgeModal.leaderId
              }
            };
          }
          return gg;
        });
        // 同步到localStorage（如为临时分组）
        if (newGroup.id) {
          const saved = JSON.parse(localStorage.getItem('saved-groups') || '[]');
          const idx = saved.findIndex((x: any) => x.id === newGroup.id);
          if (idx !== -1) {
            saved[idx] = newGroup;
            localStorage.setItem('saved-groups', JSON.stringify(saved));
          }
        }
        return newGroup;
      });
    }
    setBadgeModal({ open: false, groupIdx: null, leaderId: null });
  }

  // 三栏布局
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-2 myth-bg-simulator">
      <div className="w-full max-w-8xl grid grid-cols-[1fr_10fr_1fr] gap-6 items-start">
        {/* 左侧：历史分组 */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-4 flex flex-col gap-4 min-w-[220px] max-w-xs h-[600px] overflow-y-auto">
          <div className="font-bold text-lg mb-2 text-yellow-900">历史分组</div>
          {historyGroups.length === 0 && <div className="text-gray-400">暂无历史分组</div>}
          {historyGroups.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 cursor-pointer mb-2 select-none"
              title="双击应用到中央分组"
              onDoubleClick={() => setCurrentGroup(item)}
            >
              <div className="font-semibold text-yellow-900 text-base">
                {item.range || `${item.startDate || ''} - ${item.endDate || ''}`}
              </div>
              <div className="text-xs text-yellow-700 mt-1 truncate">{item.desc || '组队情况'}</div>
              {/* 展示分组成员和badge */}
              {item.groups && item.groups.map((g: any, gidx: number) => (
                <div key={gidx} className="mt-2 flex flex-row items-center gap-2">
                  {g.members && g.members.map((m: any, midx: number) => (
                    <img key={midx} src={m.avatar} alt={m.nickname} className="w-6 h-6 rounded-full border border-yellow-300 object-cover" title={m.nickname} />
                  ))}
                  {g.badge && g.badge.memberId && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold shadow border border-yellow-500 text-xs" style={{fontFamily: 'STKaiti, KaiTi, 楷体, DFKai-SB, 华文行楷, cursive'}}>
                      {(() => {
                        const member = g.members.find((m: any) => m.id === g.badge.memberId);
                        return member ? `${member.nickname}｜${g.badge.label}` : g.badge.label;
                      })()}
                      {g.badge.received ? <span className="ml-1 text-green-600 font-bold">√</span> : null}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* 中央：当前分组（原花名册编辑区） */}
        <div>
          <div id="group-export-area">
            <div className="w-full max-w-10xl flex flex-col items-center mb-8">
              <div className="relative w-full flex justify-center items-center">
                <BorderSVG className="absolute left-0 top-1" />
                <span
                  className="text-4xl font-bold tracking-widest text-yellow-900 px-10 py-3 bg-white/90 rounded-t-2xl border-b-4 border-yellow-700 shadow-lg mx-12 select-none flex items-center gap-4 cursor-pointer"
                  onClick={handleExportImage}
                >
                  {currentGroup.range || `冰与火之歌（${currentGroup.groups?.flatMap((g: any) => g.members||[]).length||0}人）`}
                </span>
                <BorderSVG className="absolute right-0 top-1 rotate-180" />
              </div>
            </div>
            {/* 分组成员与badge展示 - 恢复为每行3组，每组3人，组卡片大圆角阴影，组内成员为大卡牌风格 */}
            <div className="w-full flex flex-col items-center">
              <div className="grid grid-cols-3 gap-x-12 gap-y-10">
                {visibleGroups.map((g: any, gidx: number) => (
                  <div
                    key={gidx}
                    className="bg-gradient-to-br from-[#e7e6fa]/80 to-[#c7e0f7]/80 rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center min-w-[320px] max-w-[400px] border border-[#e5dec7] relative"
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={e => {
                      const memberId = e.dataTransfer.getData('memberId');
                      const fromGroupIdx = e.dataTransfer.getData('fromGroupIdx');
                      const fromMemberIdx = e.dataTransfer.getData('fromMemberIdx');
                      if (!memberId) return;
                      if (g.length >= groupSize) return;
                      const member = allMembers.find(m => String(m.id) === memberId);
                      if (!member) return;
                      setCurrentGroup((prev: any) => {
                        // 以id为主，查找目标分组
                        const targetId = visibleGroups[gidx].id;
                        let newGroups = prev.groups.map((group: any, idx: number) => {
                          // 先从原分组移除
                          if (fromGroupIdx && String(idx) === fromGroupIdx) {
                            return { ...group, members: (group.members || []).filter((m: any, i: number) => String(m.id) !== memberId || i === Number(fromMemberIdx)) };
                          }
                          return group;
                        });
                        // 再添加到目标分组（避免重复）
                        const targetIdx = newGroups.findIndex((g:any)=>g.id===targetId);
                        if (!newGroups[targetIdx].members.some((m: any) => String(m.id) === memberId)) {
                          newGroups[targetIdx] = { ...newGroups[targetIdx], members: [...(newGroups[targetIdx].members || []), member] };
                        }
                        // 保证顺序
                        newGroups = [1,2,3,4,5,6].map(id => newGroups.find((g:any)=>g.id===id) || {id, members: []});
                        return { ...prev, groups: newGroups };
                      });
                      (window as any).__dropped = true;
                    }}
                  >
                    {/* 分组标签铭牌，所有分组都显示，默认钥匙位置，可点击切换领取状态 */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-5 px-5 py-1 bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold shadow border border-yellow-500 text-base select-none z-20 rounded-b-2xl rounded-t-none flex items-center justify-center cursor-pointer"
                      style={{
                        fontFamily: 'STKaiti, KaiTi, 楷体, DFKai-SB, 华文行楷, cursive',
                        letterSpacing: 2,
                        boxShadow: '0 2px 12px #ffe06699',
                        minWidth: 80,
                        maxWidth: 180,
                        top: '-28px',
                        userSelect: 'none',
                      }}
                      title="点击切换是否已领取"
                      onClick={() => {
                        setCurrentGroup((prev: any) => {
                          const newGroup = { ...prev };
                          newGroup.groups = newGroup.groups.map((gg: any, idx: number) => {
                            if (idx === gidx) {
                              const badge = gg.badge || { label: '钥匙', received: false, memberId: null };
                              return {
                                ...gg,
                                badge: {
                                  ...badge,
                                  received: !badge.received
                                }
                              };
                            }
                            return gg;
                          });
                          // 同步到localStorage（如为临时分组）
                          if (newGroup.id) {
                            const saved = JSON.parse(localStorage.getItem('saved-groups') || '[]');
                            const idx = saved.findIndex((x: any) => x.id === newGroup.id);
                            if (idx !== -1) {
                              saved[idx] = newGroup;
                              localStorage.setItem('saved-groups', JSON.stringify(saved));
                            }
                          }
                          return newGroup;
                        });
                      }}
                    >
                      {currentGroup.groups[gidx]?.badge?.label || '钥匙'}
                      {currentGroup.groups[gidx]?.badge?.received && (
                        <span className="ml-2 text-green-600 font-bold">√</span>
                      )}
                    </div>
                    <div className="flex flex-row justify-center items-end gap-6 mt-4 min-h-[160px]">
                      {g.members.map((m: any, midx: number) => {
                        // 修正高亮逻辑：只要该分组badge存在且memberId等于当前成员id
                        const isBadgeMember = g.badge && g.badge.memberId === m.id;
                        return (
                          <div key={midx} className={`flex flex-col items-center relative group`} style={{ minWidth: 100, maxWidth: 120 }}>
                            <div
                              className={`w-[100px] h-[160px] rounded-[32px] border-4 flex flex-col items-center justify-end overflow-hidden relative cursor-pointer group-hover:ring-2 group-hover:ring-yellow-300 ${isBadgeMember ? 'golden-glow' : 'border-[3px] border-[#E0E0E0] shadow-[0_0_12px_2px_#C0C0C0AA,0_2px_8px_0_#F8F8FFAA,inset_0_2px_10px_#F0F0F0] group-hover:shadow-[0_0_24px_8px_#F8F8FF,0_0_12px_2px_#C0C0C0AA,0_2px_8px_0_#F8F8FFAA,inset_0_2px_10px_#F0F0F0]'}`}
                              style={{ background: 'linear-gradient(145deg, #fffbe6 60%, #f7f7fa 100%)' }}
                              title={isBadgeMember ? '标签成员不可拖动' : '拖动成员到未分组池或其它分组'}
                              onClick={() => setBadgeModal({ open: true, groupIdx: gidx, leaderId: m.id })}
                              draggable={!isBadgeMember}
                              onDragStart={e => {
                                if (isBadgeMember) return;
                                e.dataTransfer.setData('memberId', String(m.id));
                                e.dataTransfer.setData('fromGroupIdx', String(gidx));
                                e.dataTransfer.setData('fromMemberIdx', String(midx));
                                (window as any).__draggingMember = { memberId: m.id, fromGroupIdx: gidx, fromMemberIdx: midx };
                              }}
                              onDragOver={e => { e.preventDefault(); }}
                              onDrop={e => {
                                // 只处理同组内交换
                                const dragging = (window as any).__draggingMember;
                                if (!dragging || dragging.fromGroupIdx !== gidx) return;
                                const toIdx = midx;
                                if (dragging.fromMemberIdx === toIdx) return;
                                setCurrentGroup((prev: any) => {
                                  const group = prev.groups[gidx];
                                  const members = [...group.members];
                                  const [dragged] = members.splice(dragging.fromMemberIdx, 1);
                                  members.splice(toIdx, 0, dragged);
                                  const newGroups = prev.groups.map((g: any, idx: number) => idx === gidx ? { ...g, members } : g);
                                  return { ...prev, groups: newGroups };
                                });
                              }}
                              onDragEnd={e => {
                                setTimeout(() => {
                                  if ((window as any).__dropped) {
                                    (window as any).__dropped = false;
                                    return;
                                  }
                                  const dragging = (window as any).__draggingMember;
                                  if (dragging && dragging.fromGroupIdx === gidx && dragging.fromMemberIdx === midx) {
                                    setCurrentGroup((prev: any) => {
                                      const group = prev.groups[gidx];
                                      const members = [...group.members];
                                      members.splice(midx, 1);
                                      const newGroups = prev.groups.map((g: any, idx: number) => idx === gidx ? { ...g, members } : g);
                                      return { ...prev, groups: newGroups };
                                    });
                                  }
                                  (window as any).__draggingMember = null;
                                }, 50);
                              }}
                            >
                              <img src={m.avatar} alt={m.nickname} className="w-full h-full object-cover rounded-[28px]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* 小队积分展示/编辑区（无"小队积分"字样） */}
                    <div className="w-full flex justify-center mt-4">
                      {scoreEditIdx === gidx ? (
                        <input
                          ref={scoreInputRef}
                          type="number"
                          className="text-3xl font-extrabold text-center outline-none bg-transparent px-2"
                          style={{ color: getRandomColor(gidx), border: 'none', boxShadow: 'none', width: 80 }}
                          value={currentGroup.groups[gidx]?.score || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setCurrentGroup((prev: any) => {
                              const newGroups = prev.groups.map((gg: any, idx: number) =>
                                idx === gidx ? { ...gg, score: val } : gg
                              );
                              return { ...prev, groups: newGroups };
                            });
                          }}
                          onBlur={() => setScoreEditIdx(null)}
                          onKeyDown={e => { if (e.key === 'Enter') setScoreEditIdx(null); }}
                          placeholder="请输入积分"
                        />
                      ) : (
                        <span
                          className="text-3xl font-extrabold px-2 cursor-pointer select-none"
                          style={{ color: getRandomColor(gidx), letterSpacing: 2, textShadow: '0 2px 8px #fffbe6, 0 1px 2px #888' }}
                          onClick={() => setScoreEditIdx(gidx)}
                          tabIndex={0}
                        >
                          {currentGroup.groups[gidx]?.score || '—'}
                        </span>
                      )}
                    </div>
                    {/* 爆炸标签（SVG气泡+更夸张锯齿+更大尺寸+渐变+随机色+绝对定位） */}
                    <div
                      className="absolute -right-8 -top-6 z-30 select-none"
                      style={{ width: 90, height: 62 }}
                    >
                      <svg width="90" height="62" viewBox="0 0 90 62" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <defs>
                          <linearGradient id={`explosion-gradient-${gidx}`} x1="0" y1="0" x2="90" y2="62" gradientUnits="userSpaceOnUse">
                            <stop stopColor={explosionGradients[gidx % explosionGradients.length][0]} />
                            <stop offset="1" stopColor={explosionGradients[gidx % explosionGradients.length][1]} />
                          </linearGradient>
                        </defs>
                        <path d="M12 28 Q2 8 24 14 Q30 0 45 12 Q60 0 66 14 Q88 8 78 28 Q90 40 70 44 Q78 60 54 54 Q45 62 36 54 Q12 60 20 44 Q0 40 12 28 Z" fill={`url(#explosion-gradient-${gidx})`} stroke="#fff" strokeWidth="3.5" />
                      </svg>
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-white drop-shadow-lg"
                        style={{
                          letterSpacing: 2,
                          textShadow: '0 2px 8px #fffbe6, 0 1px 2px #888',
                          fontSize: 18,
                          userSelect: 'none',
                          pointerEvents: 'none',
                        }}
                      >
                        {Math.floor((Number(currentGroup.groups[gidx]?.score || 0) / 100000) + 1)}命
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* 查看更多/收起按钮 */}
              <div className="w-full flex justify-center mt-8">
                <button
                  className="flex items-center justify-center gap-2 px-8 py-2 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold shadow border border-yellow-500 text-lg select-none transition hover:scale-105"
                  style={{ minWidth: 320, maxWidth: 400 }}
                  onClick={() => setExpanded(e => !e)}
                >
                  {expanded ? '收起成员' : '查看更多成员'}
                  <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}><TriangleIcon direction={expanded ? 'up' : 'down'} /></span>
                </button>
              </div>
              {/* 展示未分组成员池（如有） */}
              {expanded && getUnGroupedMembers().length >= 0 && (
                <div className="mt-12 w-full flex flex-col items-center">
                  <div className="text-base text-blue-700 mb-2">未分组成员池（{getUnGroupedMembers().length}人）</div>
                  <div
                    className="w-full max-w-5xl bg-white/80 rounded-2xl shadow border border-blue-200 p-6 overflow-x-auto overflow-y-auto"
                    style={{ maxHeight: 340 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      const memberId = e.dataTransfer.getData('memberId');
                      const fromGroupIdx = e.dataTransfer.getData('fromGroupIdx');
                      const fromMemberIdx = e.dataTransfer.getData('fromMemberIdx');
                      if (!memberId || fromGroupIdx === '') return;
                      setCurrentGroup((prev: any) => {
                        const newGroups = prev.groups.map((group: any, idx: number) => {
                          if (String(idx) === fromGroupIdx) {
                            const members = (group.members || []).filter((m: any, i: number) => String(m.id) !== memberId || i === Number(fromMemberIdx));
                            return { ...group, members };
                          }
                          return group;
                        });
                        return { ...prev, groups: newGroups };
                      });
                      (window as any).__dropped = true;
                    }}
                  >
                    <div className="grid grid-cols-6 gap-6">
                      {getUnGroupedMembers().map((m: any, midx: number) => (
                        <div key={m.id} className="flex flex-col items-center">
                          <div
                            className={`w-[80px] h-[120px] rounded-[24px] border-2 flex flex-col items-center justify-end overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-blue-300 border-[3px] border-[#E0E0E0] shadow-[0_0_10px_2px_#C0C0C0AA,0_2px_8px_0_#F8F8FFAA,inset_0_2px_8px_#F0F0F0] hover:shadow-[0_0_20px_6px_#F8F8FF,0_0_10px_2px_#C0C0C0AA,0_2px_8px_0_#F8F8FFAA,inset_0_2px_8px_#F0F0F0'}`}
                            style={{ background: 'linear-gradient(145deg, #fffbe6 60%, #f7f7fa 100%)' }}
                            title="拖动成员到上方分组"
                            draggable
                            onDragStart={e => {
                              e.dataTransfer.setData('memberId', String(m.id));
                            }}
                          >
                            <img src={m.avatar} alt={m.nickname} className="w-full h-full object-cover rounded-[20px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 右侧：临时分组 */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-4 flex flex-col gap-4 min-w-[220px] max-w-xs h-[600px] overflow-y-auto">
          <div className="font-bold text-lg mb-2 text-yellow-900">临时分组</div>
          {savedGroups.length === 0 && <div className="text-gray-400">暂无临时分组</div>}
          {savedGroups.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 rounded-lg border border-yellow-200 bg-blue-50 hover:bg-blue-100 cursor-pointer mb-2 select-none"
              title="点击应用到中央分组"
              onClick={() => setCurrentGroup(item)}
            >
              <div className="font-semibold text-blue-900 text-base">
                {item.range || `${item.startDate || ''} - ${item.endDate || ''}`}
              </div>
              <div className="text-xs text-blue-700 mt-1 truncate">{item.desc || '组队情况'}</div>
            </div>
          ))}
          {/* 手动保存当前分组按钮 */}
          <button
            className="mt-4 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded shadow hover:bg-yellow-300"
            onClick={() => {
              const id = Date.now();
              setSavedGroups(prev => [...prev, { ...currentGroup, id }]);
            }}
          >保存当前分组</button>
        </div>
      </div>
      {/* badge选择弹窗 */}
      {badgeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={e => { if (e.target === modalRef.current) setBadgeModal({ open: false, groupIdx: null, leaderId: null }); }}>
          <div ref={modalRef} className="bg-white rounded-2xl shadow-xl p-8 min-w-[260px] flex flex-col items-center" style={{fontFamily: 'STKaiti, KaiTi, 楷体, DFKai-SB, 华文行楷, cursive'}}>
            <div className="text-lg font-bold mb-4 text-yellow-900">选择奖励标签</div>
            <select
              className="mb-4 px-4 py-2 border rounded text-lg"
              value={badgeValue}
              onChange={e => setBadgeValue(e.target.value)}
            >
              {BADGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 rounded bg-yellow-400 text-yellow-900 font-bold shadow hover:bg-yellow-300"
                onClick={handleBadgeConfirm}
              >确定</button>
              <button
                className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300"
                onClick={() => {
                  if (badgeModal.groupIdx !== null) {
                    setCurrentGroup((prev: any) => {
                      const newGroup = { ...prev };
                      newGroup.groups = newGroup.groups.map((gg: any, idx: number) => idx === badgeModal.groupIdx ? { ...gg, badge: null } : gg);
                      return newGroup;
                    });
                  }
                  setBadgeModal({ open: false, groupIdx: null, leaderId: null });
                }}
              >取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 