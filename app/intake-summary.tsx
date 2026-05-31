import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { mockIntakeSummary } from '../data/mockIntake';

export default function IntakeSummaryScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [summary, setSummary] = useState(mockIntakeSummary);
  const [isEditing, setIsEditing] = useState(false);
  const [approved, setApproved] = useState(false);

  function handleApprove() {
    dispatch({ type: 'SET_INTAKE_SUMMARY_APPROVED', payload: true });
    setApproved(true);
    router.push('/gp-referral');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Your intake summary</Text>
          <Text style={styles.sub}>
            Althea has prepared this summary based on your answers. Please review it carefully before sharing it with a provider.
          </Text>
        </View>

        <View style={styles.infoNote}>
          <Text style={styles.infoNoteText}>
            This summary will only be shared with your chosen provider after you give approval. You can edit it below or ask Althea to revise it.
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <Text style={styles.editLabel}>Editing your summary</Text>
            <TextInput
              style={styles.editInput}
              value={summary}
              onChangeText={setSummary}
              multiline
              textAlignVertical="top"
            />
            <Button label="Done editing" onPress={() => setIsEditing(false)} style={{ marginTop: 8 }} />
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!isEditing && (
            <Button
              label="Edit summary"
              onPress={() => setIsEditing(true)}
              variant="secondary"
            />
          )}
          <Button
            label="Approve and continue"
            onPress={handleApprove}
          />
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            By approving, you allow Althea to prepare this summary for sharing with your chosen provider. You can withdraw this at any time in your settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  headerCard: { gap: 8 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  infoNote: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 14,
  },
  infoNoteText: { fontSize: 14, color: colors.primaryDark, lineHeight: 20 },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: { ...typography.body, lineHeight: 26, color: colors.text },
  editContainer: { gap: 8 },
  editLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  editInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    minHeight: 300,
    borderWidth: 1,
    borderColor: colors.primary,
    lineHeight: 24,
  },
  actions: { gap: 10 },
  privacyNote: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 14,
  },
  privacyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
