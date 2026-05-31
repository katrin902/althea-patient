import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { mockProviders } from '../../data/mockProviders';
import { useApp } from '../../context/AppContext';

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const provider = mockProviders.find((p) => p.id === id);

  const request = state.providerRequests.find((r) => r.providerId === id);
  const isAccepted = request?.status === 'accepted';
  const isPending = request?.status === 'pending';
  const isRequested = !!request;

  if (!provider) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Provider not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  function handleRequest() {
    router.push({ pathname: '/providers/confirm', params: { id: provider!.id } });
  }

  function handleCancelRequest() {
    dispatch({ type: 'REMOVE_PROVIDER_REQUEST', payload: provider!.id });
  }

  function handleOpenChat() {
    router.push({ pathname: '/providers/chat', params: { id: provider!.id } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerCard, isAccepted && styles.headerCardAccepted]}>
          <View style={[styles.logoPlaceholder, isAccepted && styles.logoAccepted]}>
            <Text style={[styles.logoText, isAccepted && styles.logoTextAccepted]}>
              {provider.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.type}>{provider.type}</Text>
          <Text style={styles.address}>{provider.address}</Text>

          <View style={styles.badges}>
            {isAccepted && (
              <View style={[styles.badge, styles.badgeAccepted]}>
                <Text style={styles.badgeAcceptedText}>★  Your provider</Text>
              </View>
            )}
            {isPending && (
              <View style={[styles.badge, styles.badgePending]}>
                <Text style={styles.badgePendingText}>⏳  Request sent</Text>
              </View>
            )}
            {provider.studentExperience && (
              <View style={styles.badge}><Text style={styles.badgeText}>Student experience</Text></View>
            )}
            {provider.onlineAvailable && (
              <View style={styles.badge}><Text style={styles.badgeText}>Online sessions</Text></View>
            )}
            <View style={[styles.badge, styles.badgeWait]}>
              <Text style={styles.badgeWaitText}>Wait: {provider.waitingTime}</Text>
            </View>
          </View>
        </View>

        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {provider.rating}</Text>
          <Text style={styles.ratingCount}>({provider.reviewCount} reviews)</Text>
          <View style={styles.formatBadge}>
            <Text style={styles.formatBadgeText}>
              {provider.treatmentFormat === 'hybrid'
                ? '🔄 Hybrid'
                : provider.treatmentFormat === 'online'
                ? '💻 Online'
                : '🏢 In-person'}
            </Text>
          </View>
        </View>

        {/* ── Request status card ── */}
        {isAccepted && (
          <View style={styles.statusCard}>
            <View style={styles.statusCardIcon}>
              <Text style={{ fontSize: 22 }}>✅</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusCardTitle}>You're registered with this provider</Text>
              <Text style={styles.statusCardMeta}>
                Accepted {request?.acceptedAt ?? ''} · Your appointment is on record
              </Text>
            </View>
            <TouchableOpacity style={styles.chatPillBtn} onPress={handleOpenChat} activeOpacity={0.8}>
              <Text style={styles.chatPillBtnText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {isPending && (
          <View style={[styles.statusCard, styles.statusCardPending]}>
            <View style={styles.statusCardIcon}>
              <Text style={{ fontSize: 22 }}>⏳</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusCardTitle}>Request sent</Text>
              <Text style={styles.statusCardMeta}>
                Sent {request?.requestedAt ?? ''} · Usually 3–5 working days
              </Text>
            </View>
            <TouchableOpacity style={styles.chatPillBtn} onPress={handleOpenChat} activeOpacity={0.8}>
              <Text style={styles.chatPillBtnText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Key info */}
        <View style={styles.infoGrid}>
          <InfoRow label="Distance" value={provider.distance} />
          <InfoRow label="Waiting time" value={provider.waitingTime} />
          <InfoRow label="Office hours" value={provider.officeHours} />
          <InfoRow label="Treatment format" value={provider.treatmentFormat.charAt(0).toUpperCase() + provider.treatmentFormat.slice(1)} />
          <InfoRow label="Accepting patients" value={provider.acceptingPatients ? 'Yes ✓' : 'Currently full'} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this provider</Text>
          <Text style={styles.sectionText}>{provider.description}</Text>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.tagRow}>
            {provider.specializations.map((s) => (
              <View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.tagRow}>
            {provider.languages.map((l) => (
              <View key={l} style={styles.tag}><Text style={styles.tagText}>{l}</Text></View>
            ))}
          </View>
        </View>

        {/* Insurance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accepted insurance</Text>
          <View style={styles.tagRow}>
            {provider.insurance.map((ins) => (
              <View key={ins} style={styles.tag}><Text style={styles.tagText}>{ins}</Text></View>
            ))}
          </View>
        </View>

        {/* Specialists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialists</Text>
          {provider.specialists.map((s) => (
            <View key={s} style={styles.specialistRow}>
              <View style={styles.specialistAvatar}><Text style={styles.specialistAvatarText}>{s.charAt(s.indexOf(' ') + 1)}</Text></View>
              <Text style={styles.specialistName}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Crisis policy */}
        <View style={styles.crisisCard}>
          <Text style={styles.crisisTitle}>Crisis policy</Text>
          <Text style={styles.crisisText}>{provider.crisisPolicy}</Text>
        </View>

        {/* Contact note */}
        <View style={styles.contactNote}>
          <Text style={styles.contactNoteText}>
            Communication with this provider happens through Althea. Direct contact details are shared after your first session.
          </Text>
        </View>

        {/* ── Action buttons ── */}
        {isAccepted ? (
          <>
            <Button
              label="💬  Open chat with provider"
              onPress={handleOpenChat}
            />
            <Button
              label="Back"
              onPress={() => router.back()}
              variant="ghost"
              style={{ marginTop: 4 }}
            />
          </>
        ) : isPending ? (
          <>
            <Button
              label="💬  Open chat with provider"
              onPress={handleOpenChat}
            />
            <Button
              label="Cancel request"
              onPress={handleCancelRequest}
              variant="secondary"
              style={{ marginTop: 4 }}
            />
            <Button
              label="Back"
              onPress={() => router.back()}
              variant="ghost"
              style={{ marginTop: 4 }}
            />
          </>
        ) : (
          <>
            <Button
              label={provider.acceptingPatients ? 'Request this provider' : 'Provider is currently full'}
              onPress={provider.acceptingPatients ? handleRequest : () => {}}
              style={!provider.acceptingPatients ? { opacity: 0.5 } : {}}
            />
            <Button
              label="Back to list"
              onPress={() => router.back()}
              variant="ghost"
              style={{ marginTop: 4 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: colors.text },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { ...typography.body, color: colors.textSecondary },

  headerCard: {
    backgroundColor: colors.surface, borderRadius: radius.xl, padding: 20,
    alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border,
  },
  headerCardAccepted: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  logoPlaceholder: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  logoAccepted: { backgroundColor: '#DCFCE7' },
  logoText: { fontSize: 28, fontWeight: '800', color: colors.primary },
  logoTextAccepted: { color: '#15803D' },
  name: { ...typography.h3, textAlign: 'center' },
  type: { ...typography.caption, color: colors.textSecondary },
  address: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 },
  badge: {
    backgroundColor: '#F0FDF4', borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  badgeAccepted: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#BBF7D0' },
  badgeAcceptedText: { fontSize: 12, color: '#15803D', fontWeight: '700' },
  badgePending: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' },
  badgePendingText: { fontSize: 12, color: '#92400E', fontWeight: '700' },
  badgeWait: { backgroundColor: colors.primaryLight },
  badgeWaitText: { fontSize: 12, color: colors.primaryDark, fontWeight: '600' },

  // Status card
  statusCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F0FDF4', borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  statusCardPending: {
    backgroundColor: '#FFFBEB', borderColor: '#FDE68A',
  },
  statusCardIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statusCardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  statusCardMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  chatPillBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 8, flexShrink: 0,
  },
  chatPillBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  infoGrid: {
    backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sectionText: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  tagText: { fontSize: 13, color: colors.text },
  specialistRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  specialistAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  specialistAvatarText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  specialistName: { fontSize: 15, color: colors.text },
  crisisCard: {
    backgroundColor: colors.crisisBackground, borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: colors.crisisBorder, gap: 6,
  },
  crisisTitle: { fontSize: 14, fontWeight: '600', color: colors.crisisText },
  crisisText: { fontSize: 13, color: colors.crisisText, lineHeight: 18 },
  contactNote: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 12,
  },
  contactNoteText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, textAlign: 'center' },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  ratingText: { fontSize: 16, fontWeight: '700', color: colors.text },
  ratingCount: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  formatBadge: {
    backgroundColor: colors.primaryLight, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  formatBadgeText: { fontSize: 12, color: colors.primaryDark, fontWeight: '600' },
});
