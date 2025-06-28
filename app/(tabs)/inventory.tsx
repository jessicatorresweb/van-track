import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { InventoryCard } from '@/components/InventoryCard';
import { InventoryItem, ITEM_CATEGORIES, UNITS } from '@/types/inventory';
import { Search, Filter, CreditCard as Edit, Trash2, X } from 'lucide-react-native';

export default function Inventory() {
  const { items, adjustStock, deleteItem, updateItem } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    await updateItem(editingItem.id, editingItem);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Item</Text>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        {editingItem && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={editingItem.name}
                onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                placeholder="Enter item name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Stock</Text>
              <TextInput
                style={styles.input}
                value={editingItem.currentStock.toString()}
                onChangeText={(text) => setEditingItem({ ...editingItem, currentStock: parseInt(text) || 0 })}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Stock</Text>
              <TextInput
                style={styles.input}
                value={editingItem.minStock.toString()}
                onChangeText={(text) => setEditingItem({ ...editingItem, minStock: parseInt(text) || 0 })}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maximum Stock</Text>
              <TextInput
                style={styles.input}
                value={editingItem.maxStock.toString()}
                onChangeText={(text) => setEditingItem({ ...editingItem, maxStock: parseInt(text) || 0 })}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editingItem.location}
                onChangeText={(text) => setEditingItem({ ...editingItem, location: text })}
                placeholder="Enter location"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                value={editingItem.price.toString()}
                onChangeText={(text) => setEditingItem({ ...editingItem, price: parseFloat(text) || 0 })}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => {
                  handleDeleteItem(editingItem.id);
                  setShowEditModal(false);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>{items.length} items in stock</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === 'all' && styles.activeFilterChip
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[
                styles.filterChipText,
                selectedCategory === 'all' && styles.activeFilterChipText
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {ITEM_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategory === category.id && styles.activeFilterChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category.id && styles.activeFilterChipText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.inventoryList}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add some items to get started'}
            </Text>
          </View>
        ) : (
          filteredItems.map(item => (
            <InventoryCard
              key={item.id}
              item={item}
              onAdjustStock={adjustStock}
              onPress={() => handleEditItem(item)}
            />
          ))
        )}
      </ScrollView>

      {renderEditModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#1e293b',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  inventoryList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  modalActions: {
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});