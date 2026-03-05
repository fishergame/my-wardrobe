import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, ChevronDown, UserPlus, Users, LogOut, Trash2, X, Upload, Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const TopBar: React.FC<{ onAddClothing: () => void; onOpenWardrobe: () => void }> = ({ onAddClothing, onOpenWardrobe }) => {
  const { currentUser, users, switchUser, mode, setMode, addUser, deleteUser, wardrobe, weather } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userClothingCount = wardrobe.filter((item) => item.userId === currentUser.id).length;

  // Weather icon and text mapping
  const getWeatherInfo = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return { icon: Sun, text: '晴天', color: 'text-yellow-500' };
      case 'cloudy':
        return { icon: Cloud, text: '多云', color: 'text-gray-500' };
      case 'rainy':
        return { icon: CloudRain, text: '雨天', color: 'text-blue-500' };
      case 'snowy':
        return { icon: Snowflake, text: '雪天', color: 'text-blue-300' };
      default:
        return { icon: Sun, text: '晴天', color: 'text-yellow-500' };
    }
  };

  const weatherInfo = getWeatherInfo(weather.condition);
  const WeatherIcon = weatherInfo.icon; // used in layout above


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CreateUserModal = () => {
    const [nickname, setNickname] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (nickname && avatarUrl) {
        addUser(nickname, avatarUrl);
        setShowCreateModal(false);
        setIsMenuOpen(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">创建新用户</h3>
            <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">头像链接</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              {avatarUrl && (
                <div className="flex justify-center mt-2">
                  <img src={avatarUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">昵称</label>
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入昵称"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4 hover:bg-slate-800 active:scale-95 transition-all"
            >
              创建用户
            </button>
          </form>
        </div>
      </div>
    );
  };

  const ManageUsersModal = () => {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">管理用户</h3>
            <button onClick={() => setShowManageModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {users.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.nickname} className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-medium text-slate-700">{user.nickname}</span>
                  {index === 0 && <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-500">Default</span>}
                </div>
                {index !== 0 && (
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
        {/* Left: User Switcher (Dropdown) */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.nickname} 
              className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
            />
            <span className="text-sm font-bold text-slate-700 max-w-[80px] truncate">
              {currentUser.nickname}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-30 origin-top-left"
              >
                {/* Large User Card */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-4 mb-3">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.nickname} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{currentUser.nickname}</h3>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">当前用户</span>
                    </div>
                  </div>
                  
                  {/* Stats Button */}
                  <button 
                    onClick={() => {
                      onOpenWardrobe();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                  >
                    <span className="text-sm font-medium text-slate-600">衣柜总数</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">{userClothingCount}</span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-600">件 ›</span>
                    </div>
                  </button>
                </div>

                <div className="p-2 border-b border-slate-50 max-h-48 overflow-y-auto">
                  <div className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider mb-1">切换账户</div>
                  {users.filter(u => u.id !== currentUser.id).map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                    >
                      <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium text-slate-700">{user.nickname}</span>
                    </button>
                  ))}
                </div>
                
                <div className="p-2 bg-slate-50/50">
                  <button 
                    onClick={() => {
                      setShowCreateModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-slate-50 text-slate-700"
                  >
                    <UserPlus size={16} />
                    <span>创建新用户</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowManageModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-slate-50 text-slate-700"
                  >
                    <Users size={16} />
                    <span>用户管理</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Weather Display */}
        <div className="flex items-center gap-2 h-10 px-3 rounded-full pointer-events-none">
          <WeatherIcon size={16} className={weatherInfo.color} />
          <div className="text-xs leading-tight">
            <div className="font-medium text-slate-700">{weatherInfo.text}</div>
            <div className="text-slate-500">{weather.minTemp}° - {weather.maxTemp}°</div>
          </div>
        </div>

        {/* Right: Mode Switcher + Camera Button */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher (Compact) */}
          <div className="flex bg-slate-100 p-1 rounded-full">
            {[
              { key: 'simple', label: '简练' },
              { key: 'exquisite', label: '精致' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key as 'simple' | 'exquisite')}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  mode === key 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Camera Button (Compact) */}
          <button 
            onClick={onAddClothing}
            className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-md hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateUserModal />}
      {showManageModal && <ManageUsersModal />}
    </>
  );
};
