import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';

const categories = ['All', 'Breathing', 'Grounding', 'Sleep', 'Anxiety', 'Stress', 'Crisis'];

const resources = [
  {
    id: 'r1',
    category: 'Breathing',
    title: '4-7-8 Breathing Exercise',
    description: 'A calming breathing technique. Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 4 times.',
    duration: '5 min',
    icon: '🌬',
  },
  {
    id: 'r2',
    category: 'Grounding',
    title: '5-4-3-2-1 Grounding Technique',
    description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
    duration: '3 min',
    icon: '🌱',
  },
  {
    id: 'r3',
    category: 'Anxiety',
    title: 'Understanding Anxiety',
    description: 'Learn what anxiety is, why it happens, and how it is different from stress.',
    duration: '10 min read',
    icon: '📖',
  },
  {
    id: 'r4',
    category: 'Sleep',
    title: 'Sleep Hygiene Tips',
    description: 'Practical steps to improve your sleep quality before therapy begins.',
    duration: '8 min read',
    icon: '😴',
  },
  {
    id: 'r5',
    category: 'Stress',
    title: 'Progressive Muscle Relaxation',
    description: 'Tensing and releasing muscle groups to reduce physical tension from stress.',
    duration: '10 min',
    icon: '🧘',
  },
  {
    id: 'r6',
    category: 'Crisis',
    title: 'Crisis Support in the Netherlands',
    description: 'Information about 113 Suicide Prevention, GP crisis support, and emergency services.',
    duration: 'Reference',
    icon: '🆘',
    isCrisis: true,
  },
  {
    id: 'r7',
    category: 'Anxiety',
    title: 'Preparing for Your First Therapy Session',
    description: 'What to expect, how to prepare, and questions you might want to ask your therapist.',
    duration: '7 min read',
    icon: '🗒',
  },
  {
    id: 'r8',
    category: 'Grounding',
    title: 'Box Breathing',
    description: 'Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat to calm your nervous system.',
    duration: '3 min',
    icon: '📦',
  },
];

export default function ResourcesScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Support resources</Text>
        <Text style={styles.sub}>
          These exercises and guides can help while you wait for your appointment. They are not a replacement for professional care.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.list}>
          {filtered.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={[styles.card, resource.isCrisis && styles.crisisCard]}
              onPress={() => setExpanded(expanded === resource.id ? null : resource.id)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, resource.isCrisis && styles.crisisIconCircle]}>
                  <Text style={styles.icon}>{resource.icon}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{resource.title}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[styles.catTag, resource.isCrisis && styles.crisisCatTag]}>
                      <Text style={[styles.catTagText, resource.isCrisis && styles.crisisCatTagText]}>
                        {resource.category}
                      </Text>
                    </View>
                    <Text style={styles.duration}>{resource.duration}</Text>
                  </View>
                </View>
                <Text style={styles.expandIcon}>{expanded === resource.id ? '▲' : '▼'}</Text>
              </View>
              {expanded === resource.id && (
                <View style={styles.expanded}>
                  <Text style={styles.expandedText}>{resource.description}</Text>
                  {!resource.isCrisis && (
                    <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                      <Text style={styles.startBtnText}>Start this exercise</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            These resources are for general support only. Althea does not replace therapy or professional mental healthcare. If you are in immediate danger, call 112.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 32, gap: 14 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  categories: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  catChipTextActive: { color: colors.white },
  list: { gap: 10 },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: 14, borderWidth: 1, borderColor: colors.border, gap: 0,
  },
  crisisCard: { borderColor: colors.crisisBorder, backgroundColor: colors.crisisBackground },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  crisisIconCircle: { backgroundColor: colors.crisisBackground },
  icon: { fontSize: 20 },
  cardText: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catTag: {
    backgroundColor: colors.primaryLight, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  crisisCatTag: { backgroundColor: 'rgba(239,68,68,0.1)' },
  catTagText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  crisisCatTagText: { color: colors.danger },
  duration: { fontSize: 12, color: colors.textMuted },
  expandIcon: { fontSize: 12, color: colors.textMuted },
  expanded: { marginTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 12 },
  expandedText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  startBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: 10, alignItems: 'center',
  },
  startBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  disclaimer: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 14,
  },
  disclaimerText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 17 },
});
