import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, shadow } from '../../constants/theme';
import { ProviderRequest } from '../../context/AppContext';
import { mockProviders } from '../../data/mockProviders';

interface Props {
  requests: ProviderRequest[];
}

export function RequestsBar({ requests }: Props) {
  const router = useRouter();

  if (requests.length === 0) return null;

  // Sort: accepted first, then pending, then rejected
  const sorted = [...requests].sort((a, b) => {
    const order = { accepted: 0, pending: 1, rejected: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Your provider requests</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{requests.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {sorted.map((req, index) => {
          const provider = mockProviders.find((p) => p.id === req.providerId);
          const isAccepted = req.status === 'accepted';
          const isPending = req.status === 'pending';
          const isLast = index === sorted.length - 1;

          return (
            <View
              key={req.providerId}
              style={[styles.row, !isLast && styles.rowDivider]}
            >
              {/* Status dot */}
              <View style={[styles.dot, isAccepted ? styles.dotAccepted : styles.dotPending]} />

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {req.providerName}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {provider?.type ?? ''} · {provider?.distance ?? ''}
                  {isAccepted && req.acceptedAt
                    ? ` · Accepted ${req.acceptedAt}`
                    : isPending
                    ? ` · Requested ${req.requestedAt}`
                    : ''}
                </Text>
              </View>

              {/* Status badge */}
              <View
                style={[
                  styles.statusBadge,
                  isAccepted ? styles.acceptedBadge : styles.pendingBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isAccepted ? styles.acceptedText : styles.pendingText,
                  ]}
                >
                  {isAccepted ? '✓ Accepted' : '⏳ Pending'}
                </Text>
              </View>

              {/* Chat button */}
              <TouchableOpacity
                style={[styles.chatBtn, isAccepted ? styles.chatBtnAccepted : styles.chatBtnPending]}
                onPress={() =>
                  router.push({ pathname: '/providers/chat', params: { id: req.providerId } })
                }
                activeOpacity={0.75}
              >
                <Text style={[styles.chatBtnText, isAccepted && styles.chatBtnTextAccepted]}>
                  💬
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  heading: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  dotAccepted: {
    backgroundColor: colors.success,
  },
  dotPending: {
    backgroundColor: '#F59E0B',
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  acceptedBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  acceptedText: {
    color: '#15803D',
  },
  pendingText: {
    color: '#92400E',
  },
  chatBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
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
  chatBtnText: {
    fontSize: 15,
  },
  chatBtnTextAccepted: {},
});
