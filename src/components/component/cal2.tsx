import React, { useEffect, useState } from 'react';
import { fetchPoolData, fetchProfessions, fetchTalents } from '@/services/api';
import PoolSidebar from './cal2/PoolSidebar';
import EquipGrid from './cal2/EquipGrid';
import SkillGrid from './cal2/SkillGrid';
import InfoPanel from './cal2/InfoPanel';
import DetailPanel from './cal2/DetailPanel';
import { Cal2Provider, useCal2, EquipDetail } from './cal2/Cal2Context';

// 类型声明
interface EquipType {
  id: string;
  name: string;
  entriesText?: string;
  [key: string]: any;
}
interface SkillType {
  id: string;
  name: string;
  desc?: string;
  [key: string]: any;
}
interface DetailType {
  type: 'equip' | 'skill';
  slot: string;
  [key: string]: any;
}

// 职业/天赋选择卡片组
function SingleSelectCardRow({ options, value, onChange, labelKey = 'name' }: { options: any[]; value: string | number; onChange: (v: string) => void; labelKey?: string }) {
  return (
    <div className="flex gap-2 mb-2">
      {options.map(opt => (
        <div
          key={opt.id}
          className={
            'px-4 py-2 rounded-lg border cursor-pointer text-sm ' +
            (value === opt.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-200 border-gray-600 hover:border-blue-400')
          }
          onClick={() => onChange(opt.id)}
        >
          {opt[labelKey]}
        </div>
      ))}
    </div>
  );
}

export default function Cal2() {
  return (
    <Cal2Provider>
      <Cal2Content />
    </Cal2Provider>
  );
}

function Cal2Content() {
  // 池子数据
  const [poolData, setPoolData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [activeTab, setActiveTab] = useState<string>('zb');
  // 其它 state
  const [selectedEquips, setSelectedEquips] = useState<Record<string, any>>({});
  const [selectedSkills, setSelectedSkills] = useState<Record<string, any>>({});
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  // 职业/天赋
  const [professions, setProfessions] = useState<any[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [talents, setTalents] = useState<any[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<string>('');
  const allowedTabs = ['equip', 'runeWord', 'rune', 'base', 'rare', 'epic', 'legend', 'ancient', 'skill', 'core', 'empower'];
  const [category, setCategory] = useState('');
  const [selectedDetailCode, setSelectedDetailCode] = useState<string | null>(null);
  const { setData, handleDropToDetail } = useCal2();

  // 区域展开收起状态
  const [areaExpanded, setAreaExpanded] = useState({
    area1: true,  // PoolSidebar
    area2: true,  // DetailPanel
    area3: true,  // EquipGrid + SkillGrid
    area4: true   // InfoPanel
  });

  // 切换区域展开状态
  const toggleArea = (area: keyof typeof areaExpanded) => {
    setAreaExpanded(prev => ({ ...prev, [area]: !prev[area] }));
  };

  useEffect(() => {
    fetchPoolData().then(data => setPoolData(Array.isArray(data) ? data : []));
  }, [activeTab]);

  useEffect(() => {
    fetchProfessions().then(data => {
      setProfessions(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) setSelectedProfession(data[0].id);
    });
    fetchTalents().then(data => {
      setTalents(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) setSelectedTalent(data[0].id);
    });
  }, []);

  function handleEquipDrop(slot: string, equip: any) {
    setSelectedEquips(prev => ({ ...prev, [slot]: equip }));
  }
  function handleSkillDrop(slot: string, skill: any) {
    setSelectedSkills(prev => ({ ...prev, [slot]: skill }));
  }
  function handleDetailEdit(patch: any) {
    const { code, group, entryCode, value } = patch;
    
    setData(prev => {
      const newData = { ...prev };
      const target = newData[code];
      
      if (target && target.type === 'equip') {
        const equipTarget = target as EquipDetail;
        let ctArray: any[] = [];
        
        // 根据 group 确定要修改的词条数组
        switch (group) {
          case '基础属性':
            ctArray = equipTarget.basects;
            break;
          case '稀有词条':
            ctArray = equipTarget.rarects;
            break;
          case '史诗词条':
            ctArray = equipTarget.epiccts;
            break;
          case '传说词条':
            ctArray = equipTarget.legendcts;
            break;
          case '远古词条':
            ctArray = equipTarget.ancientcts;
            break;
        }
        
        // 找到并更新对应的词条
        const entryIndex = ctArray.findIndex(ct => ct.code === entryCode);
        if (entryIndex !== -1) {
          ctArray[entryIndex] = { ...ctArray[entryIndex], value };
          
          // 更新对应的数组
          switch (group) {
            case '基础属性':
              newData[code] = { ...equipTarget, basects: [...ctArray] };
              break;
            case '稀有词条':
              newData[code] = { ...equipTarget, rarects: [...ctArray] };
              break;
            case '史诗词条':
              newData[code] = { ...equipTarget, epiccts: [...ctArray] };
              break;
            case '传说词条':
              newData[code] = { ...equipTarget, legendcts: [...ctArray] };
              break;
            case '远古词条':
              newData[code] = { ...equipTarget, ancientcts: [...ctArray] };
              break;
          }
        }
      }
      
      return newData;
    });
  }
  function handleDetailRemove() {
    if (selectedDetail?.type === 'equip') {
      setSelectedEquips(prev => { const n = { ...prev }; delete n[selectedDetail.slot]; return n; });
    } else if (selectedDetail?.type === 'skill') {
      setSelectedSkills(prev => { const n = { ...prev }; delete n[selectedDetail.slot]; return n; });
    }
    setSelectedDetail(null);
  }

  function handleRemoveEntry(entryCode: string, group: string) {
    if (!selectedDetailCode) return;
    
    setData(prev => {
      const newData = { ...prev };
      const target = newData[selectedDetailCode];
      
      if (target && target.type === 'equip') {
        const equipTarget = target as EquipDetail;
        let ctArray: any[] = [];
        
        // 根据 group 确定要修改的词条数组
        switch (group) {
          case '基础属性':
            ctArray = equipTarget.basects;
            break;
          case '稀有词条':
            ctArray = equipTarget.rarects;
            break;
          case '史诗词条':
            ctArray = equipTarget.epiccts;
            break;
          case '传说词条':
            ctArray = equipTarget.legendcts;
            break;
          case '远古词条':
            ctArray = equipTarget.ancientcts;
            break;
        }
        
        // 移除指定词条
        const filteredArray = ctArray.filter(ct => ct.code !== entryCode);
        
        // 更新对应的数组
        switch (group) {
          case '基础属性':
            newData[selectedDetailCode] = { ...equipTarget, basects: filteredArray };
            break;
          case '稀有词条':
            newData[selectedDetailCode] = { ...equipTarget, rarects: filteredArray };
            break;
          case '史诗词条':
            newData[selectedDetailCode] = { ...equipTarget, epiccts: filteredArray };
            break;
          case '传说词条':
            newData[selectedDetailCode] = { ...equipTarget, legendcts: filteredArray };
            break;
          case '远古词条':
            newData[selectedDetailCode] = { ...equipTarget, ancientcts: filteredArray };
            break;
        }
      }
      
      return newData;
    });
  }
  function handleCardClick(card: any) { setSelectedDetail(card); }

  function handleDropToDetailArea(e: React.DragEvent) {
    handleDropToDetail(e, selectedDetailCode || undefined);
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* 区域1：池化区 */}
      <div className={`flex flex-col ${areaExpanded.area1 ? 'flex-1' : 'w-8'} transition-all duration-300`}>
        <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
          <span className="text-sm font-bold">词条仓库</span>
          <button 
            onClick={() => toggleArea('area1')}
            className="text-gray-600 hover:text-gray-800"
          >
            {areaExpanded.area1 ? '◀' : '▶'}
          </button>
        </div>
        {areaExpanded.area1 && (
          <PoolSidebar
            activeTab={activeTab}
            allowedTabs={allowedTabs}
            onTabChange={setActiveTab}
            poolData={poolData}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            category={category}
            onCategoryChange={setCategory}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onItemClick={handleCardClick} 
            selectedCode={selectedDetailCode || ''} 
            jobCode={selectedProfession || ''} 
            onRequireJob={() => {}}
          />
        )}
      </div>

      {/* 区域2：详情/设置 */}
      <div className={`flex flex-col ${areaExpanded.area2 ? 'flex-1' : 'w-8'} transition-all duration-300`}>
        <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
          <span className="text-sm font-bold">详情面板</span>
          <button 
            onClick={() => toggleArea('area2')}
            className="text-gray-600 hover:text-gray-800"
          >
            {areaExpanded.area2 ? '◀' : '▶'}
          </button>
        </div>
        {areaExpanded.area2 && (
          <div
            className="flex flex-col bg-gray-50 rounded-lg p-4 flex-1 flex flex-col"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropToDetailArea}
          >
            <DetailPanel
              code={selectedDetailCode || ''}
              onEdit={handleDetailEdit}
              onRemove={handleDetailRemove}
              onRemoveEntry={handleRemoveEntry}
            />
          </div>
        )}
      </div>

      {/* 区域3：装备/技能卡片组（右侧） */}
      <div className={`flex flex-col ${areaExpanded.area3 ? 'w-[400px]' : 'w-8'} transition-all duration-300`}>
        <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
          <span className="text-sm font-bold">装备技能</span>
          <button 
            onClick={() => toggleArea('area3')}
            className="text-gray-600 hover:text-gray-800"
          >
            {areaExpanded.area3 ? '◀' : '▶'}
          </button>
        </div>
        {areaExpanded.area3 && (
          <div className="flex flex-col gap-4 w-full mx-4 p-4">
            {/* 职业选择行 */}
            <SingleSelectCardRow options={professions} value={selectedProfession} onChange={setSelectedProfession} labelKey="nickname" />
            {/* 装备16宫格 */}
            <EquipGrid onSlotClick={setSelectedDetailCode} />
            {/* 技能16宫格 */}
            <SkillGrid onSlotClick={setSelectedDetailCode} />
            {/* 天赋选择行 */}
            <SingleSelectCardRow options={talents} value={selectedTalent} onChange={setSelectedTalent} />
          </div>
        )}
      </div>

      {/* 区域4：属性面板 */}
      <div className={`flex flex-col ${areaExpanded.area4 ? 'flex-1' : 'w-8'} transition-all duration-300`}>
        <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
          <span className="text-sm font-bold">属性面板</span>
          <button 
            onClick={() => toggleArea('area4')}
            className="text-gray-600 hover:text-gray-800"
          >
            {areaExpanded.area4 ? '◀' : '▶'}
          </button>
        </div>
        {areaExpanded.area4 && (
          <div className="flex flex-col bg-gray-50 rounded-lg p-4 flex-1 flex flex-col">
            <InfoPanel
              equips={selectedEquips}
              skills={selectedSkills}
            />
          </div>
        )}
      </div>
    </div>
  );
} 