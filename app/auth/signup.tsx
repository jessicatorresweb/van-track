import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AuthInput } from '@/components/AuthInput';
import { AuthButton } from '@/components/AuthButton';
import { Truck, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function Signup() {
  const router = useRouter();
  const { signup, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    console.log('Signup button clicked');
    setShowValidation(true);
    clearError();
    
    if (!validateForm()) {
      console.log('Form validation failed:', formErrors);
      Alert.alert('Validation Error', 'Please fix the errors in the form before continuing.');
      return;
    }
    
    console.log('Form is valid, attempting signup...');
    try {
      await signup(formData);
      console.log('Signup successful');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (showValidation && formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '#e2e8f0' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[Math.min(strength - 1, 4)] || '',
      color: colors[Math.min(strength - 1, 4)] || '#e2e8f0',
    };
  };

  const passwordStrength = getPasswordStrength();

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join thousands of tradesmen managing their inventory efficiently
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoComplete="name"
              error={showValidation ? formErrors.name : undefined}
            />

            <AuthInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={showValidation ? formErrors.email : undefined}
            />

            <View style={styles.passwordContainer}>
              <AuthInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Create a strong password"
                isPassword
                autoComplete="new-password"
                error={showValidation ? formErrors.password : undefined}
              />
              {formData.password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthFill, 
                        { 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            <AuthInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              isPassword
              autoComplete="new-password"
              error={showValidation ? formErrors.confirmPassword : undefined}
            />

            <AuthInput
              label="Company Name (Optional)"
              value={formData.company}
              onChangeText={(value) => handleInputChange('company', value)}
              placeholder="Your company or business name"
              autoCapitalize="words"
            />

            <AuthInput
              label="Phone Number (Optional)"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
              autoComplete="tel"
              error={showValidation ? formErrors.phone : undefined}
            />

            <View style={styles.termsContainer}>
              <CheckCircle size={16} color="#16a34a" />
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {showValidation && Object.keys(formErrors).length > 0 && (
              <View style={styles.validationSummary}>
                <Text style={styles.validationTitle}>Please fix the following errors:</Text>
                {Object.values(formErrors).map((error, index) => (
                  <Text key={index} style={styles.validationError}>• {error}</Text>
                ))}
              </View>
            )}

            <AuthButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
            />

            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>
                Already have an account?{' '}
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </Text>
            </View>
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
    minHeight: screenHeight * 1.2,
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
    paddingHorizontal: 16,
  },
  form: {
    // Remove flex: 1 to allow natural content sizing
  },
  passwordContainer: {
    marginBottom: 20,
  },
  passwordStrength: {
    marginTop: -12,
    marginBottom: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 6,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },
  termsLink: {
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
  validationSummary: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  validationError: {
    fontSize: 13,
    color: '#92400e',
    marginBottom: 2,
  },
  loginPrompt: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 15,
    color: '#64748b',
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 15,
  },
});