import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ClothingItem, Outfit, WeatherData, OutfitMode } from '../types';
import { MOCK_USERS, MOCK_WARDROBE, MOCK_WEATHER } from '../data/mock';
import { SIMPLE_SLOTS, EXQUISITE_SLOTS } from '../constants';

interface AppContextType {
  currentUser: User;
  users: User[];
  wardrobe: ClothingItem[];
  outfits: Outfit[];
  weather: WeatherData;
  mode: OutfitMode;
  currentOutfit: Record<string, string>; // slotId -> clothingItemId
  
  switchUser: (userId: string) => void;
  setMode: (mode: OutfitMode) => void;
  addClothingItem: (item: ClothingItem) => void;
  setSlotItem: (slotId: string, itemId: string) => void;
  saveOutfit: () => boolean;
  randomizeOutfit: () => void;
  getOutfitForDate: (date: string) => Outfit | undefined;
  getOutfitsForDate: (date: string) => Outfit[];
  addUser: (nickname: string, avatar: string) => void;
  deleteUser: (userId: string) => void;
  checkClothingUsage: (itemId: string) => Outfit[];
  deleteClothingItem: (itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [users, setUsers] = useState<User[]>([MOCK_USERS[0]]);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(MOCK_WARDROBE);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [weather] = useState<WeatherData>(MOCK_WEATHER);
  const [mode, setMode] = useState<OutfitMode>('simple');
  const [currentOutfit, setCurrentOutfit] = useState<Record<string, string>>({});

  // Load from local storage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('ootd_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    const savedOutfits = localStorage.getItem('ootd_outfits');
    if (savedOutfits) {
      setOutfits(JSON.parse(savedOutfits));
    }
    const savedWardrobe = localStorage.getItem('ootd_wardrobe');
    if (savedWardrobe) {
      setWardrobe(JSON.parse(savedWardrobe));
    }
    const savedCurrentOutfit = localStorage.getItem('ootd_current_outfit');
    if (savedCurrentOutfit) {
      setCurrentOutfit(JSON.parse(savedCurrentOutfit));
    }
    const savedMode = localStorage.getItem('ootd_mode');
    if (savedMode) {
      setMode(savedMode as OutfitMode);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ootd_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ootd_outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('ootd_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('ootd_current_outfit', JSON.stringify(currentOutfit));
  }, [currentOutfit]);

  useEffect(() => {
    localStorage.setItem('ootd_mode', mode);
  }, [mode]);

  // Actions
  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentOutfit({}); // Reset current outfit on user switch
    }
  };

  const addUser = (nickname: string, avatar: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      nickname,
      avatar,
      gender: 'female', // Default to female for now, or add gender selection
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const deleteUser = (userId: string) => {
    // Prevent deleting the default user (first user)
    if (userId === MOCK_USERS[0].id) return;

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser.id === userId) {
      setCurrentUser(users[0]); // Switch back to default user
    }
  };

  const addClothingItem = (item: ClothingItem) => {
    setWardrobe((prev) => [...prev, item]);
  };

  const checkClothingUsage = (itemId: string) => {
    return outfits.filter(outfit => Object.values(outfit.items).includes(itemId));
  };

  const deleteClothingItem = (itemId: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== itemId));
  };

  const setSlotItem = (slotId: string, itemId: string) => {
    console.log(`setSlotItem: setting ${slotId} to ${itemId}`);
    setCurrentOutfit((prev) => {
      const updated = { ...prev, [slotId]: itemId };
      console.log('currentOutfit updated to:', updated);
      return updated;
    });
  };

  const saveOutfit = () => {
    console.log('saveOutfit called in context, currentOutfit:', currentOutfit);
    
    // use local date string to avoid timezone shift
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;

    // don't save if no items in current outfit
    if (Object.keys(currentOutfit).length === 0) {
      console.warn('attempted to save empty outfit');
      return false;
    }

    const newOutfit: Outfit = {
      id: crypto.randomUUID(),
      date: today,
      items: { ...currentOutfit }, // explicitly copy to avoid state mutation
      mode,
      userId: currentUser.id,
    };
    
    console.log('saving outfit with items:', newOutfit.items);
    
    // Append new outfit, allowing multiple per day
    setOutfits((prev) => {
      const updated = [...prev, newOutfit];
      console.log('outfits updated, total count:', updated.length);
      return updated;
    });
    // clear current outfit after saving so UI resets
    setCurrentOutfit({});
    return true;
  };

  const randomizeOutfit = () => {
    const slots = mode === 'simple' ? SIMPLE_SLOTS : EXQUISITE_SLOTS;
    const newOutfit: Record<string, string> = {};

    slots.forEach((slot) => {
      const availableItems = wardrobe.filter(
        (item) => item.userId === currentUser.id && item.type === slot.type
      );
      if (availableItems.length > 0) {
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        newOutfit[slot.id] = randomItem.id;
      }
    });

    setCurrentOutfit(newOutfit);
  };

  const getOutfitForDate = (date: string) => {
    return outfits.find((o) => o.date === date && o.userId === currentUser.id);
  };

  const getOutfitsForDate = (date: string) => {
    return outfits.filter((o) => o.date === date && o.userId === currentUser.id);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        wardrobe,
        outfits,
        weather,
        mode,
        currentOutfit,
        switchUser,
        setMode,
        addClothingItem,
        setSlotItem,
        saveOutfit,
        randomizeOutfit,
        getOutfitForDate,
        getOutfitsForDate,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
