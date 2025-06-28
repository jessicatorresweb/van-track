import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({ label, error, isPassword, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#94a3b8"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color="#64748b" />
            ) : (
              <Eye size={20} color="#64748b" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
  },
});