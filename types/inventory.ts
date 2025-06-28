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

export const VAN_SIDES = [
  { id: 'driver', name: 'Driver Side' },
  { id: 'passenger', name: 'Passenger Side' },
  { id: 'rear', name: 'Rear' },
  { id: 'front', name: 'Front/Cab' },
];

export const VAN_BAYS = [
  { id: 'upper-1', name: 'Upper Bay 1' },
  { id: 'upper-2', name: 'Upper Bay 2' },
  { id: 'upper-3', name: 'Upper Bay 3' },
  { id: 'middle-1', name: 'Middle Bay 1' },
  { id: 'middle-2', name: 'Middle Bay 2' },
  { id: 'middle-3', name: 'Middle Bay 3' },
  { id: 'lower-1', name: 'Lower Bay 1' },
  { id: 'lower-2', name: 'Lower Bay 2' },
  { id: 'lower-3', name: 'Lower Bay 3' },
  { id: 'floor', name: 'Floor Storage' },
  { id: 'toolbox-1', name: 'Tool Box 1' },
  { id: 'toolbox-2', name: 'Tool Box 2' },
  { id: 'drawer-1', name: 'Drawer 1' },
  { id: 'drawer-2', name: 'Drawer 2' },
  { id: 'drawer-3', name: 'Drawer 3' },
  { id: 'shelf-a', name: 'Shelf A' },
  { id: 'shelf-b', name: 'Shelf B' },
  { id: 'shelf-c', name: 'Shelf C' },
];