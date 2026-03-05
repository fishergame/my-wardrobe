import { ClothingItem, User, WeatherData } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    nickname: 'Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    gender: 'male',
  },
  {
    id: 'user_2',
    nickname: 'Sarah',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    gender: 'female',
  },
];

export const MOCK_WEATHER: WeatherData = {
  temp: 22,
  minTemp: 18,
  maxTemp: 25,
  condition: 'sunny',
  location: 'Shanghai',
};

export const MOCK_WARDROBE: ClothingItem[] = [
  // User 1 (Male)
  { id: 'c1', userId: 'user_1', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
  { id: 'c2', userId: 'user_1', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1542272617-08f086302542?w=400&h=400&fit=crop' },
  { id: 'c3', userId: 'user_1', type: 'shoes', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
  { id: 'c4', userId: 'user_1', type: 'outerwear', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop' },
  { id: 'c5', userId: 'user_1', type: 'hat', imageUrl: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400&h=400&fit=crop' },
  { id: 'c6', userId: 'user_1', type: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
  // Extra items for User 1 to enable scrolling
  { id: 'c1_2', userId: 'user_1', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop' },
  { id: 'c1_3', userId: 'user_1', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop' },
  { id: 'c1_4', userId: 'user_1', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop' },
  { id: 'c2_2', userId: 'user_1', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
  { id: 'c2_3', userId: 'user_1', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400&h=400&fit=crop' },
  
  // User 2 (Female)
  { id: 'c7', userId: 'user_2', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=400&fit=crop' },
  { id: 'c8', userId: 'user_2', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7cc637703e6?w=400&h=400&fit=crop' },
  { id: 'c9', userId: 'user_2', type: 'shoes', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop' },
  { id: 'c10', userId: 'user_2', type: 'outerwear', imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop' },
  { id: 'c11', userId: 'user_2', type: 'hat', imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop' },
  { id: 'c12', userId: 'user_2', type: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
  // Extra items for User 2
  { id: 'c7_2', userId: 'user_2', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400&h=400&fit=crop' },
  { id: 'c7_3', userId: 'user_2', type: 'top', imageUrl: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=400&fit=crop' },
  { id: 'c8_2', userId: 'user_2', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1551488852-0801751acbe3?w=400&h=400&fit=crop' },
  { id: 'c8_3', userId: 'user_2', type: 'bottom', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
];
