import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

export function AltheaFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Althea can make mistakes and does not replace professional mental healthcare. If you are in immediate danger, call 112.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDE8DF',
    backgroundColor: colors.background,
  },
  text: {
    ...typography.small,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
