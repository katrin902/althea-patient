import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const steps = [
  { num: '1', label: 'Chat with\nour AI' },
  { num: '2', label: 'We assess\nyour situation' },
  { num: '3', label: 'You get your\nresult & advice' },
  { num: '4', label: 'We help you get\nan appointment' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [state.isAuthenticated]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>Althea</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.headline}>Your first step{'\n'}toward feeling better.</Text>
          <Text style={styles.sub}>
            Chat with our AI to understand how you're feeling. We'll assess your situation and
            help you get the right support, as soon as possible.
          </Text>
        </View>

        <TouchableOpacity style={styles.startCard} onPress={() => router.push('/ai-intake')} activeOpacity={0.85}>
          <View style={styles.startIcon}>
            <Text style={styles.startIconText}>💬</Text>
          </View>
          <View style={styles.startTextBlock}>
            <Text style={styles.startTitle}>Start a conversation</Text>
            <Text style={styles.startSub}>Answer a few questions so we can understand you better.</Text>
          </View>
        </TouchableOpacity>

        <Button
          label="Start my assessment"
          onPress={() => router.push('/ai-intake')}
          style={styles.cta}
        />

        <View style={styles.howItWorks}>
          <Text style={styles.howTitle}>How it works</Text>
          <View style={styles.stepsRow}>
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <View style={styles.stepItem}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>{step.num}</Text>
                  </View>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                </View>
                {i < steps.length - 1 && <View style={styles.stepArrow}><Text style={styles.arrow}>→</Text></View>}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.importantCard}>
          <Text style={styles.importantIcon}>🛡</Text>
          <View style={styles.importantText}>
            <Text style={styles.importantTitle}>Important</Text>
            <Text style={styles.importantBody}>
              Althea is not a replacement for professional care. If you are in danger, please call your local emergency number.
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Log in</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipDemoBtn}
          onPress={() => {
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            router.replace('/(tabs)' as any);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipDemoText}>Skip to demo →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 24 },
  header: { alignItems: 'center', paddingVertical: 8 },
  logo: { fontSize: 42, fontWeight: '800', color: colors.primary, letterSpacing: -1 },
  hero: { gap: 12 },
  headline: { fontSize: 28, fontWeight: '700', color: colors.text, lineHeight: 36 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  startCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  startIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startIconText: { fontSize: 22 },
  startTextBlock: { flex: 1 },
  startTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  startSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  cta: { marginTop: -8 },
  howItWorks: { gap: 16 },
  howTitle: { ...typography.h4, color: colors.text },
  stepsRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', flex: 1, gap: 8 },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { color: colors.white, fontWeight: '700', fontSize: 15 },
  stepLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', lineHeight: 15 },
  stepArrow: { paddingTop: 8, paddingHorizontal: 2 },
  arrow: { color: colors.textMuted, fontSize: 14 },
  importantCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  importantIcon: { fontSize: 20, marginTop: 2 },
  importantText: { flex: 1, gap: 3 },
  importantTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  importantBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginLinkText: { fontSize: 14, color: colors.textSecondary },
  loginLinkBold: { color: colors.primary, fontWeight: '600' },
  skipDemoBtn: { alignItems: 'center', paddingVertical: 6 },
  skipDemoText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
});
