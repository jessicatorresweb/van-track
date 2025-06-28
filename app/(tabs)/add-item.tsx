import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventory } from '@/hooks/useInventory';
import { UNITS, VAN_SIDES, VAN_BAYS } from '@/types/inventory';
import { Plus, Camera, Check, ChevronDown } from 'lucide-react-native';

export default function AddItem() {
  const { addItem } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    currentStock: 0,
    minStock: 0,
    unit: 'pieces',
    vanSide: '',
    vanBay: '',
    supplier: '',
    barcode: '',
  });

  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showVanSidePicker, setShowVanSidePicker] = useState(false);
  const [showVanBayPicker, setShowVanBayPicker] = useState(false);

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

    if (!formData.vanSide) {
      Alert.alert('Error', 'Please select which side of the van');
      return;
    }

    if (!formData.vanBay) {
      Alert.alert('Error', 'Please select a bay/compartment');
      return;
    }

    try {
      // Combine van side and bay into location string
      const selectedSide = VAN_SIDES.find(side => side.id === formData.vanSide);
      const selectedBay = VAN_BAYS.find(bay => bay.id === formData.vanBay);
      const location = `${selectedSide?.name} - ${selectedBay?.name}`;

      const itemData = {
        name: formData.name,
        partNumber: formData.partNumber,
        currentStock: formData.currentStock,
        minStock: formData.minStock,
        unit: formData.unit,
        location: location,
        supplier: formData.supplier,
        barcode: formData.barcode,
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
      vanSide: '',
      vanBay: '',
      supplier: '',
      barcode: '',
    });
  };

  const selectedVanSide = VAN_SIDES.find(side => side.id === formData.vanSide);
  const selectedVanBay = VAN_BAYS.find(bay => bay.id === formData.vanBay);

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
              <ChevronDown size={16} color="#64748b" />
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

        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Van Location *</Text>
          <Text style={styles.sectionSubtitle}>
            Specify where this item is stored in your van
          </Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Van Side</Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerInput]}
                onPress={() => setShowVanSidePicker(!showVanSidePicker)}
              >
                <Text style={formData.vanSide ? styles.selectedText : styles.placeholderText}>
                  {selectedVanSide ? selectedVanSide.name : 'Select side'}
                </Text>
                <ChevronDown size={16} color="#64748b" />
              </TouchableOpacity>
              {showVanSidePicker && (
                <View style={styles.pickerContainer}>
                  {VAN_SIDES.map(side => (
                    <TouchableOpacity
                      key={side.id}
                      style={[
                        styles.pickerOption,
                        formData.vanSide === side.id && styles.selectedOption
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, vanSide: side.id });
                        setShowVanSidePicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{side.name}</Text>
                      {formData.vanSide === side.id && (
                        <Check size={16} color="#2563eb" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, styles.flex]}>
              <Text style={styles.label}>Bay/Compartment</Text>
              <TouchableOpacity
                style={[styles.input, styles.pickerInput]}
                onPress={() => setShowVanBayPicker(!showVanBayPicker)}
              >
                <Text style={formData.vanBay ? styles.selectedText : styles.placeholderText}>
                  {selectedVanBay ? selectedVanBay.name : 'Select bay'}
                </Text>
                <ChevronDown size={16} color="#64748b" />
              </TouchableOpacity>
              {showVanBayPicker && (
                <View style={styles.pickerContainer}>
                  <ScrollView style={styles.pickerScrollView} nestedScrollEnabled>
                    {VAN_BAYS.map(bay => (
                      <TouchableOpacity
                        key={bay.id}
                        style={[
                          styles.pickerOption,
                          formData.vanBay === bay.id && styles.selectedOption
                        ]}
                        onPress={() => {
                          setFormData({ ...formData, vanBay: bay.id });
                          setShowVanBayPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{bay.name}</Text>
                        {formData.vanBay === bay.id && (
                          <Check size={16} color="#2563eb" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {formData.vanSide && formData.vanBay && (
            <View style={styles.locationPreview}>
              <Text style={styles.locationPreviewLabel}>Location Preview:</Text>
              <Text style={styles.locationPreviewText}>
                {selectedVanSide?.name} - {selectedVanBay?.name}
              </Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    color: '#1e293b',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontStyle: 'italic',
  },
  locationSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  locationPreview: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  locationPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  locationPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
    position: 'relative',
    zIndex: 1000,
  },
  pickerScrollView: {
    maxHeight: 180,
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