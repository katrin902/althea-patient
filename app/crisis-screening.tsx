import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

const questions = [
  { id: 'q1', text: 'Are you currently in a situation where you feel physically unsafe?' },
  { id: 'q2', text: 'Have you had thoughts of harming yourself or others in the past 24 hours?' },
  { id: 'q3', text: 'Are you currently experiencing a mental health crisis that needs immediate attention?' },
];

export default function CrisisScreeningScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | null>>({
    q1: null, q2: null, q3: null,
  });

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const anyYes = Object.values(answers).some((a) => a === 'yes');

  function handleContinue() {
    if (anyYes) {
      // Crisis detected - show crisis resources
      return;
    }
    router.push('/intake-chat');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={4} total={8} label="Step 4 of 8: Safety check" />

        <Text style={styles.title}>A few quick questions</Text>
        <Text style={styles.sub}>
          Before we continue, we need to check how you're doing right now. Please answer honestly.
        </Text>

        {questions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.text}</Text>
            <View style={styles.answerRow}>
              {(['yes', 'no'] as const).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                  style={[
                    styles.answerBtn,
                    answers[q.id] === opt && (opt === 'yes' ? styles.answerYesSelected : styles.answerNoSelected),
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.answerText,
                    answers[q.id] === opt && (opt === 'yes' ? styles.answerYesText : styles.answerNoText),
                  ]}>
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {anyYes && (
          <View style={styles.crisisCard}>
            <Text style={styles.crisisTitle}>You may need immediate support</Text>
            <Text style={styles.crisisBody}>
              Based on your answers, we recommend contacting support now. Althea cannot help in emergencies.
            </Text>
            <TouchableOpacity style={styles.emergencyBtn} onPress={() => Linking.openURL('tel:112')}>
              <Text style={styles.emergencyBtnText}>Call 112 — Emergency Services</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.preventionBtn} onPress={() => Linking.openURL('tel:08000113')}>
              <Text style={styles.preventionBtnText}>113 Suicide Prevention — 0800 0113</Text>
            </TouchableOpacity>
            <Button
              label="I am safe now, continue"
              onPress={() => router.push('/intake-chat')}
              variant="ghost"
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {!anyYes && (
          <Button
            label="Continue to intake"
            onPress={handleContinue}
            disabled={!allAnswered}
            style={styles.cta}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: { ...typography.body, lineHeight: 24 },
  answerRow: { flexDirection: 'row', gap: 10 },
  answerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  answerYesSelected: { borderColor: colors.danger, backgroundColor: colors.crisisBackground },
  answerNoSelected: { borderColor: colors.success, backgroundColor: '#F0FDF4' },
  answerText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  answerYesText: { color: colors.danger },
  answerNoText: { color: colors.success },
  crisisCard: {
    backgroundColor: colors.crisisBackground,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.crisisBorder,
  },
  crisisTitle: { fontSize: 17, fontWeight: '700', color: colors.crisisText },
  crisisBody: { ...typography.body, color: colors.crisisText, lineHeight: 22 },
  emergencyBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emergencyBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  preventionBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  preventionBtnText: { color: colors.danger, fontWeight: '600', fontSize: 15 },
  cta: { marginTop: 8 },
});
