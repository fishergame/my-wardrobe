export type Gender = 'male' | 'female';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ClothingType = 'top' | 'bottom' | 'outerwear' | 'shoes' | 'hat' | 'accessory';
export type OutfitMode = 'simple' | 'exquisite';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  gender: Gender;
}

export interface ClothingItem {
  id: string;
  type: ClothingType;
  imageUrl: string;
  season?: Season[]; // Optional, default to all
  userId: string;
}

export interface Outfit {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  items: Record<string, string>; // slotId -> clothingItemId
  mode: OutfitMode;
  userId: string;
}

export interface WeatherData {
  temp: number;
  minTemp: number;
  maxTemp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  location: string;
}
