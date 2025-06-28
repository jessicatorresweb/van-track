import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { UNITS } from '@/types/inventory';
import { Plus, Camera, Check } from 'lucide-react-native';

export default function AddItem() {
  const { addItem } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    currentStock: 0,
    minStock: 0,
    unit: 'pieces',
    location: '',
    supplier: '',
    barcode: '',
  });

  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!formData.partNumber.trim()) {
      Alert.alert('Error', 'Please enter a part number');
      return;
    }

    if (!formData.supplier.trim()) {
      Alert.alert('Error', 'Please enter a supplier');
      return;
    }

    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter a van location');
      return;
    }

    try {
      // Add default category since it's still required in the data structure
      const itemData = {
        ...formData,
        category: 'other' // Default category
      };
      await addItem(itemData);
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
      partNumber: '',
      currentStock: 0,
      minStock: 0,
      unit: 'pieces',
      location: '',
      supplier: '',
      barcode: '',
    });
  };

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
          <Text style={styles.label}>Part Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.partNumber}
            onChangeText={(text) => setFormData({ ...formData, partNumber: text })}
            placeholder="Enter part number"
          />
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Low Stock Threshold *</Text>
          <TextInput
            style={styles.input}
            value={formData.minStock.toString()}
            onChangeText={(text) => setFormData({ ...formData, minStock: parseInt(text) || 0 })}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={styles.helperText}>
            You'll be alerted when stock falls to or below this level
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Supplier *</Text>
          <TextInput
            style={styles.input}
            value={formData.supplier}
            onChangeText={(text) => setFormData({ ...formData, supplier: text })}
            placeholder="Enter supplier name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Van Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="e.g., Shelf A, Drawer 2, Tool Box"
          />
          <Text style={styles.helperText}>
            Specify where this item is stored in your van
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Barcode (Optional)</Text>
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
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontStyle: 'italic',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
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