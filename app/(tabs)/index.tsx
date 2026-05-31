import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { mockProviders } from '../../data/mockProviders';
import { AltheaFooter } from '../../components/ui/AltheaFooter';
import { AltheaAvatar } from '../../components/ui/AltheaAvatar';

const MOCK_TODAY = '2025-06-12';

const STATUS_STEPS = [
  { key: 'not_started', label: 'Intake', icon: '📋' },
  { key: 'intake_completed', label: 'Provider', icon: '🏥' },
  { key: 'institution_intake_done', label: 'Assessment', icon: '📝' },
  { key: 'waiting', label: 'Waiting', icon: '⏳' },
  { key: 'appointment_scheduled', label: 'Therapy', icon: '✨' },
] as const;

const STATUS_ORDER = [
  'not_started',
  'intake_completed',
  'provider_selected',
  'institution_intake_done',
  'waiting',
  'appointment_scheduled',
] as const;

function getStepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);
  return idx === -1 ? 0 : idx;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getMoodColor(score: number): string {
  if (score >= 7) return colors.success;
  if (score >= 5) return colors.warning;
  return colors.danger;
}

const REMINDER_STYLES: Record<string, { bg: string; border: string; textColor: string; icon: string }> = {
  'check-in': { bg: '#EFF6FF', border: '#BFDBFE', textColor: '#1D4ED8', icon: '✍️' },
  appointment: { bg: '#F0FDF4', border: '#BBF7D0', textColor: '#15803D', icon: '📅' },
  homework: { bg: '#FAF5FF', border: '#DDD6FE', textColor: '#7C3AED', icon: '📚' },
  intake: { bg: colors.primaryLight, border: '#BAE6FD', textColor: colors.primary, icon: '📋' },
};

const TASK_ICONS: Record<string, string> = {
  exercise: '🏃',
  reading: '📖',
  reflection: '📓',
  activity: '🎯',
};

export default function HomeScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const {
    currentStatus,
    patientName,
    checkInHistory,
    homeworkTasks,
    reminders,
    appointments,
    providerRequests,
  } = state;

  const currentStepIndex = getStepIndex(currentStatus);

  // Last 7 days for mood chart
  const last7 = useMemo(() => {
    const days: { label: string; date: string; mood: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(MOCK_TODAY);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = checkInHistory.find((c) => c.date === dateStr);
      days.push({
        label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
        date: dateStr,
        mood: entry ? entry.mood : null,
      });
    }
    return days;
  }, [checkInHistory]);

  const thisWeekMoods = last7.filter((d) => d.mood !== null).map((d) => d.mood as number);
  const avgMood =
    thisWeekMoods.length
      ? (thisWeekMoods.reduce((a, b) => a + b, 0) / thisWeekMoods.length).toFixed(1)
      : '—';

  const nextAppt = appointments.find((a) => a.status !== 'completed');
  const activeReminders = reminders.filter((r) => !r.dismissed);

  // Timeline step mapping (STATUS_STEPS vs STATUS_ORDER)
  const timelineStepOrder = [
    'not_started',
    'intake_completed',
    'institution_intake_done',
    'waiting',
    'appointment_scheduled',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                {getGreeting()}, {patientName || 'there'} 👋
              </Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusLabel}>
                  {currentStatus === 'waiting'
                    ? 'Waiting for first session'
                    : currentStatus === 'appointment_scheduled'
                    ? 'First session scheduled'
                    : currentStatus === 'institution_intake_done'
                    ? 'Assessment complete'
                    : 'In progress'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.chatBubble}
              onPress={() => router.push('/(tabs)/chat')}
              activeOpacity={0.85}
            >
              <AltheaAvatar size={30} />
            </TouchableOpacity>
          </View>

          {/* Progress timeline */}
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, i) => {
              const stepIdx = timelineStepOrder.indexOf(step.key);
              const done = currentStepIndex > stepIdx;
              const active =
                currentStepIndex === stepIdx ||
                (step.key === 'waiting' && currentStatus === 'provider_selected');
              return (
                <React.Fragment key={step.key}>
                  <View style={styles.timelineStep}>
                    <View
                      style={[
                        styles.timelineCircle,
                        done && styles.timelineDone,
                        active && styles.timelineActive,
                      ]}
                    >
                      {done ? (
                        <Text style={styles.timelineCheck}>✓</Text>
                      ) : (
                        <Text style={[styles.timelineIcon, !active && { opacity: 0.5 }]}>
                          {step.icon}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.timelineLabel,
                        (done || active) && styles.timelineLabelOn,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                  {i < STATUS_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, done && styles.timelineLineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* ── KPI CHIPS ── */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { borderColor: '#BFDBFE' }]}>
            <Text style={styles.kpiValue}>{thisWeekMoods.length}/7</Text>
            <Text style={styles.kpiLabel}>Check-ins</Text>
          </View>
          <View style={[styles.kpiCard, { borderColor: '#BBF7D0' }]}>
            <Text
              style={[
                styles.kpiValue,
                { color: getMoodColor(parseFloat(avgMood as string) || 5) },
              ]}
            >
              {avgMood}
            </Text>
            <Text style={styles.kpiLabel}>Avg mood</Text>
          </View>
          <View style={[styles.kpiCard, { borderColor: '#DDD6FE' }]}>
            <Text style={[styles.kpiValue, { color: '#7C3AED' }]}>
              {nextAppt ? '12d' : '—'}
            </Text>
            <Text style={styles.kpiLabel}>To session</Text>
          </View>
        </View>

        {/* ── REMINDERS ── */}
        {activeReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What needs attention</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
            >
              {activeReminders.map((r) => {
                const c = REMINDER_STYLES[r.type] ?? REMINDER_STYLES['check-in'];
                return (
                  <View
                    key={r.id}
                    style={[
                      styles.reminderCard,
                      { backgroundColor: c.bg, borderColor: c.border },
                    ]}
                  >
                    <View style={styles.reminderTop}>
                      <Text style={{ fontSize: 18 }}>{c.icon}</Text>
                      <TouchableOpacity
                        onPress={() => dispatch({ type: 'DISMISS_REMINDER', payload: r.id })}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.reminderX}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.reminderTitle, { color: c.textColor }]}>{r.title}</Text>
                    <Text style={styles.reminderMsg}>{r.message}</Text>
                    <TouchableOpacity
                      style={[styles.reminderBtn, { borderColor: c.border }]}
                      onPress={() => router.push(r.actionRoute as any)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.reminderBtnText, { color: c.textColor }]}>
                        {r.actionLabel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── MOOD CHART ── */}
        <View style={[styles.section, styles.card]}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>This week's mood</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/check-in')}>
              <Text style={styles.linkText}>+ Check in</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chart}>
            {last7.map((day, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={styles.barBg}>
                  {day.mood !== null && (
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(day.mood / 10) * 100}%`,
                          backgroundColor: getMoodColor(day.mood),
                        },
                      ]}
                    />
                  )}
                </View>
                {day.mood !== null && (
                  <Text style={[styles.barScore, { color: getMoodColor(day.mood) }]}>
                    {day.mood}
                  </Text>
                )}
                <Text
                  style={[
                    styles.barDay,
                    day.date === MOCK_TODAY && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
          {thisWeekMoods.length > 0 && (
            <Text style={styles.chartHint}>
              Avg mood: {avgMood}/10 ·{' '}
              {thisWeekMoods[thisWeekMoods.length - 1] >= (thisWeekMoods[0] ?? 0)
                ? '📈 trending up'
                : '📉 keep checking in'}
            </Text>
          )}
        </View>

        {/* ── APPOINTMENT ── */}
        {nextAppt && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your appointment</Text>
            <TouchableOpacity
              style={styles.apptCard}
              onPress={() => router.push('/(tabs)/appointments')}
              activeOpacity={0.85}
            >
              <View style={styles.apptIconWrap}>
                <Text style={{ fontSize: 22 }}>📅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.apptType}>{nextAppt.type}</Text>
                <Text style={styles.apptDate}>
                  {nextAppt.date} · {nextAppt.time}
                </Text>
                <Text style={styles.apptTherapist}>{nextAppt.therapist}</Text>
                <Text style={styles.apptLocation} numberOfLines={1}>
                  📍 {nextAppt.location}
                </Text>
              </View>
              <View
                style={[
                  styles.apptBadge,
                  nextAppt.status === 'confirmed'
                    ? { backgroundColor: '#D1FAE5' }
                    : { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.apptBadgeText,
                    nextAppt.status === 'confirmed'
                      ? { color: '#15803D' }
                      : { color: '#92400E' },
                  ]}
                >
                  {nextAppt.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ── HOMEWORK ── */}
        {homeworkTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Homework</Text>
              <Text style={styles.sectionSub}>
                {homeworkTasks.filter((t) => t.completed).length}/{homeworkTasks.length} done
              </Text>
            </View>
            <View style={{ gap: 8 }}>
              {homeworkTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskRow, task.completed && { opacity: 0.65 }]}
                  onPress={() =>
                    !task.completed &&
                    dispatch({ type: 'COMPLETE_HOMEWORK', payload: task.id })
                  }
                  activeOpacity={task.completed ? 1 : 0.85}
                >
                  <View
                    style={[styles.taskCheck, task.completed && styles.taskCheckDone]}
                  >
                    {task.completed && (
                      <Text style={styles.taskCheckMark}>✓</Text>
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text>{TASK_ICONS[task.type]}</Text>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleDone,
                        ]}
                      >
                        {task.title}
                      </Text>
                    </View>
                    <Text style={styles.taskDesc} numberOfLines={1}>
                      {task.description}
                    </Text>
                    <Text style={styles.taskDue}>Due {task.dueDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── YOUR PROVIDERS ── */}
        {providerRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Your providers</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/providers')}>
                <Text style={styles.linkText}>See all ›</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 8 }}>
              {[...providerRequests]
                .sort((a, b) => (a.status === 'accepted' ? -1 : b.status === 'accepted' ? 1 : 0))
                .map((req) => {
                  const prov = mockProviders.find((p) => p.id === req.providerId);
                  if (!prov) return null;
                  const isAccepted = req.status === 'accepted';
                  const isPending = req.status === 'pending';
                  return (
                    <View
                      key={req.providerId}
                      style={[
                        styles.providerRow,
                        isAccepted && styles.providerRowAccepted,
                        isPending && styles.providerRowPending,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.providerRowInner}
                        onPress={() =>
                          router.push({ pathname: '/providers/[id]', params: { id: prov.id } })
                        }
                        activeOpacity={0.85}
                      >
                        <View style={[styles.providerAvatar, isAccepted && styles.providerAvatarAccepted]}>
                          <Text style={{ fontSize: 20 }}>{isAccepted ? '★' : '⏳'}</Text>
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={styles.providerName}>{prov.name}</Text>
                          <Text style={styles.providerMeta}>
                            {prov.type} · {prov.distance}
                          </Text>
                          <View style={[styles.reqBadge, isAccepted ? styles.reqBadgeAccepted : styles.reqBadgePending]}>
                            <Text style={[styles.reqBadgeText, isAccepted ? styles.reqBadgeTextAccepted : styles.reqBadgeTextPending]}>
                              {isAccepted ? '✓ Accepted' : '⏳ Request pending'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.chatBtn, isAccepted ? styles.chatBtnAccepted : styles.chatBtnPending]}
                        onPress={() =>
                          router.push({ pathname: '/providers/chat', params: { id: prov.id } })
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={styles.chatBtnIcon}>💬</Text>
                        <Text style={[styles.chatBtnLabel, isAccepted && styles.chatBtnLabelAccepted]}>
                          Chat
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* ── SUPPORT WHILE WAITING ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support while you wait</Text>
          <Text style={styles.sectionHint}>
            These exercises can help you cope day to day — not a replacement for therapy.
          </Text>
          <View style={styles.supportGrid}>
            {[
              { icon: '🌬️', title: 'Breathing', desc: '4-7-8 technique', bg: '#EFF6FF', border: '#BFDBFE' },
              { icon: '🌱', title: 'Grounding', desc: '5-4-3-2-1 method', bg: '#F0FDF4', border: '#BBF7D0' },
              { icon: '😴', title: 'Sleep tips', desc: 'Wind-down routine', bg: '#FAF5FF', border: '#DDD6FE' },
              { icon: '📓', title: 'Journal', desc: 'Mood reflection', bg: '#FFF7ED', border: '#FED7AA' },
            ].map((item) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.supportCard,
                  { backgroundColor: item.bg, borderColor: item.border },
                ]}
                onPress={() => router.push('/(tabs)/chat')}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</Text>
                <Text style={styles.supportTitle}>{item.title}</Text>
                <Text style={styles.supportDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── CHAT CARD ── */}
        <TouchableOpacity
          style={styles.chatCard}
          onPress={() => router.push('/(tabs)/chat')}
          activeOpacity={0.85}
        >
          <View style={styles.chatCardInner}>
            <View style={styles.chatAvatarWrap}>
              <AltheaAvatar size={36} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatCardTitle}>Chat with Althea</Text>
              <Text style={styles.chatCardSub}>Ask anything · Available 24/7 · Confidential</Text>
            </View>
          </View>
          <View style={styles.chatArrow}>
            <Text style={{ color: colors.white, fontSize: 20 }}>›</Text>
          </View>
        </TouchableOpacity>

        {/* ── EDUCATION CARD ── */}
        <TouchableOpacity
          style={styles.eduCard}
          onPress={() => router.push('/education' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.eduCardTop}>
            <View style={styles.eduIconWrap}>
              <Text style={{ fontSize: 22 }}>🏥</Text>
            </View>
            <View style={styles.eduBadge}>
              <Text style={styles.eduBadgeText}>Learn</Text>
            </View>
          </View>
          <Text style={styles.eduTitle}>How does mental healthcare work in the Netherlands?</Text>
          <Text style={styles.eduSub}>
            GGZ, your GP referral, insurance, waiting lists, student services — explained simply.
          </Text>
          <View style={styles.eduTagRow}>
            {['GP Referral', 'GGZ', 'Insurance', 'Student Care'].map((tag) => (
              <View key={tag} style={styles.eduTag}>
                <Text style={styles.eduTagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.eduLink}>Read the guide →</Text>
        </TouchableOpacity>

        <AltheaFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 32 },

  // ── Header
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    paddingBottom: 18,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: { fontSize: 21, fontWeight: '700', color: colors.white },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  chatBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  // chatBubbleText replaced by AltheaAvatar

  // ── Timeline
  timeline: { flexDirection: 'row', alignItems: 'center' },
  timelineStep: { alignItems: 'center', gap: 4 },
  timelineCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  timelineDone: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'transparent',
  },
  timelineActive: {
    backgroundColor: colors.white,
    borderColor: 'transparent',
  },
  timelineCheck: { fontSize: 13, fontWeight: '800', color: colors.primary },
  timelineIcon: { fontSize: 13 },
  timelineLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 46,
  },
  timelineLabelOn: { color: colors.white, fontWeight: '700' },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 18,
    marginHorizontal: 2,
  },
  timelineLineDone: { backgroundColor: 'rgba(255,255,255,0.65)' },

  // ── KPIs
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1.5,
    ...shadow.sm,
  },
  kpiValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, fontWeight: '600' },

  // ── Sections
  section: { paddingHorizontal: spacing.lg, paddingTop: 20 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 },
  sectionSub: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  sectionHint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginTop: -6,
    marginBottom: 10,
  },
  linkText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    paddingTop: spacing.md,
    ...shadow.sm,
  },

  // ── Reminders
  reminderCard: {
    width: 196,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1.5,
    gap: 4,
  },
  reminderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reminderX: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  reminderTitle: { fontSize: 13, fontWeight: '700' },
  reminderMsg: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  reminderBtn: {
    marginTop: 6,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
  },
  reminderBtnText: { fontSize: 12, fontWeight: '700' },

  // ── Mood chart
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: 6,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 2 },
  barBg: {
    width: 15,
    height: 58,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: { width: '100%', borderRadius: 4 },
  barScore: { fontSize: 9, fontWeight: '700' },
  barDay: { fontSize: 10, color: colors.textMuted, fontWeight: '500' },
  chartHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // ── Appointment
  apptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    ...shadow.sm,
  },
  apptIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptType: { fontSize: 14, fontWeight: '700', color: colors.text },
  apptDate: { fontSize: 13, fontWeight: '600', color: '#15803D', marginTop: 2 },
  apptTherapist: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  apptLocation: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  apptBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  apptBadgeText: { fontSize: 10, fontWeight: '700' },

  // ── Tasks
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  taskCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  taskCheckDone: { backgroundColor: colors.success, borderColor: colors.success },
  taskCheckMark: { color: colors.white, fontSize: 11, fontWeight: '800' },
  taskTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  taskTitleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  taskDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  taskDue: { fontSize: 10, color: colors.textMuted, marginTop: 1 },

  // ── Provider
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  providerRowAccepted: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  providerRowPending: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  providerRowInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  providerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  providerAvatarAccepted: { backgroundColor: '#DCFCE7' },
  providerName: { fontSize: 14, fontWeight: '700', color: colors.text },
  providerMeta: { fontSize: 12, color: colors.textSecondary },
  reqBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 2,
  },
  reqBadgeAccepted: { backgroundColor: '#DCFCE7' },
  reqBadgePending: { backgroundColor: '#FEF3C7' },
  reqBadgeText: { fontSize: 10, fontWeight: '700' },
  reqBadgeTextAccepted: { color: '#15803D' },
  reqBadgeTextPending: { color: '#92400E' },
  chatBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
    borderWidth: 1,
    flexShrink: 0,
  },
  chatBtnAccepted: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chatBtnPending: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  chatBtnIcon: { fontSize: 16 },
  chatBtnLabel: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  chatBtnLabelAccepted: { color: colors.primary },
  rowArrow: { fontSize: 22, color: colors.textMuted },

  // ── Support
  supportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  supportCard: {
    width: '47%',
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    gap: 2,
  },
  supportTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  supportDesc: { fontSize: 12, color: colors.textSecondary },

  // ── Chat CTA
  chatCard: {
    marginHorizontal: spacing.lg,
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow.md,
  },
  chatCardInner: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  chatAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatCardTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  chatCardSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  chatArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Education card
  eduCard: {
    marginHorizontal: spacing.lg,
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 10,
    ...shadow.sm,
  },
  eduCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eduIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center',
  },
  eduBadge: {
    backgroundColor: '#E0F2FE', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  eduBadgeText: { fontSize: 11, color: '#0369A1', fontWeight: '700' },
  eduTitle: { fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 22 },
  eduSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  eduTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  eduTag: {
    backgroundColor: '#F0F9FF', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  eduTagText: { fontSize: 11, color: '#0284C7', fontWeight: '600' },
  eduLink: { fontSize: 13, color: colors.primary, fontWeight: '700' },
});
