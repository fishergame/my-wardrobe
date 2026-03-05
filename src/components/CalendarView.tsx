import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OutfitGrid } from './OutfitGrid';
import { Outfit } from '../types';

interface CalendarViewProps {
  onClose: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onClose }) => {
  const { getOutfitsForDate } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const outfits = getOutfitsForDate(dateStr);
      const hasOutfit = outfits.length > 0;
      const isSelected = selectedDate === dateStr;
      
      days.push(
        <div
          key={d}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer transition-all relative ${
            isSelected
              ? 'bg-slate-900 text-white shadow-md'
              : hasOutfit 
                ? 'bg-red-50 text-red-600 font-bold hover:bg-red-100' 
                : 'text-slate-600 hover:bg-slate-100'
          }`}
          onClick={() => handleDateClick(dateStr)}
        >
          {d}
          {hasOutfit && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-red-500 rounded-full" />
          )}
        </div>
      );
    }
    return days;
  };

  const selectedOutfits = selectedDate ? getOutfitsForDate(selectedDate) : [];

  return (
    <>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
            <CalendarIcon size={24} className="text-slate-500" />
            <span>搭配历史</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium text-slate-700">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-200">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 gap-x-1 place-items-center mb-8">
            {renderDays()}
          </div>

          {/* Selected Date Outfits */}
          <AnimatePresence mode="wait">
            {selectedDate && selectedOutfits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-auto"
              >
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>Outfits for {selectedDate}</span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{selectedOutfits.length}</span>
                </h4>
                
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                  {selectedOutfits.map((outfit, index) => (
                    <div 
                      key={outfit.id}
                      className="snap-center shrink-0 w-48 aspect-[3/4] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all"
                      onClick={() => setSelectedOutfit(outfit)}
                    >
                      <div className="absolute inset-0 p-2 pointer-events-none">
                        <OutfitGrid mode={outfit.mode} items={outfit.items} className="pointer-events-none" />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <Maximize2 size={20} className="text-slate-800" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedOutfit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setSelectedOutfit(null)}
                  className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm backdrop-blur-md transition-colors"
                >
                  <X size={24} className="text-slate-800" />
                </button>
              </div>
              
              <div className="flex-1 p-6 bg-slate-50">
                <OutfitGrid mode={selectedOutfit.mode} items={selectedOutfit.items} />
              </div>
              
              <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Date</div>
                  <div className="font-bold text-slate-800">{selectedOutfit.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Mode</div>
                  <div className="font-bold text-slate-800 capitalize">{selectedOutfit.mode}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
