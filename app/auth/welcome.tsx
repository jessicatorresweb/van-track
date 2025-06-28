import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthButton } from '@/components/AuthButton';
import { Truck, Package, ChartBar as BarChart3, Shield } from 'lucide-react-native';

const { width, height: screenHeight } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  const features = [
    {
      icon: <Package size={24} color="#2563eb" />,
      title: 'Smart Inventory',
      description: 'Track all your tools and materials in one place',
    },
    {
      icon: <BarChart3 size={24} color="#16a34a" />,
      title: 'Stock Alerts',
      description: 'Never run out of essential items again',
    },
    {
      icon: <Shield size={24} color="#7c3aed" />,
      title: 'Secure & Reliable',
      description: 'Your data is safe and always accessible',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Truck size={48} color="#2563eb" />
            </View>
          </View>
          
          <Text style={styles.title}>Van Inventory</Text>
          <Text style={styles.subtitle}>
            The complete inventory management solution for tradesmen
          </Text>
        </View>

        <View style={styles.heroImage}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageText}>Organize Your Mobile Workshop</Text>
          </View>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <AuthButton
            title="Get Started"
            onPress={() => router.push('/auth/signup')}
          />
          
          <AuthButton
            title="I Already Have an Account"
            onPress={() => router.push('/auth/login')}
            variant="secondary"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Trusted by over 10,000+ tradesmen worldwide
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: screenHeight * 0.95, // Ensure content is scrollable
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    backgroundColor: '#eff6ff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  heroImage: {
    position: 'relative',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  imageText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  actions: {
    gap: 16,
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});