import React from 'react';
import { skillGridSlots, typeLabels } from './Cal2Context';


export default function SkillGrid({ onSlotClick }: { onSlotClick?: (code: string) => void }) {
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
          {typeLabels[slot.type]}
        </div>
      ))}
    </div>
  );
}
