import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../constants/theme';
import { AltheaFooter } from '../components/ui/AltheaFooter';

interface Section {
  id: string;
  icon: string;
  title: string;
  color: string;
  border: string;
  content: { heading?: string; body: string }[];
}

const sections: Section[] = [
  {
    id: 'system',
    icon: '🏥',
    title: 'How the Dutch mental healthcare system works',
    color: '#EFF6FF',
    border: '#BFDBFE',
    content: [
      {
        body: 'The Netherlands has a structured mental healthcare system with multiple layers. Understanding it helps you navigate faster and get the right support.',
      },
      {
        heading: 'Primary care (Eerstelijnszorg)',
        body: 'Your GP (huisarts) is the first point of contact. They can provide short-term support, prescribe medication, or refer you onward. For mild-to-moderate mental health issues, your GP may refer you to a Primary Care Psychologist (POH-GGZ) within the practice.',
      },
      {
        heading: 'Specialised mental health care (GGZ)',
        body: 'GGZ stands for Geestelijke Gezondheidszorg — mental health care. There are two tiers:\n\n• Basis GGZ: for moderate, non-complex problems (anxiety, depression, burnout). Usually 5–12 sessions with a psychologist or therapist.\n\n• Gespecialiseerde GGZ: for more complex or severe conditions. Intensive treatment, often multi-disciplinary teams.',
      },
    ],
  },
  {
    id: 'gp',
    icon: '🩺',
    title: 'Your GP referral (huisarts verwijzing)',
    color: '#F0FDF4',
    border: '#BBF7D0',
    content: [
      {
        body: 'For most GGZ providers, you need a referral letter from your GP. This is required by insurance to cover the costs. Without it, you may have to pay out-of-pocket.',
      },
      {
        heading: 'How to get a referral',
        body: '1. Make an appointment with your GP (huisarts)\n2. Describe your mental health concerns clearly\n3. Ask for a referral to a GGZ provider or psychologist\n4. The GP writes a referral letter (verwijsbrief)\n5. Take this letter to your first appointment with the provider',
      },
      {
        heading: 'What if I don\'t have a GP?',
        body: 'Register with a local GP practice first. In the Netherlands, you must register with a GP near your home address. As a student, your university may also have a student doctor (studentenarts) who can issue referrals.',
      },
      {
        heading: 'Open GGZ (no referral needed)',
        body: 'Some providers operate without a referral — this is called "open GGZ" or "directe toegang." However, costs may not be fully covered by insurance. Always check with the provider first.',
      },
    ],
  },
  {
    id: 'insurance',
    icon: '🛡️',
    title: 'Insurance & costs',
    color: '#FAF5FF',
    border: '#DDD6FE',
    content: [
      {
        body: 'Mental healthcare is part of the basic health insurance (basisverzekering) in the Netherlands. Every resident must have this insurance.',
      },
      {
        heading: 'What\'s covered',
        body: '• Visits to a GP: no cost\n• Basis GGZ: covered after your deductible (eigen risico)\n• Gespecialiseerde GGZ: covered after your deductible\n• Medication prescribed by a GP or psychiatrist: usually covered',
      },
      {
        heading: 'Deductible (Eigen risico)',
        body: 'The standard deductible is €385 per year (2024). Mental healthcare provided by a GP is exempt from the deductible. GGZ treatment counts toward the deductible.',
      },
      {
        heading: 'Supplementary insurance',
        body: 'Some insurers offer additional coverage (aanvullende verzekering) for alternative therapies, coaching, or extra sessions. Check your policy details.',
      },
      {
        heading: 'Low-income support',
        body: 'If you have a low income, you may be eligible for healthcare allowance (zorgtoeslag) to help cover your premiums. Check the Dutch Tax Office (Belastingdienst) website.',
      },
    ],
  },
  {
    id: 'waiting',
    icon: '⏳',
    title: 'Waiting lists (wachttijden)',
    color: '#FFF7ED',
    border: '#FED7AA',
    content: [
      {
        body: 'Waiting times in the Dutch mental healthcare system can be significant — often 3 to 12 weeks or more for GGZ providers.',
      },
      {
        heading: 'Why are there waiting lists?',
        body: 'Demand for mental healthcare has grown significantly, especially among young people. There is a shortage of trained therapists and psychologists across the Netherlands.',
      },
      {
        heading: 'Treeknormen (maximum wait standards)',
        body: 'The Dutch government has set maximum acceptable wait times:\n• Intake appointment: max 4 weeks from referral\n• First treatment session: max 10 weeks from intake\n\nMany providers currently exceed these norms.',
      },
      {
        heading: 'What to do while you wait',
        body: '• Use Althea\'s support chat and coping exercises\n• Ask your GP for interim support or medication if needed\n• Contact 113 Online or a support line for extra help\n• Consider online therapy platforms (e.g. NiceDay, MindUp)\n• Ask about cancellation slots — providers sometimes have short-notice openings',
      },
      {
        heading: 'Zorgbemiddeling (care mediation)',
        body: 'If your wait is too long, you can contact your health insurer\'s zorgbemiddeling service. They are legally obligated to help you find an alternative provider within the norm.',
      },
    ],
  },
  {
    id: 'student',
    icon: '🎓',
    title: 'Student mental health services',
    color: '#F0FDF4',
    border: '#BBF7D0',
    content: [
      {
        heading: 'Studentenpsycholoog',
        body: 'Most Dutch universities and universities of applied science (hogescholen) offer free or low-cost psychology services specifically for students. These are separate from the regular GGZ system and often have shorter wait times.',
      },
      {
        heading: 'What student services offer',
        body: '• Short-term individual counselling (usually 4–8 sessions)\n• Group workshops on anxiety, perfectionism, study skills\n• Crisis support\n• Referrals to external GGZ providers if needed',
      },
      {
        heading: 'How to access',
        body: 'Contact your university\'s student wellbeing department directly. You typically do not need a GP referral for university psychological services. These sessions are usually free or low-cost.',
      },
      {
        heading: 'Student doctors (studentenarts)',
        body: 'Many institutions also have a student doctor who can provide primary care, mental health consultations, and referral letters — useful if you\'re far from your registered GP.',
      },
    ],
  },
  {
    id: 'crisis',
    icon: '🆘',
    title: 'Crisis support & emergency contacts',
    color: '#FEF2F2',
    border: '#FECACA',
    content: [
      {
        body: 'If you are in immediate danger or experiencing a mental health crisis, there is 24/7 support available.',
      },
      {
        heading: '112 — Emergency services',
        body: 'Call 112 for immediate danger to life — yours or someone else\'s. Available 24/7.',
      },
      {
        heading: '113 Suicide Prevention',
        body: 'Call or text 113, or go to 113.nl. Available 24/7 for crisis support and suicide prevention. Free to call.',
      },
      {
        heading: 'Crisis team (Crisisdienst GGZ)',
        body: 'Every GGZ region has a crisis team available outside office hours. Your GP, or the out-of-hours GP service (huisartsenpost), can contact them on your behalf.',
      },
      {
        heading: 'Chat support',
        body: '• Stichting Korrelatie: 0900 1450 (daily 9:00–21:00)\n• Sensoor: 0900 0767 (24/7)\n• Jongeren Hulp Online: online chat for young people',
      },
    ],
  },
];

export default function EducationScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>('system');

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Understanding mental healthcare in the Netherlands</Text>
          <Text style={styles.sub}>
            A plain-language guide to the system, your rights, costs, and where to get help.
          </Text>
        </View>

        {/* Quick links */}
        <View style={styles.quickLinks}>
          <Text style={styles.quickLinksLabel}>Jump to</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {sections.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.quickChip}
                onPress={() => setExpanded(s.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickChipIcon}>{s.icon}</Text>
                <Text style={styles.quickChipText} numberOfLines={1}>{s.title.split(' ').slice(0, 3).join(' ')}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sections */}
        {sections.map((section) => {
          const open = expanded === section.id;
          return (
            <View key={section.id} style={[styles.sectionCard, { backgroundColor: section.color, borderColor: section.border }]}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggle(section.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {open && (
                <View style={styles.sectionBody}>
                  {section.content.map((item, i) => (
                    <View key={i} style={i > 0 ? styles.contentBlock : undefined}>
                      {item.heading && (
                        <Text style={styles.contentHeading}>{item.heading}</Text>
                      )}
                      <Text style={styles.contentBody}>{item.body}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>ℹ️</Text>
          <Text style={styles.disclaimerText}>
            This guide is for informational purposes only. Rules and coverage can change. Always verify with your insurer or provider.
          </Text>
        </View>

        <AltheaFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 14 },

  header: { gap: 8, paddingBottom: 4 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 4 },
  backText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },

  quickLinks: { gap: 8 },
  quickLinksLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  quickRow: { gap: 8, paddingBottom: 4 },
  quickChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface, borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: colors.border,
  },
  quickChipIcon: { fontSize: 14 },
  quickChipText: { fontSize: 12, color: colors.text, fontWeight: '600', maxWidth: 90 },

  sectionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  sectionIcon: { fontSize: 20, flexShrink: 0 },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20 },
  chevron: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  sectionBody: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  contentBlock: { paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  contentHeading: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 },
  contentBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  disclaimer: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md,
    padding: 12, borderWidth: 1, borderColor: colors.border,
  },
  disclaimerIcon: { fontSize: 16, flexShrink: 0 },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
