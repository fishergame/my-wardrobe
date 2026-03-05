import { ClothingType } from './types';

export const SIMPLE_SLOTS: { id: string; type: ClothingType; label: string }[] = [
  { id: 'simple_top', type: 'top', label: '上衣' },
  { id: 'simple_bottom', type: 'bottom', label: '下装' },
];

export const EXQUISITE_SLOTS: { id: string; type: ClothingType; label: string }[] = [
  { id: 'exq_outerwear', type: 'outerwear', label: '外套' },
  { id: 'exq_hat', type: 'hat', label: '帽子' },
  { id: 'exq_top', type: 'top', label: '上衣' },
  { id: 'exq_bottom', type: 'bottom', label: '下装' },
  { id: 'exq_shoes', type: 'shoes', label: '鞋子' },
  { id: 'exq_accessory', type: 'accessory', label: '配饰' },
];
