import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';

export default function CrisisDisclaimerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.iconBlock}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🛡</Text>
          </View>
        </View>

        <Text style={styles.title}>Before we begin</Text>
        <Text style={styles.sub}>Please read this before continuing.</Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>If you are in immediate danger</Text>
          <Text style={styles.warningBody}>
            If you are in immediate danger or may harm yourself, Althea cannot provide emergency
            help. Please call{' '}
            <Text style={styles.bold}>112</Text> immediately or contact{' '}
            <Text style={styles.bold}>113 Suicide Prevention</Text> in the Netherlands.
          </Text>
          <Text style={[styles.warningBody, { marginTop: 8 }]}>
            Althea does not replace emergency services or professional crisis care.
          </Text>
        </View>

        <View style={styles.emergencyButtons}>
          <Button
            label="Call 112 — Emergency Services"
            onPress={() => Linking.openURL('tel:112')}
            variant="danger"
          />
          <Button
            label="113 Suicide Prevention — 0800 0113"
            onPress={() => Linking.openURL('tel:08000113')}
            variant="secondary"
            style={styles.preventionBtn}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What Althea can help with</Text>
          {[
            'Understanding the Dutch mental healthcare system',
            'Preparing for your GP appointment',
            'Completing your intake questionnaire',
            'Finding suitable healthcare providers',
            'Support while waiting for care',
          ].map((item) => (
            <View key={item} style={styles.infoRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notCard}>
          <Text style={styles.notTitle}>What Althea cannot do</Text>
          {[
            'Diagnose mental health conditions',
            'Provide therapy or treatment',
            'Replace professional care',
            'Handle crisis or emergency situations',
          ].map((item) => (
            <View key={item} style={styles.infoRow}>
              <Text style={styles.cross}>✗</Text>
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <Button
          label="I understand, continue"
          onPress={() => router.push('/auth')}
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 20 },
  iconBlock: { alignItems: 'center', marginBottom: 4 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 28 },
  title: { ...typography.h2, textAlign: 'center' },
  sub: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  warningCard: {
    backgroundColor: colors.crisisBackground,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.crisisBorder,
  },
  warningTitle: { fontSize: 16, fontWeight: '700', color: colors.crisisText },
  warningBody: { ...typography.body, color: colors.crisisText, lineHeight: 22 },
  bold: { fontWeight: '700' },
  emergencyButtons: { gap: 10 },
  preventionBtn: { borderColor: colors.danger },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  notTitle: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  checkmark: { color: colors.success, fontWeight: '700', fontSize: 15, marginTop: 1 },
  cross: { color: colors.danger, fontWeight: '700', fontSize: 15, marginTop: 1 },
  infoText: { ...typography.body, flex: 1, lineHeight: 22 },
  cta: { marginTop: 8 },
});
