import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';
import { Truck, ArrowLeft } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validateForm()) return;
    
    await login(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          alwaysBounceVertical={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Truck size={28} color="#2563eb" />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your van inventory
            </Text>
          </View>

          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo Account</Text>
            <Text style={styles.demoText}>Email: demo@example.com</Text>
            <Text style={styles.demoText}>Password: password</Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={formErrors.email}
            />

            <AuthInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              isPassword
              autoComplete="password"
              error={formErrors.password}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <AuthButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <AuthButton
              title="Create New Account"
              onPress={() => router.push('/auth/signup')}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: screenHeight * 0.9, // Ensure content is scrollable
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBackground: {
    width: 64,
    height: 64,
    backgroundColor: '#eff6ff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  demoCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 6,
  },
  demoText: {
    fontSize: 13,
    color: '#92400e',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  form: {
    // Remove flex: 1 to allow natural content sizing
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 16,
    fontWeight: '500',
  },
});