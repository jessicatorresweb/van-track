export interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
  supplier: string;
  lastRestocked: string;
  barcode?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface StockAlert {
  id: string;
  itemId: string;
  type: 'low' | 'out' | 'overstock';
  message: string;
  timestamp: string;
}

export const ITEM_CATEGORIES: Category[] = [
  { id: 'tools', name: 'Tools', color: '#2563eb', icon: 'wrench' },
  { id: 'hardware', name: 'Hardware', color: '#dc2626', icon: 'hammer' },
  { id: 'electrical', name: 'Electrical', color: '#eab308', icon: 'zap' },
  { id: 'plumbing', name: 'Plumbing', color: '#0ea5e9', icon: 'droplets' },
  { id: 'safety', name: 'Safety', color: '#16a34a', icon: 'shield' },
  { id: 'consumables', name: 'Consumables', color: '#9333ea', icon: 'package' },
  { id: 'other', name: 'Other', color: '#64748b', icon: 'box' },
];

export const UNITS = [
  'pieces', 'meters', 'feet', 'liters', 'gallons', 'kg', 'lbs', 'boxes', 'rolls', 'tubes'
];