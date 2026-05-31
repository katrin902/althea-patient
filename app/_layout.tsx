import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../context/AppContext';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { colors } from '../constants/theme';

function SafeWrapper({ children }: { children: ReactNode }) {
  const { state } = useApp();
  return (
    <View style={{ flex: 1 }}>
      {children}
      {state.isAuthenticated && <EmergencyButton />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <SafeWrapper>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '600', color: colors.text },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="crisis-disclaimer" options={{ title: '', headerBackTitle: 'Back' }} />
          <Stack.Screen name="auth" options={{ title: 'Create account' }} />
          <Stack.Screen name="personal-details" options={{ title: 'Personal details' }} />
          <Stack.Screen name="current-situation" options={{ title: 'Your situation' }} />
          <Stack.Screen name="crisis-screening" options={{ title: 'A few quick questions' }} />
          <Stack.Screen name="intake-chat" options={{ title: 'Intake', headerBackVisible: false }} />
          <Stack.Screen name="intake-summary" options={{ title: 'Your summary' }} />
          <Stack.Screen name="gp-referral" options={{ title: 'GP referral' }} />
          <Stack.Screen name="referral-upload" options={{ title: 'Upload referral' }} />
          <Stack.Screen name="providers/index" options={{ title: 'Recommended providers' }} />
          <Stack.Screen name="providers/map" options={{ title: 'Map view' }} />
          <Stack.Screen name="providers/[id]" options={{ title: 'Provider profile' }} />
          <Stack.Screen name="providers/confirm" options={{ title: 'Choose provider' }} />
          <Stack.Screen
            name="institution-intake"
            options={{ title: 'Provider intake', headerBackVisible: false }}
          />
          <Stack.Screen name="education" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeWrapper>
    </AppProvider>
  );
}
