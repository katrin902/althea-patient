import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants/theme';
import { Provider } from '../../data/mockProviders';
import { Button } from '../ui/Button';

interface Props {
  provider: Provider;
  rank?: number;
  onViewProfile: () => void;
  onChoose: () => void;
}

export function ProviderCard({ provider, rank, onViewProfile, onChoose }: Props) {
  return (
    <View style={styles.card}>
      {rank && (
        <View style={styles.rankRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{rank} Recommended</Text>
          </View>
          {provider.studentExperience && (
            <View style={styles.studentBadge}>
              <Text style={styles.studentText}>Student experience</Text>
            </View>
          )}
        </View>
      )}

      <Text style={styles.name}>{provider.name}</Text>
      <Text style={styles.type}>{provider.type} · {provider.city}</Text>

      <View style={styles.metaRow}>
        <MetaChip icon="⏱" label={`Wait: ${provider.waitingTime}`} />
        <MetaChip icon="📍" label={provider.distance} />
        {provider.onlineAvailable && <MetaChip icon="💻" label="Online" />}
      </View>

      <View style={styles.tagRow}>
        {provider.specializations.slice(0, 3).map((s) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={styles.langInsurance}>
        <Text style={styles.meta}>Languages: {provider.languages.join(', ')}</Text>
        <Text style={styles.meta}>Insurance: {provider.insurance.slice(0, 3).join(', ')}{provider.insurance.length > 3 ? ' +more' : ''}</Text>
      </View>

      {provider.recommendationReason && (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonText}>{provider.recommendationReason}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onViewProfile} style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View profile</Text>
        </TouchableOpacity>
        <Button label="Choose this provider" onPress={onChoose} size="md" style={styles.chooseBtn} />
      </View>
    </View>
  );
}

function MetaChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={metaStyles.chip}>
      <Text style={metaStyles.text}>{icon} {label}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: { fontSize: 12, color: colors.primary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  rankRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  rankBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  rankText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  studentBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  studentText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  name: { ...typography.h4, color: colors.text },
  type: { ...typography.caption, color: colors.textSecondary },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 12, color: colors.textSecondary },
  langInsurance: { gap: 2 },
  meta: { ...typography.small, color: colors.textSecondary },
  reasonBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 10,
  },
  reasonText: { fontSize: 13, color: colors.primaryDark, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 },
  viewBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  viewBtnText: { color: colors.primary, fontWeight: '600', fontSize: 15 },
  chooseBtn: { flex: 1 },
});
