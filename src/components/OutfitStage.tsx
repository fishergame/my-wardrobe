import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SIMPLE_SLOTS, EXQUISITE_SLOTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Save, Shirt, Search, X, Check, Plus } from 'lucide-react';

interface OutfitStageProps {
  onSelectSlot: (slotId: string, type: string) => void;
  onAddClothing: () => void;
}

export const OutfitStage: React.FC<OutfitStageProps> = ({ onSelectSlot, onAddClothing }) => {
  const { mode, setMode, currentOutfit, wardrobe, randomizeOutfit, saveOutfit, setSlotItem, currentUser } = useApp();
  const [activeSlot, setActiveSlot] = useState<{ id: string; type: string } | null>(null);

  const getItemImage = (itemId: string) => {
    const item = wardrobe.find((i) => i.id === itemId);
    return item ? item.imageUrl : null;
  };

  const handleSlotClick = (slotId: string, type: string) => {
    setActiveSlot({ id: slotId, type });
  };

  const handleWearItem = (itemId: string) => {
    if (activeSlot) {
      setSlotItem(activeSlot.id, itemId);
      setActiveSlot(null);
    }
  };

  const renderSlot = (slot: any, className: string) => {
    const image = currentOutfit[slot.id] ? getItemImage(currentOutfit[slot.id]) : null;
    
    return (
      <motion.div
        key={slot.id}
        layoutId={slot.id}
        className={`relative bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group ${className}`}
        onClick={() => handleSlotClick(slot.id, slot.type)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 p-2 rounded-full shadow-sm">
            <Search size={16} className="text-slate-700" />
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSelectionOverlay = () => {
    if (!activeSlot) return null;

    const availableItems = wardrobe.filter(
      (item) => item.userId === currentUser.id && item.type === activeSlot.type
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center"
        onClick={() => setActiveSlot(null)}
      >
        <div 
          className="w-full max-w-md flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 text-white">
            <h3 className="text-2xl font-bold capitalize tracking-tight">选择 {activeSlot.type}</h3>
            <button 
              onClick={() => setActiveSlot(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Carousel */}
          <div 
            className="w-full overflow-x-auto flex items-center gap-4 px-8 snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Add New Card */}
            <div 
              className="snap-center shrink-0 w-[65%] aspect-[3/4] flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/30 rounded-3xl cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm group"
              onClick={() => {
                setActiveSlot(null);
                onAddClothing();
              }}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} className="text-white/70" />
              </div>
              <span className="text-white/70 font-bold text-lg">添加新项目</span>
            </div>

            {availableItems.map((item) => (
              <div 
                key={item.id} 
                className={`snap-center shrink-0 w-[65%] aspect-[3/4] relative rounded-3xl overflow-hidden shadow-2xl bg-white transition-transform duration-300 ${
                  currentOutfit[activeSlot.id] === item.id ? 'ring-4 ring-green-400 scale-[1.02]' : ''
                }`}
              >
                <img src={item.imageUrl} alt={item.type} className="w-full h-full object-cover" />
                
                {/* Wear It Button Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end items-center h-1/2">
                  <button
                    onClick={() => handleWearItem(item.id)}
                    className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    <span>穿上这个</span>
                  </button>
                </div>

                {/* Current Selection Indicator */}
                {currentOutfit[activeSlot.id] === item.id && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg z-10">
                    <Check size={20} />
                  </div>
                )}
              </div>
            ))}
            {/* Spacer for end of list */}
            <div className="w-4 shrink-0" />
          </div>
          
          <div className="text-center text-white/50 text-sm font-medium">
            滑动浏览选项
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 min-h-0 relative overflow-hidden">
      {/* Stage Area */}
      <div className="flex-1 relative min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'simple' ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-rows-2 gap-4 h-full"
            >
              {/* Top (Short) */}
              {renderSlot(SIMPLE_SLOTS[0], 'row-span-1')}
              {/* Bottom (Long) */}
              {renderSlot(SIMPLE_SLOTS[1], 'row-span-1')}
            </motion.div>
          ) : (
            <motion.div
              key="exquisite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-4 gap-2 h-full"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection Overlay */}
        <AnimatePresence>
          {renderSelectionOverlay()}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {/* Moved to App.tsx as a unified bottom bar */}
    </div>
  );
};
