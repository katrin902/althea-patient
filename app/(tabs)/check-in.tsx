import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';
import { CrisisOverlay } from '../../components/ui/CrisisOverlay';

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color?: string;
}

function RatingSlider({ label, value, onChange, color = colors.primary }: SliderProps) {
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.header}>
        <Text style={sliderStyles.label}>{label}</Text>
        <Text style={[sliderStyles.value, { color }]}>{value}/10</Text>
      </View>
      <View style={sliderStyles.buttons}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            style={[sliderStyles.btn, n <= value && { backgroundColor: color, borderColor: color }]}
          >
            <Text style={[sliderStyles.btnText, n <= value && sliderStyles.btnTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  value: { fontSize: 15, fontWeight: '700' },
  buttons: { flexDirection: 'row', gap: 4 },
  btn: {
    flex: 1, aspectRatio: 1, borderRadius: 6, borderWidth: 1.5,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  btnText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  btnTextActive: { color: colors.white },
});

export default function CheckInScreen() {
  const { state, dispatch } = useApp();
  const [mood, setMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [note, setNote] = useState('');
  const [unsafe, setUnsafe] = useState<boolean | null>(null);
  const [selfHarm, setSelfHarm] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  function handleSubmit() {
    if (unsafe || selfHarm) {
      setShowCrisis(true);
      return;
    }
    dispatch({
      type: 'ADD_CHECK_IN',
      payload: {
        id: `ci${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mood, anxiety, stress, sleep,
        note,
        unsafeFlag: unsafe ?? false,
      },
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.successState}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Check-in recorded</Text>
          <Text style={styles.successSub}>
            Your provider will be able to see your mood trends in their dashboard. You're taking an important step in your care.
          </Text>
          <View style={styles.chartPreview}>
            <Text style={styles.chartLabel}>Today's summary</Text>
            {[{ label: 'Mood', val: mood, color: colors.primary }, { label: 'Anxiety', val: anxiety, color: colors.warning }, { label: 'Stress', val: stress, color: colors.danger }, { label: 'Sleep', val: sleep, color: colors.success }].map((item) => (
              <View key={item.label} style={styles.chartRow}>
                <Text style={styles.chartRowLabel}>{item.label}</Text>
                <View style={styles.chartTrack}>
                  <View style={[styles.chartFill, { width: `${item.val * 10}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.chartVal, { color: item.color }]}>{item.val}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How are you doing today?</Text>
        <Text style={styles.sub}>Your answers help your provider understand your wellbeing over time.</Text>

        <View style={styles.ratingsCard}>
          <RatingSlider label="Mood" value={mood} onChange={setMood} color={colors.primary} />
          <View style={styles.divider} />
          <RatingSlider label="Anxiety" value={anxiety} onChange={setAnxiety} color={colors.warning} />
          <View style={styles.divider} />
          <RatingSlider label="Stress" value={stress} onChange={setStress} color={colors.danger} />
          <View style={styles.divider} />
          <RatingSlider label="Sleep quality" value={sleep} onChange={setSleep} color={colors.success} />
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>How have you been feeling lately? (optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="What's on your mind..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>Safety questions</Text>
          <Text style={styles.safetySub}>These questions are important for your provider.</Text>

          <SafetyQuestion
            question="Are you feeling unsafe right now?"
            value={unsafe}
            onChange={setUnsafe}
          />
          <SafetyQuestion
            question="Have you had thoughts of harming yourself today?"
            value={selfHarm}
            onChange={setSelfHarm}
          />
        </View>

        <Button
          label="Submit check-in"
          onPress={handleSubmit}
          disabled={unsafe === null || selfHarm === null}
        />

        <Text style={styles.privacyNote}>
          Your check-in is visible to your assigned provider.
        </Text>
      </ScrollView>

      <CrisisOverlay
        visible={showCrisis}
        onSafe={() => {
          setShowCrisis(false);
          dispatch({
            type: 'ADD_CHECK_IN',
            payload: {
              id: `ci${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              mood, anxiety, stress, sleep, note,
              unsafeFlag: true,
            },
          });
          setSubmitted(true);
        }}
      />
    </SafeAreaView>
  );
}

function SafetyQuestion({ question, value, onChange }: { question: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <View style={sqStyles.container}>
      <Text style={sqStyles.q}>{question}</Text>
      <View style={sqStyles.row}>
        <TouchableOpacity
          onPress={() => onChange(true)}
          style={[sqStyles.btn, value === true && sqStyles.btnYes]}
        >
          <Text style={[sqStyles.btnText, value === true && sqStyles.btnYesText]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(false)}
          style={[sqStyles.btn, value === false && sqStyles.btnNo]}
        >
          <Text style={[sqStyles.btnText, value === false && sqStyles.btnNoText]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sqStyles = StyleSheet.create({
  container: { gap: 10 },
  q: { fontSize: 15, color: colors.text, fontWeight: '500', lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1, paddingVertical: 12, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.surface,
  },
  btnYes: { borderColor: colors.danger, backgroundColor: colors.crisisBackground },
  btnNo: { borderColor: colors.success, backgroundColor: '#F0FDF4' },
  btnText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  btnYesText: { color: colors.danger },
  btnNoText: { color: colors.success },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 32, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary },
  ratingsCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    gap: 16, borderWidth: 1, borderColor: colors.border,
  },
  divider: { height: 1, backgroundColor: colors.borderLight },
  noteCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    gap: 8, borderWidth: 1, borderColor: colors.border,
  },
  noteLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  noteInput: {
    backgroundColor: colors.background, borderRadius: radius.md, padding: 12,
    fontSize: 15, color: colors.text, minHeight: 100, borderWidth: 1, borderColor: colors.border,
  },
  safetyCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    gap: 14, borderWidth: 1, borderColor: colors.border,
  },
  safetyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  safetySub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  privacyNote: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  successState: {
    flex: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  successIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#F0FDF4',
    fontSize: 28, textAlign: 'center', lineHeight: 64, color: colors.success, fontWeight: '700',
  },
  successTitle: { ...typography.h2, textAlign: 'center' },
  successSub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  chartPreview: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, width: '100%', gap: 10,
  },
  chartLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chartRowLabel: { fontSize: 13, color: colors.textSecondary, width: 60 },
  chartTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  chartFill: { height: '100%', borderRadius: 4 },
  chartVal: { fontSize: 13, fontWeight: '700', width: 20, textAlign: 'right' },
});
