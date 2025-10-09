import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const checkTokens = async () => {
      try {
        const patientToken = await AsyncStorage.getItem('patientToken');
        const doctorToken = await AsyncStorage.getItem('doctorToken');

        // If both tokens exist — clear both
        if (patientToken && doctorToken) {
          await AsyncStorage.removeItem('patientToken');
          await AsyncStorage.removeItem('doctorToken');
          return; // Stay where they are
        }

        // If only patientToken is present
        if (patientToken && !doctorToken) {
          router.replace("/(patient)/home");
          return;
        }

        // If only doctorToken is present
        if (doctorToken && !patientToken) {
          router.replace("/(doctor)/appointments");
          return;
        }

        // If none exist — stay where they are
      } catch (error) {
        console.error('Error checking tokens:', error);
      }
    };

    checkTokens();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false, // 🚫 Removes top header + back button
        }}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
