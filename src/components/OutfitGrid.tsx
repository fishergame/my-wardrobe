import React from 'react';
import { useApp } from '../context/AppContext';
import { SIMPLE_SLOTS, EXQUISITE_SLOTS } from '../constants';
import { OutfitMode } from '../types';
import { Shirt } from 'lucide-react';

interface OutfitGridProps {
  mode: OutfitMode;
  items: Record<string, string>;
  className?: string;
}

export const OutfitGrid: React.FC<OutfitGridProps> = ({ mode, items, className = '' }) => {
  const { wardrobe } = useApp();

  const getItemImage = (itemId: string) => {
    const item = wardrobe.find((i) => i.id === itemId);
    return item ? item.imageUrl : null;
  };

  const renderSlot = (slot: any, slotClassName: string) => {
    const image = items[slot.id] ? getItemImage(items[slot.id]) : null;
    
    return (
      <div
        key={slot.id}
        className={`relative bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 ${slotClassName}`}
      >
        {image ? (
          <div className="w-full h-full relative">
            <img 
              src={image} 
              alt={slot.label} 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <Shirt size={24} strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-wider">{slot.label}</span>
          </div>
        )}
      </div>
    );
  };

  if (mode === 'simple') {
    return (
      <div className={`grid grid-rows-2 gap-4 h-full ${className}`}>
        {renderSlot(SIMPLE_SLOTS[0], 'row-span-1')}
        {renderSlot(SIMPLE_SLOTS[1], 'row-span-1')}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-2 h-full ${className}`}>
      {/* Left: Outerwear */}
      <div className="col-span-1 h-full">
        {renderSlot(EXQUISITE_SLOTS[0], 'h-full')}
      </div>
      
      {/* Middle: Hat, Top, Bottom, Shoes */}
      <div className="col-span-2 grid grid-rows-4 gap-2 h-full">
        {renderSlot(EXQUISITE_SLOTS[1], '')}
        {renderSlot(EXQUISITE_SLOTS[2], '')}
        {renderSlot(EXQUISITE_SLOTS[3], '')}
        {renderSlot(EXQUISITE_SLOTS[4], '')}
      </div>

      {/* Right: Accessory */}
      <div className="col-span-1 h-full flex flex-col gap-2">
        {renderSlot(EXQUISITE_SLOTS[5], 'h-1/3')}
        <div className="flex-1 bg-transparent" /> {/* Spacer */}
      </div>
    </div>
  );
};
