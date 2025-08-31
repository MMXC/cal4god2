import React, { useContext } from 'react';
import { RoleContext } from '@/contexts/RoleContext';
import { QUALITY_LIST, POOL_TABS, TYPE_COLORS, DOT_COLORS } from './Cal2Context';

export interface PoolItemType {
  id: string;
  name: string;
  icon?: string;
  desc?: string;
  count?: number;
  typeLabel?: string; // 类型标签，如“稀有”“史诗”
  typeColor?: string; // 标签颜色
  image?: string; // 图片url
  entryDots?: string[]; // 词条点类型数组
  category?: string;
  quality: string; // 新增品质属性
  [key: string]: any;
}

export interface PoolSidebarProps {
  activeTab: string;
  allowedTabs: string[];
  onTabChange: (tab: string) => void;
  poolData: PoolItemType[];
  searchTerm: string;
  onSearch: (term: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  viewMode: 'card' | 'list';
  onViewModeChange: (mode: 'card' | 'list') => void;
  onItemClick: (item: PoolItemType) => void;
  selectedCode: string;
  jobCode: string;
  onRequireJob: () => void;
}



// 计算 allowedTabs
function getAllowedTabs(selectedCode: string, jobCode: string) {

  if (!selectedCode) return POOL_TABS.map(t => t.key);
  // 技能相关code判断
  if (['qq','qp','zq','zp','q1', 'q2', 'q3', 'q4', 'z1', 'z2', 'z3', 'z4'].includes(selectedCode)) {
    return ['jn', 'hh', 'fn', 'ct', 'jb', 'zk', 'fk'];
  }
  // 其它视为装备
  return ['zb', 'fw', 'fwzy', 'tz', 'ct'];
}

const PoolSidebar: React.FC<PoolSidebarProps> = ({
  activeTab, allowedTabs: _allowedTabs, onTabChange, poolData, searchTerm, onSearch, category, onCategoryChange, viewMode, onViewModeChange, onItemClick,
  selectedCode, jobCode, onRequireJob
}) => {
  const { lists } = useContext(RoleContext);
  const allowedTabs = getAllowedTabs(selectedCode, jobCode);

  // Tab点击事件
  function handleTabClick(tabKey: string) {
    if (!allowedTabs.includes(tabKey)) {
      onRequireJob && onRequireJob();
      return;
    }
    onTabChange(tabKey);
  }

  // 新增品质筛选
  const [quality, setQuality] = React.useState('');
  return (
    <div className="h-full flex flex-row bg-gray-50 border-r border-gray-300">
      {/* Tab竖排 */}
      <div className="flex flex-col gap-1 py-4 px-2 border-r border-gray-200 min-w-[60px]">
        {POOL_TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex flex-col items-center py-2 px-2 rounded text-xs font-bold transition-all ${
              activeTab===tab.key ? 'bg-yellow-200 text-yellow-900' : allowedTabs.includes(tab.key) ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
            disabled={!allowedTabs.includes(tab.key)}
            onClick={()=>handleTabClick(tab.key)}
          >
            <span className="text-lg mb-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col h-full p-2">
        {/* 工具栏 */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="search"
            placeholder="搜索..."
            value={searchTerm}
            onChange={e => onSearch(e.target.value)}
            className="flex-1 px-2 py-1 rounded border border-gray-400 text-xs"
          />
          {/* 移除原有的类别下拉框 */}
          {/* <select className="px-2 py-1 rounded text-xs border border-gray-400" value={category} onChange={e=>onCategoryChange(e.target.value)}>
            <option value="">全部类别</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select> */}
          <button className={`px-2 py-1 rounded text-xs ${viewMode==='card'?'bg-yellow-200':'bg-gray-200'}`} onClick={()=>onViewModeChange('card')}>卡片</button>
          <button className={`px-2 py-1 rounded text-xs ${viewMode==='list'?'bg-yellow-200':'bg-gray-200'}`} onClick={()=>onViewModeChange('list')}>列表</button>
        </div>
        {/* 顶部品质筛选导航 */}
        <div className="flex gap-2 mb-2">
          {QUALITY_LIST.map(q => (
            <button
              key={q.key}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${quality === q.key ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setQuality(q.key)}
            >
              {q.label}
            </button>
          ))}
        </div>
        
        {/* 内容区 */}
        <div className={`overflow-y-auto flex-1 ${viewMode==='card'?'grid grid-cols-2 gap-2':'flex flex-col gap-1'}`}> 
          {poolData
            // 按品质筛选
            .filter(item => !quality || item.quality === quality || quality === 'all')
            .filter(item => (!jobCode || item.belongJob === jobCode)||item.type!=='jn')
            // 保留原有的分类筛选逻辑（如有需要）
            .filter(item => {
              return (item.relatedZb.includes(selectedCode) || activeTab==='fw' || (item.relatedJn?.includes(selectedCode)))
            })
            .filter(item => !activeTab || item.type === activeTab ||((activeTab==='fk'||activeTab==='zk')&&item.type==='hh'))
            .map(item => {
              if(item.type==='fwzy'){
                return {
                  ...item,
                  fws: item.relatedFw.map((fw: string) => {
                    const fwItem = poolData.find(i => i.code === fw && i.type === 'fw' && i.categary === 'zb');
                    console.log(fwItem);
                    return fwItem;
                  }),
                  fwzycts: item.relatedCt.map((ct: string) => {
                    const ctItem = poolData.find(i => i.code === ct && i.type === 'ct' && i.categary === 'zb'&&i.relatedFwzy?.includes(item.code));
                    console.log(ctItem);
                    return ctItem;
                  })
                }
              }else if(item.type==='zb'){
                console.log(item.relatedTz);
                return {
                  ...item,
                  tz: poolData.find(i=>i.categary=== 'zb'&&i.code===item.belongTz && i.type==='tz'),
                  tzcts: poolData.filter(i=>i.categary=== 'zb'&&i.type===item.belongTz)
                }
              }else if(item.type==='hh'){
                return {
                  ...item,
                  type: activeTab,
                  sm: poolData.find(i=>i.categary=== 'jn'&&i.code===item.sm && i.type==='ct'),
                  fy: poolData.find(i=>i.categary=== 'jn'&&i.code===item.fy && i.type==='ct'),
                  gj: poolData.find(i=>i.categary=== 'jn'&&i.code===item.gj && i.type==='ct'),
                  hj1: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj1 && i.type==='hj'&&item.quality===i.quality),
                  hj2: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj2 && i.type==='hj'&&item.quality===i.quality),
                  hj3: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj3 && i.type==='hj'&&item.quality===i.quality),
                  hj4: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj4 && i.type==='hj'&&item.quality===i.quality),
                  hj5: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj5 && i.type==='hj'&&item.quality===i.quality),
                  hj6: poolData.find(i=>i.categary=== 'jn'&&i.code===item.hj6 && i.type==='hj'&&item.quality===i.quality),
                  jb: poolData.find(i=>i.categary=== 'jn'&&i.code===item.belongJb && i.type==='jb'),
                  basects: poolData.filter(i=>i.categary=== 'jn'&&i.code.startsWith('jc') && i.type==='ct'),
                  jbcts: poolData.filter(i=>i.categary=== 'jn'&&i.belongJb===item.belongJb && i.type==='ct'),
                  zlcts: poolData.filter(i=>i.categary=== 'jn'&&i.type==='zl'&&i.quality===item.quality&&(((item.hj1==='hh'||item.hj1==='ws')&&(['bjsh','ct','bs','hs','ls','ds'].includes(i.code)))||((item.hj1!=='hh'&&item.hj1!=='ws')&&(['bjsh','ct',item.hj1].includes(i.code)))))
                }
              }
              return item;
            })
            .map(item => (
              viewMode==='card' ? (
                <div
                  key={item.id}
                  className={`relative flex flex-col items-center p-2 border rounded-lg bg-white shadow cursor-pointer hover:border-yellow-400 transition-all`}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      code: item.code,
                      type: item.type, // 'ct', 'zb', 'jn' 等
                      data: item
                    }));
                  }}
                  onClick={()=>onItemClick(item)}
                  style={{color: TYPE_COLORS[item.quality]}}
                >
                  {/* 图片 */}
                  {item.pic ? <img src={item.pic} alt={item.name} className="w-16 h-16 object-cover rounded mb-1" /> : <span className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded mb-1">{item.icon}</span>}
                  {/* 名称/描述 */}
                  <span className="text-xs font-bold text-gray-800 truncate w-full text-center">{item.name}</span>
                  <span className="text-[10px] text-gray-400 mb-1">{item.condition||''}</span>
                  <span className="text-[10px] text-gray-400 mb-1">{item.desc}</span>
                  {/* 词条点 */}
                  <div className="flex flex-row gap-1 mt-1 justify-center">
                    {item.entryDots && item.entryDots.map((dot, i) => (
                      <span key={i} className={`inline-block w-3 h-3 rounded-full ${DOT_COLORS[dot]||'bg-gray-300'}`}></span>
                    ))}
                  </div>
                  {/* 数量 */}
                  <span className="text-xs bg-yellow-700 text-yellow-200 rounded px-1 mt-0.5">{item.min!==item.max?("("+item.min+"-"+item.max+")"+item.unit||''):(item.value+item.unit)}</span>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex items-left gap-2 p-1 border-b border-gray-200 cursor-pointer hover:bg-yellow-50"
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      code: item.code,
                      type: item.type, // 'ct', 'zb', 'jn' 等
                      data: item
                    }));
                  }}
                  onClick={()=>onItemClick(item)}
                  style={{color: TYPE_COLORS[item.quality]}}
                >
                  {item.pic ? <img src={item.pic} alt={item.name} className="w-8 h-8 object-cover rounded" /> : <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded">{item.icon}</span>}
                  <span className="flex-1 text-xs font-bold text-gray-800">{item.name}</span>
                  <span className={`text-xs text-left`}>{item.condition||''}</span>
                  <span className="text-xs text-left text-gray-500">{item.desc}</span>
                  <div className="flex flex-row gap-1">
                    {item.entryDots && item.entryDots.map((dot, i) => (
                      <span key={i} className={`inline-block w-3 h-3 rounded-full ${DOT_COLORS[dot]||'bg-gray-300'}`}></span>
                    ))}
                  </div>
                  <span className="text-xs bg-yellow-700 text-yellow-200 rounded px-1">{item.min!==item.max?("("+item.min+"-"+item.max+")"+item.unit||''):(item.value+item.unit)}</span>
                </div>
              )
            ))}
        </div>
      </div>
    </div>
  );
};

export default PoolSidebar;
