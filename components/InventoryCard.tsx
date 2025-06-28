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
          <Text style={styles.partNumber}>Part #: {item.partNumber}</Text>
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
        <View style={styles.stockRow}>
          <Text style={styles.stockLabel}>Low Stock Alert:</Text>
          <Text style={styles.limitText}>{item.minStock} {item.unit}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Supplier:</Text>
          <Text style={styles.detailText}>{item.supplier}</Text>
        </View>
        {item.barcode && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Barcode:</Text>
            <Text style={styles.detailText}>{item.barcode}</Text>
          </View>
        )}
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
  partNumber: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontFamily: 'monospace',
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
    marginBottom: 6,
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
  limitText: {
    fontSize: 14,
    color: '#64748b',
  },
  details: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
    textAlign: 'right',
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