import React, { useState, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { TopBar } from './components/TopBar';
import { OutfitStage } from './components/OutfitStage';
import { CalendarView } from './components/CalendarView';
import { CameraView } from './components/CameraView';
import { ClothingSelector } from './components/ClothingSelector';
import { WardrobeView } from './components/WardrobeView';
import { ClothingType } from './types';
import { Calendar as CalendarIcon, Shuffle, Save, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MainApp: React.FC = () => {
  const { randomizeOutfit, saveOutfit, currentOutfit } = useApp();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  
  const [selectorState, setSelectorState] = useState<{ isOpen: boolean; slotId: string; type: ClothingType | null }>({
    isOpen: false,
    slotId: '',
    type: null,
  });

  const handleOpenSelector = (slotId: string, type: string) => {
    setSelectorState({ isOpen: true, slotId, type: type as ClothingType });
  };

  const handleCloseSelector = () => {
    setSelectorState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSave = () => {
    console.log('handleSave called, currentOutfit:', currentOutfit);
    const hasItems = Object.keys(currentOutfit).length > 0;
    console.log('hasItems:', hasItems);
    
    if (!hasItems) {
      console.warn('无法保存：未选择任何服装项目');
      return;
    }
    
    console.log('开始保存穿搭...');
    const success = saveOutfit();
    console.log('穿搭保存结果:', success);
    
    if (success) {
      setIsSaved(true);
      setIsFlying(true);
      
      // Reset flying animation
      setTimeout(() => setIsFlying(false), 1000);
      
      // Reset saved state after a delay
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <Layout>
      <TopBar 
        onAddClothing={() => setIsCameraOpen(true)} 
        onOpenWardrobe={() => setIsWardrobeOpen(true)}
      />
      
      <OutfitStage 
        onSelectSlot={handleOpenSelector} 
        onAddClothing={() => setIsCameraOpen(true)}
      />
      
      {/* Unified Bottom Bar */}
      <div className="p-4 mt-auto bg-white/80 backdrop-blur-md border-t border-slate-100 flex items-center gap-3 pb-8 relative z-10">
        {/* Yesterday's Outfit (Small Icon Button) */}
        <button 
          ref={calendarBtnRef}
          onClick={() => setIsCalendarOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 active:scale-95 transition-all shadow-sm relative"
          title="昨天的搭配"
        >
          <CalendarIcon size={20} />
          {/* Flying Card Animation Target */}
          {isFlying && (
            <motion.div
              initial={{ opacity: 1, scale: 0.5, x: 100, y: -200 }}
              animate={{ opacity: 0, scale: 0.1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-slate-900 rounded-lg z-50 pointer-events-none"
            />
          )}
        </button>

        {/* Randomize (Capsule) */}
        <button
          onClick={randomizeOutfit}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 h-12 rounded-full shadow-sm hover:bg-slate-50 active:scale-95 transition-all font-medium text-sm"
        >
          <Shuffle size={18} />
          <span>随性搭配</span>
        </button>

        {/* Save Outfit (Capsule) */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-full shadow-lg active:scale-95 transition-all font-medium text-sm ${
            isSaved 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isSaved ? <Check size={18} /> : <Save size={18} />}
          <span>{isSaved ? '已保存' : '保存'}</span>
        </button>
      </div>

      {isCameraOpen && (
        <CameraView onClose={() => setIsCameraOpen(false)} />
      )}

      <AnimatePresence>
        {isCalendarOpen && (
          <CalendarView onClose={() => setIsCalendarOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWardrobeOpen && (
          <WardrobeView onClose={() => setIsWardrobeOpen(false)} />
        )}
      </AnimatePresence>

      {selectorState.isOpen && selectorState.type && (
        <ClothingSelector
          isOpen={selectorState.isOpen}
          onClose={handleCloseSelector}
          slotId={selectorState.slotId}
          type={selectorState.type}
        />
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
