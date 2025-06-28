import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AuthButton } from './AuthButton';
import { LogOut, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface SignOutConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SignOutConfirmation({ 
  visible, 
  onConfirm, 
  onCancel, 
  loading = false 
}: SignOutConfirmationProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <LogOut size={32} color="#dc2626" />
            </View>
          </View>
          
          <Text style={styles.title}>Sign Out</Text>
          
          <View style={styles.warningContainer}>
            <AlertTriangle size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              This will clear all your local data
            </Text>
          </View>
          
          <Text style={styles.message}>
            Are you sure you want to sign out? You'll need to sign in again to access your inventory.
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.confirmButtonLoading]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Signing Out...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#fef2f2',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonLoading: {
    opacity: 0.7,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});