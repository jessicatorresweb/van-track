import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InventoryItem, ITEM_CATEGORIES } from '@/types/inventory';
import { TriangleAlert as AlertTriangle, Minus, Plus } from 'lucide-react-native';

interface InventoryCardProps {
  item: InventoryItem;
  onAdjustStock: (id: string, adjustment: number) => void;
  onPress?: () => void;
}

export function InventoryCard({ item, onAdjustStock, onPress }: InventoryCardProps) {
  const category = ITEM_CATEGORIES.find(cat => cat.id === item.category);
  const stockPercentage = (item.currentStock / item.maxStock) * 100;
  const isLowStock = item.currentStock <= item.minStock;
  const isOutOfStock = item.currentStock === 0;

  const getStockColor = () => {
    if (isOutOfStock) return '#dc2626';
    if (isLowStock) return '#ea580c';
    return '#16a34a';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: category?.color || '#64748b' }]}>
            <Text style={styles.categoryText}>{category?.name || 'Other'}</Text>
          </View>
        </View>
        {(isLowStock || isOutOfStock) && (
          <AlertTriangle size={20} color="#ea580c" />
        )}
      </View>

      <View style={styles.stockInfo}>
        <View style={styles.stockRow}>
          <Text style={styles.stockLabel}>Current Stock:</Text>
          <Text style={[styles.stockValue, { color: getStockColor() }]}>
            {item.currentStock} {item.unit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(stockPercentage, 100)}%`,
                backgroundColor: getStockColor()
              }
            ]} 
          />
        </View>
        <View style={styles.stockLimits}>
          <Text style={styles.limitText}>Min: {item.minStock}</Text>
          <Text style={styles.limitText}>Max: {item.maxStock}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>Location: {item.location}</Text>
        <Text style={styles.detailText}>Price: ${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.decrementButton]}
          onPress={() => onAdjustStock(item.id, -1)}
          disabled={item.currentStock === 0}
        >
          <Minus size={16} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.actionText}>Adjust Stock</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.incrementButton]}
          onPress={() => onAdjustStock(item.id, 1)}
        >
          <Plus size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  stockInfo: {
    marginBottom: 12,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
  stockLimits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitText: {
    fontSize: 12,
    color: '#64748b',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#ef4444',
  },
  incrementButton: {
    backgroundColor: '#16a34a',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
});