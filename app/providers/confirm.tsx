import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { mockProviders } from '../../data/mockProviders';
import { useApp } from '../../context/AppContext';

const consentItems = [
  { id: 'intake', label: 'Share my intake summary with this provider' },
  { id: 'documents', label: 'Share my uploaded documents with this provider' },
  { id: 'checkins', label: 'Allow this provider to view my check-ins and mood data' },
  { id: 'crisis', label: 'Alert this provider if Althea detects a crisis in my messages' },
];

export default function ConfirmProviderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const provider = mockProviders.find((p) => p.id === id);
  const [consents, setConsents] = useState<Record<string, boolean>>({
    intake: true, documents: true, checkins: true, crisis: true,
  });

  if (!provider) return null;

  // Check if this is an existing request
  const existingRequest = state.providerRequests.find((r) => r.providerId === id);

  function toggleConsent(key: string) {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleConfirm() {
    if (!existingRequest) {
      // Add as a new pending request
      dispatch({
        type: 'ADD_PROVIDER_REQUEST',
        payload: {
          providerId: provider!.id,
          providerName: provider!.name,
          status: 'pending',
          requestedAt: new Date().toISOString().split('T')[0],
        },
      });
    }
    dispatch({ type: 'SET_CURRENT_STATUS', payload: 'provider_selected' });
    dispatch({ type: 'SET_CRISIS_CONSENT', payload: consents.crisis });

    // Route back to providers — intake already completed in demo
    router.push('/(tabs)/providers' as any);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmIcon}>
          <Text style={styles.confirmIconText}>📨</Text>
        </View>

        <Text style={styles.title}>Send request to provider</Text>
        <Text style={styles.sub}>
          Your intake summary and selected information will be shared with{' '}
          <Text style={styles.bold}>{provider.name}</Text>. They will review your request and
          respond within 3–5 working days.
        </Text>

        <View style={styles.providerCard}>
          <View style={styles.providerLogo}>
            <Text style={styles.providerLogoText}>{provider.name.charAt(0)}</Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerMeta}>{provider.type} · {provider.city}</Text>
            <Text style={styles.providerMeta}>Waiting time: {provider.waitingTime}</Text>
          </View>
        </View>

        {/* You can request multiple providers */}
        <View style={styles.multiNote}>
          <Text style={styles.multiNoteText}>
            💡 You can request multiple providers at the same time. Once a provider accepts, they
            become your primary provider.
          </Text>
        </View>

        <View style={styles.consentSection}>
          <Text style={styles.consentTitle}>What you're sharing</Text>
          <Text style={styles.consentSub}>
            Choose what information this provider can access. You can change these settings later.
          </Text>
          {consentItems.map((item) => (
            <View key={item.id} style={styles.consentRow}>
              <View
                style={[styles.checkbox, consents[item.id] && styles.checkboxChecked]}
                onTouchEnd={() => toggleConsent(item.id)}
              >
                {consents[item.id] && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.consentLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legalNote}>
          <Text style={styles.legalText}>
            By confirming, you consent to Althea sharing the selected information with{' '}
            {provider.name}. You can withdraw consent at any time. Althea complies with GDPR and
            Dutch healthcare privacy requirements.
          </Text>
        </View>

        <Button label="Send request" onPress={handleConfirm} />
        <Button label="Go back" onPress={() => router.back()} variant="ghost" style={{ marginTop: 4 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  confirmIcon: { alignItems: 'center', marginBottom: 4 },
  confirmIconText: { fontSize: 48 },
  title: { ...typography.h2, textAlign: 'center' },
  sub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  bold: { fontWeight: '700', color: colors.text },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: 16, borderWidth: 1.5, borderColor: colors.primary,
  },
  providerLogo: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  providerLogoText: { fontSize: 22, fontWeight: '800', color: colors.primary },
  providerInfo: { flex: 1, gap: 3 },
  providerName: { fontSize: 16, fontWeight: '700', color: colors.text },
  providerMeta: { fontSize: 13, color: colors.textSecondary },
  multiNote: {
    backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 12,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  multiNoteText: { fontSize: 13, color: colors.primaryDark, lineHeight: 18 },
  consentSection: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  consentTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  consentSub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  checkmark: { color: colors.white, fontWeight: '700', fontSize: 14 },
  consentLabel: { flex: 1, fontSize: 15, color: colors.text },
  legalNote: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 14,
  },
  legalText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, textAlign: 'center' },
});
