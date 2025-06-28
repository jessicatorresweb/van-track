import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function AuthButton({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary',
  disabled = false 
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={isPrimary ? '#ffffff' : '#2563eb'} 
            style={styles.spinner}
          />
        )}
        <Text style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
          (disabled || loading) && styles.disabledButtonText,
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#2563eb',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});