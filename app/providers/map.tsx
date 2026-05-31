import React, { useMemo } from 'react';
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
import { ProgressBar } from '../../components/ui/ProgressBar';
import { RequestsBar } from '../../components/providers/RequestsBar';

const REC_COLORS = [colors.primary, '#8B5CF6', '#10B981'];

export default function MapViewScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { height: screenH } = useWindowDimensions();

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

  // Requests bar height estimate
  const requestsBarHeight = state.providerRequests.length > 0
    ? 38 + state.providerRequests.length * 50
    : 0;

  // Map gets roughly half the remaining screen height
  const mapHeight = Math.round((screenH - 200 - requestsBarHeight) * 0.55);

  function goToProfile(id: string) {
    router.push({ pathname: '/providers/[id]', params: { id } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ProgressBar step={7} total={8} label="Step 7 of 8: Choose a provider" />

      {/* Requests bar — shown when patient has active requests */}
      <RequestsBar requests={state.providerRequests} />

      {/* Real map */}
      <View style={[styles.mapWrap, { height: mapHeight }]}>
        <ProviderMap
          providers={providerPins}
          userLat={52.366}
          userLng={4.885}
          onViewProfile={goToProfile}
          dom={{ scrollEnabled: false }}
        />
      </View>

      {/* Recommended list below the map */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <Text style={styles.listTitle}>Recommended providers</Text>
        {recommendedProviders.map((p, i) => {
          const request = state.providerRequests.find((r) => r.providerId === p.id);
          const isAccepted = request?.status === 'accepted';
          const isPending = request?.status === 'pending';

          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, isAccepted && styles.cardAccepted, isPending && styles.cardPending]}
              onPress={() => goToProfile(p.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.rank, { backgroundColor: isAccepted ? colors.success : isPending ? '#F59E0B' : REC_COLORS[i] }]}>
                <Text style={styles.rankText}>{isAccepted ? '★' : isPending ? '?' : i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardMeta}>
                  {p.distance} · {p.waitingTime} wait · ⭐ {p.rating}
                </Text>
              </View>

              {isAccepted ? (
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => router.push({ pathname: '/providers/chat', params: { id: p.id } })}
                >
                  <Text style={styles.chatBtnText}>💬 Chat</Text>
                </TouchableOpacity>
              ) : isPending ? (
                <View style={styles.pendingBtn}>
                  <Text style={styles.pendingBtnText}>⏳ Pending</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.chooseBtn}
                  onPress={() => goToProfile(p.id)}
                >
                  <Text style={styles.chooseBtnText}>Request</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
        <Text style={styles.hint}>
          Tap a marker on the map to preview a provider, then tap "View profile →" for full details.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  mapWrap: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  list: { flex: 1 },
  listContent: { padding: spacing.md, gap: 10, paddingBottom: 32 },
  listTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  cardAccepted: { borderColor: colors.success, backgroundColor: '#F0FDF4' },
  cardPending: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  cardName: { fontSize: 14, fontWeight: '600', color: colors.text },
  cardMeta: { fontSize: 12, color: colors.textSecondary },
  chooseBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chooseBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  chatBtn: {
    backgroundColor: '#DCFCE7',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  chatBtnText: { color: '#15803D', fontWeight: '700', fontSize: 13 },
  pendingBtn: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingBtnText: { color: '#92400E', fontWeight: '700', fontSize: 13 },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
});
