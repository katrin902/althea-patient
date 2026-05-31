import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface Props {
  step: number;
  total: number;
  label?: string;
}

export function ProgressBar({ step, total, label }: Props) {
  const progress = Math.min(step / total, 1);
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.label}>{label ?? `Step ${step} of ${total}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  track: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  label: { ...typography.small, color: colors.textSecondary },
});
