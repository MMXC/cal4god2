import React from 'react';
import { skillGridSlots, typeLabels, useCal2 } from './Cal2Context';


export default function SkillGrid({ onSlotClick }: { onSlotClick?: (code: string) => void }) {
  const { data } = useCal2();
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-2 bg-gray-900 p-4 rounded-lg w-[400px] h-[400px]">
      {skillGridSlots.flat().map((slot, idx) => (
        <div
          key={idx}
          className={
            'flex items-center justify-center border rounded-lg text-white text-sm font-bold h-20 w-20 ' +
            (slot.type === 'disabled'
              ? 'bg-gray-700 opacity-50 cursor-not-allowed'
              : 'bg-gray-800 hover:border-blue-400 cursor-pointer')
          }
          onClick={() => slot.type !== 'disabled' && onSlotClick?.(slot.type)}
        >
          {data[slot.type]?.name?<img src={data[slot.type].jn?.pic} alt={data[slot.type].name} title={data[slot.type].name} className="w-15 h-15" />:typeLabels[slot.type]}
        </div>
      ))}
    </div>
  );
}
