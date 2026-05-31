import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';
import { mockProviders } from '../../data/mockProviders';

const mockAppointment = {
  id: 'apt1',
  status: 'proposed',
  providerName: 'Amsterdam Mental Health Center',
  specialistName: 'Dr. Lisa van Berg',
  date: 'Monday, 16 June 2025',
  time: '10:30',
  type: 'In-person',
  location: 'Herengracht 182, 1016 BR Amsterdam',
  preparationChecklist: [
    'Bring your GP referral letter',
    'Bring your insurance card',
    'Prepare a brief summary of your main concerns',
    'Note any current medications',
    'Write down questions you want to ask',
  ],
  documentsToBring: ['GP referral letter', 'Insurance card'],
};

export default function AppointmentsScreen() {
  const { state } = useApp();
  const [accepted, setAccepted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const acceptedRequest = state.providerRequests.find((r) => r.status === 'accepted');
  const selectedProvider = mockProviders.find((p) => p.id === acceptedRequest?.providerId);

  function toggleCheck(i: number) {
    setCheckedItems((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!acceptedRequest ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No appointments yet</Text>
            <Text style={styles.emptySub}>
              Once you select a provider and complete your intake, appointment proposals will appear here.
            </Text>
          </View>
        ) : (
          <>
            {/* Appointment proposal */}
            <Card style={styles.appointmentCard}>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, accepted && styles.statusDotAccepted]} />
                <Text style={styles.statusText}>{accepted ? 'Confirmed' : 'Appointment proposed'}</Text>
              </View>

              <Text style={styles.apptDate}>{mockAppointment.date}</Text>
              <Text style={styles.apptTime}>{mockAppointment.time}</Text>

              <View style={styles.divider} />

              <InfoRow icon="🏢" label="Provider" value={mockAppointment.providerName} />
              <InfoRow icon="👤" label="Specialist" value={mockAppointment.specialistName} />
              <InfoRow icon="📍" label="Location" value={mockAppointment.location} />
              <InfoRow icon="💻" label="Type" value={mockAppointment.type} />

              {!accepted && (
                <View style={styles.actionButtons}>
                  <Button label="Accept appointment" onPress={() => setAccepted(true)} />
                  <Button label="Request reschedule" onPress={() => {}} variant="secondary" style={{ marginTop: 8 }} />
                </View>
              )}
              {accepted && (
                <View style={styles.confirmedBanner}>
                  <Text style={styles.confirmedText}>Appointment confirmed</Text>
                </View>
              )}
            </Card>

            {/* Preparation checklist */}
            <Card>
              <Text style={styles.sectionTitle}>Preparation checklist</Text>
              <Text style={styles.sectionSub}>Make sure you have everything ready before your appointment.</Text>
              {mockAppointment.preparationChecklist.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => toggleCheck(i)}
                  style={styles.checkRow}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, checkedItems[i] && styles.checkboxDone]}>
                    {checkedItems[i] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkText, checkedItems[i] && styles.checkTextDone]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </Card>

            {/* Documents */}
            <Card variant="muted">
              <Text style={styles.sectionTitle}>Documents to bring</Text>
              {mockAppointment.documentsToBring.map((doc) => (
                <View key={doc} style={styles.docRow}>
                  <Text style={styles.docIcon}>📄</Text>
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </Card>

            {/* Message provider */}
            <Card variant="outline">
              <Text style={styles.sectionTitle}>Send a message</Text>
              <Text style={styles.sectionSub}>
                Need to reschedule or have a question? Send a structured message through Althea.
              </Text>
              <View style={styles.msgOptions}>
                {['I want to reschedule', 'I have a question about my intake', 'I need help with documents'].map((opt) => (
                  <TouchableOpacity key={opt} style={styles.msgOption} activeOpacity={0.8}>
                    <Text style={styles.msgOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.icon}>{icon}</Text>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  icon: { fontSize: 16, width: 24 },
  label: { fontSize: 13, color: colors.textSecondary, width: 80 },
  value: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.text },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 32, gap: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { ...typography.h3, textAlign: 'center' },
  emptySub: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  appointmentCard: { gap: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.warning },
  statusDotAccepted: { backgroundColor: colors.success },
  statusText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  apptDate: { fontSize: 20, fontWeight: '700', color: colors.text },
  apptTime: { fontSize: 17, color: colors.primary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border },
  actionButtons: { marginTop: 8 },
  confirmedBanner: {
    backgroundColor: '#F0FDF4', borderRadius: radius.md, padding: 12, alignItems: 'center', marginTop: 8,
  },
  confirmedText: { fontSize: 15, fontWeight: '700', color: colors.success },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sectionSub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { borderColor: colors.success, backgroundColor: colors.success },
  checkmark: { color: colors.white, fontSize: 12, fontWeight: '700' },
  checkText: { flex: 1, fontSize: 15, color: colors.text },
  checkTextDone: { textDecorationLine: 'line-through', color: colors.textMuted },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  docIcon: { fontSize: 18 },
  docText: { fontSize: 15, color: colors.text },
  msgOptions: { gap: 8, marginTop: 4 },
  msgOption: {
    backgroundColor: colors.background, borderRadius: radius.full,
    paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border,
  },
  msgOptionText: { fontSize: 14, color: colors.text, fontWeight: '500' },
});
