import React from 'react';
import { View, Text, StyleSheet, Modal, Linking, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { Button } from './Button';

interface Props {
  visible: boolean;
  onSafe: () => void;
}

export function CrisisOverlay({ visible, onSafe }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>!</Text>
            </View>
          </View>

          <Text style={styles.title}>You may need immediate support</Text>

          <Text style={styles.body}>
            Your message suggests you may be in crisis. Althea cannot provide emergency help.
            Please contact emergency support now.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.disclaimer}>
            If you are in immediate danger or may harm yourself, this app cannot provide emergency help.
            Please call 112 immediately or contact 113 Suicide Prevention in the Netherlands.
            Althea does not replace emergency services or professional crisis care.
          </Text>

          <TouchableOpacity
            style={styles.emergencyBtn}
            onPress={() => Linking.openURL('tel:112')}
            activeOpacity={0.8}
          >
            <Text style={styles.emergencyBtnText}>Call 112 — Emergency Services</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.preventionBtn}
            onPress={() => Linking.openURL('tel:08000113')}
            activeOpacity={0.8}
          >
            <Text style={styles.preventionBtnText}>Contact 113 — Suicide Prevention</Text>
          </TouchableOpacity>

          <Button
            label="I am safe now"
            onPress={onSafe}
            variant="ghost"
            style={styles.safeBtn}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  iconRow: { alignItems: 'center', marginBottom: 4 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.crisisBackground,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22, fontWeight: '700', color: colors.danger },
  title: {
    ...typography.h3,
    textAlign: 'center',
    color: colors.crisisText,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text,
  },
  divider: { height: 1, backgroundColor: colors.border },
  disclaimer: {
    ...typography.small,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emergencyBtn: {
    backgroundColor: colors.danger,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emergencyBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  preventionBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  preventionBtnText: { color: colors.danger, fontSize: 16, fontWeight: '600' },
  safeBtn: { marginTop: 4 },
});
