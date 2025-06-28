import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InventoryItem, StockAlert } from '@/types/inventory';

const STORAGE_KEY = '@van_inventory';
const ALERTS_KEY = '@van_alerts';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [itemsData, alertsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ALERTS_KEY)
      ]);

      if (itemsData) {
        const parsedItems = JSON.parse(itemsData);
        setItems(parsedItems);
        generateAlerts(parsedItems);
      }

      if (alertsData) {
        setAlerts(JSON.parse(alertsData));
      }
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Load inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveInventory = async (newItems: InventoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
      generateAlerts(newItems);
    } catch (err) {
      setError('Failed to save inventory');
      console.error('Save inventory error:', err);
    }
  };

  const generateAlerts = (items: InventoryItem[]) => {
    const newAlerts: StockAlert[] = [];
    const timestamp = new Date().toISOString();

    items.forEach(item => {
      if (item.currentStock === 0) {
        newAlerts.push({
          id: `${item.id}-out`,
          itemId: item.id,
          type: 'out',
          message: `${item.name} (${item.partNumber}) is out of stock`,
          timestamp,
        });
      } else if (item.currentStock <= item.minStock) {
        newAlerts.push({
          id: `${item.id}-low`,
          itemId: item.id,
          type: 'low',
          message: `${item.name} (${item.partNumber}) is running low (${item.currentStock} ${item.unit} remaining)`,
          timestamp,
        });
      }
    });

    setAlerts(newAlerts);
    AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
  };

  const addItem = async (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastRestocked: new Date().toISOString(),
    };

    const newItems = [...items, newItem];
    await saveInventory(newItems);
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    await saveInventory(newItems);
  };

  const deleteItem = async (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    await saveInventory(newItems);
  };

  const adjustStock = async (id: string, adjustment: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newStock = Math.max(0, item.currentStock + adjustment);
    const updates: Partial<InventoryItem> = {
      currentStock: newStock,
    };

    if (adjustment > 0) {
      updates.lastRestocked = new Date().toISOString();
    }

    await updateItem(id, updates);
  };

  const getLowStockItems = () => {
    return items.filter(item => item.currentStock <= item.minStock);
  };

  const getOutOfStockItems = () => {
    return items.filter(item => item.currentStock === 0);
  };

  const getTotalValue = () => {
    // Since we removed price field, we'll return 0 for now
    // This can be updated if you want to add pricing back later
    return 0;
  };

  const clearAlerts = async () => {
    setAlerts([]);
    await AsyncStorage.removeItem(ALERTS_KEY);
  };

  return {
    items,
    alerts,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    adjustStock,
    getLowStockItems,
    getOutOfStockItems,
    getTotalValue,
    clearAlerts,
    refreshInventory: loadInventory,
  };
}