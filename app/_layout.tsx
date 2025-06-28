import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Handle navigation based on authentication state
  useEffect(() => {
    if (loading) return; // Don't navigate while loading

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth screens, redirect to welcome
      router.replace('/auth/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still in auth screens, redirect to main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return null; // Show splash screen while loading
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/welcome" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}