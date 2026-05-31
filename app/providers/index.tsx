import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProviderCard } from '../../components/providers/ProviderCard';
import { recommendedProviders, mockProviders } from '../../data/mockProviders';
import { useApp } from '../../context/AppContext';

export default function ProviderRecommendationsScreen() {
  const router = useRouter();
  useApp(); // context available if needed
  const [showAll, setShowAll] = useState(false);
  const displayProviders = showAll ? mockProviders.filter((p) => p.acceptingPatients) : recommendedProviders;

  function handleChoose(providerId: string) {
    router.push({ pathname: '/providers/confirm', params: { id: providerId } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={7} total={8} label="Step 7 of 8: Choose a provider" />

        <View style={styles.header}>
          <Text style={styles.title}>Recommended providers</Text>
          <Text style={styles.sub}>
            Based on your intake, location, insurance, and preferences, these providers may be suitable for you.
          </Text>
        </View>

        <TouchableOpacity style={styles.mapBtn} onPress={() => router.push('/providers/map')} activeOpacity={0.8}>
          <Text style={styles.mapBtnText}>View on map</Text>
        </TouchableOpacity>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Ranked by: urgency · wait time · symptom fit · insurance</Text>
        </View>

        {displayProviders.map((provider, i) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            rank={i + 1}
            onViewProfile={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })}
            onChoose={() => handleChoose(provider.id)}
          />
        ))}

        {!showAll && (
          <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showAllBtn}>
            <Text style={styles.showAllText}>View all suitable providers</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to choose</Text>
          <Text style={styles.infoBody}>
            Consider waiting time, your insurance, available languages, and the provider's specializations. Viewing the full profile can help you decide.
          </Text>
          <Text style={[styles.infoBody, { marginTop: 6 }]}>
            You can change your provider later if needed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  header: { gap: 8 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  mapBtn: {
    backgroundColor: colors.surface, borderRadius: radius.full,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: colors.primary,
  },
  mapBtnText: { color: colors.primary, fontWeight: '600', fontSize: 15 },
  filterRow: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 10 },
  filterLabel: { fontSize: 12, color: colors.primaryDark },
  showAllBtn: { alignItems: 'center', paddingVertical: 12 },
  showAllText: { color: colors.primary, fontWeight: '600', fontSize: 15, textDecorationLine: 'underline' },
  infoCard: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, gap: 4,
  },
  infoTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  infoBody: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
