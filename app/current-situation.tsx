import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

const situations = [
  { id: 'unsure', label: 'I do not know where to start', icon: '🤔' },
  { id: 'think_need', label: 'I think I need mental health support', icon: '💙' },
  { id: 'visited_gp', label: 'I already visited my GP', icon: '🏥' },
  { id: 'have_referral', label: 'I already have a referral', icon: '📄' },
  { id: 'waiting_list', label: 'I am already on a waiting list', icon: '⏳' },
  { id: 'have_provider', label: 'I already have a provider but no appointment yet', icon: '🏢' },
  { id: 'crisis', label: 'I feel unsafe or in crisis', icon: '🆘' },
];

export default function CurrentSituationScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [selected, setSelected] = useState('');

  function handleContinue() {
    dispatch({ type: 'SET_CURRENT_SITUATION', payload: selected });
    if (selected === 'crisis') {
      router.push('/crisis-screening');
    } else {
      router.push('/crisis-screening');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={3} total={8} label="Step 3 of 8: Your situation" />

        <Text style={styles.title}>What best describes your situation?</Text>
        <Text style={styles.sub}>This helps us guide you to the most relevant next steps.</Text>

        <View style={styles.options}>
          {situations.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSelected(s.id)}
              style={[
                styles.option,
                selected === s.id && styles.optionSelected,
                s.id === 'crisis' && styles.optionCrisis,
                s.id === 'crisis' && selected === s.id && styles.optionCrisisSelected,
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.optionIcon}>{s.icon}</Text>
              <Text style={[styles.optionText, selected === s.id && styles.optionTextSelected]}>
                {s.label}
              </Text>
              <View style={[styles.radio, selected === s.id && styles.radioSelected]}>
                {selected === s.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {selected === 'crisis' && (
          <View style={styles.crisisNote}>
            <Text style={styles.crisisNoteText}>
              If you are in immediate danger, please call 112 now. We will check in with a few
              safety questions before continuing.
            </Text>
          </View>
        )}

        <Button label="Continue" onPress={handleContinue} disabled={!selected} style={styles.cta} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionCrisis: { borderColor: colors.crisisBorder, backgroundColor: colors.crisisBackground },
  optionCrisisSelected: { borderColor: colors.danger },
  optionIcon: { fontSize: 22, width: 32 },
  optionText: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
  optionTextSelected: { color: colors.primary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  crisisNote: {
    backgroundColor: colors.crisisBackground,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.crisisBorder,
  },
  crisisNoteText: { ...typography.body, color: colors.crisisText, lineHeight: 22 },
  cta: { marginTop: 8 },
});
