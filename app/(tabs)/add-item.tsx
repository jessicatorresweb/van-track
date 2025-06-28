import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { ITEM_CATEGORIES, UNITS } from '@/types/inventory';
import { Plus, Camera, Check } from 'lucide-react-native';

export default function AddItem() {
  const { addItem } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'pieces',
    location: '',
    price: 0,
    supplier: '',
    description: '',
    barcode: '',
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (formData.minStock > formData.maxStock) {
      Alert.alert('Error', 'Minimum stock cannot be greater than maximum stock');
      return;
    }

    try {
      await addItem(formData);
      Alert.alert('Success', 'Item added successfully', [
        { text: 'OK', onPress: resetForm }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: 'pieces',
      location: '',
      price: 0,
      supplier: '',
      description: '',
      barcode: '',
    });
  };

  const selectedCategory = ITEM_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Item</Text>
        <Text style={styles.subtitle}>Add items to your van inventory</Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter item name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerInput]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={formData.category ? styles.selectedText : styles.placeholderText}>
              {selectedCategory ? selectedCategory.name : 'Select category'}
            </Text>
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.pickerContainer}>
              {ITEM_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.pickerOption,
                    formData.category === category.id && styles.selectedOption
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, category: category.id });
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.pickerOptionText}>{category.name}</Text>
                  {formData.category === category.id && (
                    <Check size={16} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Current Stock</Text>
            <TextInput
              style={styles.input}
              value={formData.currentStock.toString()}
              onChangeText={(text) => setFormData({ ...formData, currentStock: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Unit</Text>
            <TouchableOpacity
              style={[styles.input, styles.pickerInput]}
              onPress={() => setShowUnitPicker(!showUnitPicker)}
            >
              <Text style={styles.selectedText}>{formData.unit}</Text>
            </TouchableOpacity>
            {showUnitPicker && (
              <View style={styles.pickerContainer}>
                {UNITS.map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.pickerOption,
                      formData.unit === unit && styles.selectedOption
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, unit });
                      setShowUnitPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{unit}</Text>
                    {formData.unit === unit && (
                      <Check size={16} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Min Stock</Text>
            <TextInput
              style={styles.input}
              value={formData.minStock.toString()}
              onChangeText={(text) => setFormData({ ...formData, minStock: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Max Stock</Text>
            <TextInput
              style={styles.input}
              value={formData.maxStock.toString()}
              onChangeText={(text) => setFormData({ ...formData, maxStock: parseInt(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price.toString()}
              onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Van location"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Supplier</Text>
          <TextInput
            style={styles.input}
            value={formData.supplier}
            onChangeText={(text) => setFormData({ ...formData, supplier: text })}
            placeholder="Supplier name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Additional notes or description"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Barcode</Text>
          <View style={styles.barcodeContainer}>
            <TextInput
              style={[styles.input, styles.barcodeInput]}
              value={formData.barcode}
              onChangeText={(text) => setFormData({ ...formData, barcode: text })}
              placeholder="Scan or enter barcode"
            />
            <TouchableOpacity style={styles.scanButton}>
              <Camera size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.submitButtonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  form: {
    flex: 1,
    paddingHorizontal: 20,
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  pickerInput: {
    justifyContent: 'center',
  },
  selectedText: {
    color: '#1e293b',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedOption: {
    backgroundColor: '#f8fafc',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  barcodeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  barcodeInput: {
    flex: 1,
  },
  scanButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});