import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

const checklist = [
  'Explain your main mental health concern briefly',
  'Mention how long you have been experiencing it',
  'Say how it is affecting your daily life (work, study, sleep)',
  'Mention any previous treatment or diagnosis',
  'Ask specifically for a referral to a GGZ provider',
  'Ask about the difference between Basis GGZ and Specialistische GGZ',
  'Ask if there is anything you need to arrange before the referral',
];

export default function GPReferralScreen() {
  const router = useRouter();
  const [hasReferral, setHasReferral] = useState<boolean | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  function toggleCheck(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={5} total={8} label="Step 5 of 8: GP referral" />

        <Text style={styles.title}>Do you have a GP referral?</Text>
        <Text style={styles.sub}>
          Access to many public mental healthcare services in the Netherlands often starts with a referral from your GP (huisarts).
        </Text>

        <View style={styles.choiceRow}>
          <TouchableOpacity
            onPress={() => setHasReferral(true)}
            style={[styles.choiceBtn, hasReferral === true && styles.choiceBtnSelected]}
          >
            <Text style={[styles.choiceBtnText, hasReferral === true && styles.choiceBtnTextSelected]}>Yes, I have a referral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHasReferral(false)}
            style={[styles.choiceBtn, hasReferral === false && styles.choiceBtnSelected]}
          >
            <Text style={[styles.choiceBtnText, hasReferral === false && styles.choiceBtnTextSelected]}>No, I don't have one</Text>
          </TouchableOpacity>
        </View>

        {hasReferral === true && (
          <View style={styles.referralYes}>
            <Text style={styles.sectionTitle}>Great — you're one step ahead</Text>
            <Text style={styles.sectionBody}>
              You can upload your referral letter on the next screen. This will help us match you to suitable providers and speed up your intake.
            </Text>
            <Button label="Upload my referral" onPress={() => router.push('/referral-upload')} style={{ marginTop: 8 }} />
          </View>
        )}

        {hasReferral === false && (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>How to get a GP referral</Text>
              <Text style={styles.sectionBody}>
                Contact your GP and explain what you are experiencing. Your GP can refer you to:
              </Text>
              <View style={styles.typeRow}>
                <View style={styles.typeCard}>
                  <Text style={styles.typeName}>Basis GGZ</Text>
                  <Text style={styles.typeDesc}>For mild to moderate symptoms. Shorter waiting times.</Text>
                </View>
                <View style={styles.typeCard}>
                  <Text style={styles.typeName}>Specialistische GGZ</Text>
                  <Text style={styles.typeDesc}>For complex or severe conditions. Longer treatment programs.</Text>
                </View>
              </View>
            </View>

            <View style={styles.checklistCard}>
              <Text style={styles.sectionTitle}>What to say to your GP</Text>
              <Text style={styles.sectionBody}>Use this checklist during your GP appointment:</Text>
              {checklist.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleCheck(i)}
                  style={styles.checkRow}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, checked[i] && styles.checkboxChecked]}>
                    {checked[i] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkText, checked[i] && styles.checkTextDone]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.sectionTitle}>Helpful tips</Text>
              {[
                'You can write down your concerns before the appointment to avoid forgetting.',
                'If your GP does not offer a referral, you can ask again or contact another GP.',
                'You can also contact a mental health crisis line directly for urgent support.',
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            <Button label="I have my referral now — continue" onPress={() => router.push('/referral-upload')} />
            <Button
              label="Continue without referral for now"
              onPress={() => router.push('/providers/index')}
              variant="ghost"
            />
          </>
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
  choiceRow: { flexDirection: 'row', gap: 10 },
  choiceBtn: {
    flex: 1, paddingVertical: 14, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
    backgroundColor: colors.surface,
  },
  choiceBtnSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  choiceBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  choiceBtnTextSelected: { color: colors.primary },
  referralYes: {
    backgroundColor: '#F0FDF4', borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: '#BBF7D0', gap: 8,
  },
  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  checklistCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, gap: 10,
  },
  tipsCard: {
    backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: 16,
    gap: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sectionBody: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeCard: {
    flex: 1, backgroundColor: colors.primaryLight, borderRadius: radius.md,
    padding: 12, gap: 4,
  },
  typeName: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  typeDesc: { fontSize: 12, color: colors.primaryDark, lineHeight: 16 },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { borderColor: colors.success, backgroundColor: colors.success },
  checkmark: { color: colors.white, fontSize: 13, fontWeight: '700' },
  checkText: { flex: 1, ...typography.body, lineHeight: 22 },
  checkTextDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  tipRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  tipBullet: { color: colors.primary, fontWeight: '700', fontSize: 16, marginTop: 1 },
  tipText: { flex: 1, ...typography.body, color: colors.primaryDark, lineHeight: 22 },
});
