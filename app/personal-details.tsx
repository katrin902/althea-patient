import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

const insurers = ['CZ', 'Menzis', 'Zilveren Kruis', 'VGZ', 'IZA', 'Other'];
const languages = ['Dutch', 'English', 'German', 'French', 'Arabic', 'Other'];

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.patientName);
  const [age, setAge] = useState(state.patientAge?.toString() ?? '');
  const [city, setCity] = useState(state.patientCity);
  const [insurance, setInsurance] = useState(state.patientInsurance);
  const [language, setLanguage] = useState(state.patientLanguage);

  function handleContinue() {
    dispatch({ type: 'SET_PATIENT_NAME', payload: name });
    dispatch({ type: 'SET_PATIENT_AGE', payload: parseInt(age) || 0 });
    dispatch({ type: 'SET_PATIENT_CITY', payload: city });
    dispatch({ type: 'SET_PATIENT_INSURANCE', payload: insurance });
    dispatch({ type: 'SET_PATIENT_LANGUAGE', payload: language });
    router.push('/current-situation');
  }

  const canContinue = name.trim().length > 0 && age.trim().length > 0 && city.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={2} total={8} label="Step 2 of 8: Personal details" />

        <Text style={styles.title}>Tell us a bit about yourself</Text>
        <Text style={styles.sub}>This helps us recommend suitable providers near you.</Text>

        <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
        <Input label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="e.g. 22" />
        <Input label="City or region" value={city} onChangeText={setCity} placeholder="e.g. Amsterdam" />

        <View style={styles.selectSection}>
          <Text style={styles.selectLabel}>Health insurance</Text>
          <View style={styles.chips}>
            {insurers.map((ins) => (
              <TouchableOpacity
                key={ins}
                onPress={() => setInsurance(ins)}
                style={[styles.chip, insurance === ins && styles.chipSelected]}
              >
                <Text style={[styles.chipText, insurance === ins && styles.chipTextSelected]}>{ins}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.selectSection}>
          <Text style={styles.selectLabel}>Preferred language for therapy</Text>
          <View style={styles.chips}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[styles.chip, language === lang && styles.chipSelected]}
              >
                <Text style={[styles.chipText, language === lang && styles.chipTextSelected]}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button label="Continue" onPress={handleContinue} disabled={!canContinue} style={styles.cta} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary },
  selectSection: { gap: 8 },
  selectLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  chipTextSelected: { color: colors.primary },
  cta: { marginTop: 8 },
});
