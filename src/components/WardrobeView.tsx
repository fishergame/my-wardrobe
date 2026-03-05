import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Trash2, Maximize2, AlertTriangle } from 'lucide-react';
import { ClothingType, ClothingItem } from '../types';

interface WardrobeViewProps {
  onClose: () => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({ onClose }) => {
  const { wardrobe, currentUser, checkClothingUsage, deleteClothingItem } = useApp();
  const [activeFilter, setActiveFilter] = useState<ClothingType | 'all'>('all');
  const [itemToDelete, setItemToDelete] = useState<{ item: ClothingItem; usageCount: number } | null>(null);
  const [zoomedItem, setZoomedItem] = useState<ClothingItem | null>(null);

  const userItems = wardrobe.filter((item) => item.userId === currentUser.id);
  
  const filteredItems = activeFilter === 'all' 
    ? userItems 
    : userItems.filter((item) => item.type === activeFilter);

  const categories: { id: ClothingType | 'all'; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'top', label: '上衣' },
    { id: 'bottom', label: '下装' },
    { id: 'outerwear', label: '外套' },
    { id: 'shoes', label: '鞋子' },
    { id: 'hat', label: '帽子' },
    { id: 'accessory', label: '配饰' },
  ];

  const handleDeleteClick = (e: React.MouseEvent, item: ClothingItem) => {
    e.stopPropagation();
    const usage = checkClothingUsage(item.id);
    setItemToDelete({ item, usageCount: usage.length });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteClothingItem(itemToDelete.item.id);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">我的衣柜</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 overflow-x-auto flex gap-2 no-scrollbar border-b border-slate-50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-20">
            {filteredItems.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <Filter size={48} className="mb-4 opacity-20" />
                <p>此分类下没有找到项目。</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group cursor-pointer"
                  onClick={() => setZoomedItem(item)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.type} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => handleDeleteClick(e, item)}
                      className="p-2 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                      title="删除项目"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-white text-xs font-medium capitalize">{item.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Stats Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          显示 {filteredItems.length} 个项目
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setItemToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">删除项目？</h3>
                  <p className="text-sm text-slate-500 mt-2">
                    确定要删除这个项目吗？此操作无法撤销。
                  </p>
                  {itemToDelete.usageCount > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-left">
                      <p className="text-xs text-amber-800 font-medium flex items-start gap-2">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        <span>
                          警告：此项目已在 <strong>{itemToDelete.usageCount}</strong> 个保存的搭配中使用。
                          删除它将导致历史记录中缺少图片。
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button 
                    onClick={() => setItemToDelete(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setZoomedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setZoomedItem(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {/* 删除按钮 */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(e, zoomedItem);
                  setZoomedItem(null);
                }}
                className="absolute -top-12 left-0 p-2 text-white/70 hover:text-red-400 transition-colors"
                title="删除项目"
              >
                <Trash2 size={24} />
              </button>
              
              <img 
                src={zoomedItem.imageUrl} 
                alt={zoomedItem.type} 
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" 
              />
              <div className="mt-4 text-center">
                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium capitalize backdrop-blur-sm border border-white/20">
                  {zoomedItem.type}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
