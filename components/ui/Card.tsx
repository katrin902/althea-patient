import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../../constants/theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'muted' | 'outline' | 'crisis';
}

export function Card({ children, style, variant = 'default' }: Props) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.sm,
  },
  default: {
    backgroundColor: colors.surface,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  crisis: {
    backgroundColor: colors.crisisBackground,
    borderWidth: 1,
    borderColor: colors.crisisBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
});
