import React from 'react';
import { useApp } from '../context/AppContext';
import { ClothingType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface ClothingSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  slotId: string;
  type: ClothingType;
}

export const ClothingSelector: React.FC<ClothingSelectorProps> = ({ isOpen, onClose, slotId, type }) => {
  const { wardrobe, currentUser, setSlotItem, currentOutfit } = useApp();

  const availableItems = wardrobe.filter(
    (item) => item.userId === currentUser.id && item.type === type
  );

  const handleSelect = (itemId: string) => {
    setSlotItem(slotId, itemId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 capitalize">选择 {type}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pb-4">
              {availableItems.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-slate-400">
                  没有找到项目。添加一些衣服！
                </div>
              ) : (
                availableItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative group border-2 transition-all ${
                      currentOutfit[slotId] === item.id 
                        ? 'border-slate-900 ring-2 ring-slate-200' 
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.type} className="w-full h-full object-cover" />
                    {currentOutfit[slotId] === item.id && (
                      <div className="absolute top-2 right-2 bg-slate-900 text-white p-1 rounded-full shadow-sm">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
