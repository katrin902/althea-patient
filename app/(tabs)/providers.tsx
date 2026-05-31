import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing } from '../../constants/theme';
import { mockProviders, recommendedProviders } from '../../data/mockProviders';
import { useApp } from '../../context/AppContext';
import ProviderMap, { ProviderPin } from '../../components/map/ProviderMap';
import { RequestsBar } from '../../components/providers/RequestsBar';

const PIN_PALETTE = [colors.primary, '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function ProvidersScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { height: screenH } = useWindowDimensions();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState<'all' | 'accepting'>('accepting');

  // Convert provider data to pins for the map
  const providerPins: ProviderPin[] = useMemo(
    () =>
      mockProviders.map((p) => {
        const recIdx = recommendedProviders.findIndex((r) => r.id === p.id);
        const request = state.providerRequests.find((r) => r.providerId === p.id);
        return {
          id: p.id,
          name: p.name,
          type: p.type,
          distance: p.distance,
          waitingTime: p.waitingTime,
          rating: p.rating,
          acceptingPatients: p.acceptingPatients,
          lat: p.coordinates.lat,
          lng: p.coordinates.lng,
          isYours: request?.status === 'accepted',
          isPending: request?.status === 'pending',
          isRecommended: recIdx !== -1,
          rank: recIdx !== -1 ? recIdx + 1 : undefined,
        };
      }),
    [state.providerRequests]
  );

  const displayList =
    filter === 'accepting'
      ? mockProviders.filter((p) => p.acceptingPatients)
      : mockProviders;

  function goToProfile(id: string) {
    router.push({ pathname: '/providers/[id]', params: { id } });
  }

  // Map height = screen minus tab bar (62) minus toggle bar (56) minus requests bar height
  const requestsBarHeight = state.providerRequests.length > 0
    ? 38 + state.providerRequests.length * 50
    : 0;
  const mapHeight = screenH - 62 - 56 - requestsBarHeight - 34;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* ── Requests bar (shown when patient has active requests) ── */}
      <RequestsBar requests={state.providerRequests} />

      {/* ── Map / List toggle ── */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'map' && styles.toggleActive]}
          onPress={() => setView('map')}
        >
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>
            🗺️  Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'list' && styles.toggleActive]}
          onPress={() => setView('list')}
        >
          <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>
            ☰  List
          </Text>
        </TouchableOpacity>
      </View>

      {view === 'map' ? (
        /* ── REAL LEAFLET MAP ── */
        <View style={{ flex: 1, height: mapHeight }}>
          <ProviderMap
            providers={providerPins}
            userLat={52.366}
            userLng={4.885}
            onViewProfile={goToProfile}
            dom={{ scrollEnabled: false }}
          />
        </View>
      ) : (
        /* ── LIST VIEW ── */
        <ScrollView
          contentContainerStyle={styles.listScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter chips */}
          <View style={styles.filterRow}>
            {(['all', 'accepting'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === f && styles.filterChipTextActive,
                  ]}
                >
                  {f === 'all' ? 'All providers' : '✓  Accepting now'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Provider cards */}
          {displayList.map((p) => {
            const i = mockProviders.indexOf(p);
            const request = state.providerRequests.find((r) => r.providerId === p.id);
            const isAccepted = request?.status === 'accepted';
            const isPending = request?.status === 'pending';
            const recIdx = recommendedProviders.findIndex((r) => r.id === p.id);
            const pinColor = isAccepted
              ? colors.success
              : isPending
              ? '#F59E0B'
              : PIN_PALETTE[i % PIN_PALETTE.length];

            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.card,
                  isAccepted && styles.cardAccepted,
                  isPending && styles.cardPending,
                ]}
                onPress={() => goToProfile(p.id)}
                activeOpacity={0.85}
              >
                {/* Rank / status circle */}
                <View style={[styles.rank, { backgroundColor: pinColor }]}>
                  <Text style={styles.rankText}>
                    {isAccepted ? '★' : isPending ? '?' : recIdx !== -1 ? recIdx + 1 : i + 1}
                  </Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                      {p.name}
                    </Text>
                    {isAccepted && (
                      <View style={styles.acceptedBadge}>
                        <Text style={styles.acceptedBadgeText}>★  Accepted</Text>
                      </View>
                    )}
                    {isPending && (
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>⏳  Pending</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.meta}>
                    {p.type} · {p.distance} · {p.waitingTime} wait
                  </Text>
                  <Text style={styles.rating}>
                    ⭐ {p.rating} ({p.reviewCount}) · {p.languages.join(', ')}
                  </Text>
                  {p.recommendationReason != null && recIdx !== -1 && (
                    <Text style={styles.reason} numberOfLines={1}>
                      🔵 {p.recommendationReason}
                    </Text>
                  )}
                </View>

                {/* Right: status + action */}
                <View style={styles.cardRight}>
                  {p.acceptingPatients ? (
                    <View style={styles.openBadge}>
                      <Text style={styles.openBadgeText}>Open</Text>
                    </View>
                  ) : (
                    <View style={styles.fullBadge}>
                      <Text style={styles.fullBadgeText}>Full</Text>
                    </View>
                  )}
                  {(isAccepted || isPending) ? (
                    <TouchableOpacity
                      style={styles.chatMiniBtn}
                      onPress={() =>
                        router.push({ pathname: '/providers/chat', params: { id: p.id } })
                      }
                    >
                      <Text style={styles.chatMiniBtnText}>💬</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.cardArrow}>›</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.legend}>
            <Text style={styles.legendText}>
              ★ = your accepted provider · ⏳ = request pending · tap to view full profile
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 8,
    height: 56,
    alignItems: 'center',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  toggleActive: { backgroundColor: colors.primaryLight },
  toggleText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  toggleTextActive: { color: colors.primary, fontWeight: '700' },

  // List view
  listScroll: { padding: spacing.md, gap: 10, paddingBottom: 32 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  filterChipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  filterChipTextActive: { color: colors.primary, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  cardAccepted: {
    borderColor: colors.success,
    backgroundColor: '#F0FDF4',
  },
  cardPending: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  rank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1 },
  meta: { fontSize: 12, color: colors.textSecondary },
  rating: { fontSize: 11, color: colors.textMuted },
  reason: { fontSize: 11, color: colors.primary, lineHeight: 16 },
  acceptedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  acceptedBadgeText: { fontSize: 9, fontWeight: '700', color: colors.success },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingBadgeText: { fontSize: 9, fontWeight: '700', color: '#92400E' },
  cardRight: { alignItems: 'center', gap: 6 },
  openBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
  },
  openBadgeText: { fontSize: 10, fontWeight: '600', color: colors.success },
  fullBadge: {
    backgroundColor: '#FEF3F3',
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
  },
  fullBadgeText: { fontSize: 10, fontWeight: '600', color: colors.danger },
  chatMiniBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMiniBtnText: { fontSize: 14 },
  cardArrow: { fontSize: 18, color: colors.textMuted, textAlign: 'center' },
  legend: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 4,
  },
  legendText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, textAlign: 'center' },
});
