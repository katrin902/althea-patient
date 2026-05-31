import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../context/AppContext';
import { EmergencyButton } from '../components/ui/EmergencyButton';
import { colors } from '../constants/theme';

function SafeWrapper({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const { width, height } = useWindowDimensions();

  // On desktop browsers: render the app centred inside a phone-shaped frame.
  // On real phones (width ≤ 430 px CSS px) or native: full-screen as usual.
  const isDesktop = Platform.OS === 'web' && width > 430;

  const appContent = (
    <>
      {children}
      {state.isAuthenticated && <EmergencyButton />}
    </>
  );

  if (!isDesktop) {
    return <View style={{ flex: 1 }}>{appContent}</View>;
  }

  return (
    <View style={desktop.bg}>
      <View
        style={[
          desktop.frame,
          // Cap frame height to the actual viewport so nothing is clipped
          { height: Math.min(844, height) } as any,
          // boxShadow is a valid React Native Web style property
          {
            boxShadow:
              '0 0 0 10px #22223a, 0 0 0 11px #2e2e50, 0 40px 100px rgba(0,0,0,0.7)',
          } as any,
        ]}
      >
        {appContent}
      </View>
    </View>
  );
}

const desktop = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#12121f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 390,
    // height is set dynamically above (min of 844 and viewport height)
    borderRadius: 44,
    overflow: 'hidden',
  },
});

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
