import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Linking,
  Pressable,
} from 'react-native';
import { colors, radius, shadow } from '../../constants/theme';

export function EmergencyButton() {
  const [visible, setVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  function openModal() {
    setVisible(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
    }).start();
  }

  function closeModal() {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }

  function callNumber(number: string) {
    Linking.openURL(`tel:${number}`).catch(() => {});
  }

  return (
    <>
      {/* Floating SOS button */}
      <Animated.View
        style={[styles.wrapper, { transform: [{ scale: pulseAnim }] }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.button}
          onPress={openModal}
          activeOpacity={0.85}
          accessibilityLabel="Emergency help"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Emergency modal */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal}>
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [400, 0],
                    }),
                  },
                ],
                opacity: modalAnim,
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Handle bar */}
              <View style={styles.handle} />

              <Text style={styles.title}>🆘  Emergency help</Text>
              <Text style={styles.subtitle}>
                You are not alone.{'\n'}Help is available right now.
              </Text>

              {/* Call 112 */}
              <TouchableOpacity
                style={styles.call112}
                onPress={() => callNumber('112')}
                activeOpacity={0.85}
              >
                <View style={styles.callIcon}>
                  <Text style={styles.callIconText}>📞</Text>
                </View>
                <View style={styles.callText}>
                  <Text style={styles.callNumber}>Call 112</Text>
                  <Text style={styles.callDesc}>Immediate danger · Emergency services</Text>
                </View>
                <Text style={styles.callArrow}>›</Text>
              </TouchableOpacity>

              {/* Call 113 */}
              <TouchableOpacity
                style={styles.call113}
                onPress={() => callNumber('08000113')}
                activeOpacity={0.85}
              >
                <View style={styles.callIcon113}>
                  <Text style={styles.callIconText}>💙</Text>
                </View>
                <View style={styles.callText}>
                  <Text style={styles.callNumber113}>Call 113</Text>
                  <Text style={styles.callDesc113}>Suicide Prevention · Available 24/7</Text>
                </View>
                <Text style={styles.callArrow113}>›</Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Althea does not replace professional mental healthcare. If you are in immediate
                  danger, call 112.
                </Text>
              </View>

              <TouchableOpacity style={styles.safeBtn} onPress={closeModal} activeOpacity={0.8}>
                <Text style={styles.safeBtnText}>I am safe for now</Text>
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 78,
    right: 16,
    zIndex: 999,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 28, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    ...shadow.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  call112: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  call113: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  callIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon113: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconText: { fontSize: 20 },
  callText: { flex: 1 },
  callNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.danger,
  },
  callNumber113: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  callDesc: { fontSize: 13, color: '#DC2626', marginTop: 2 },
  callDesc113: { fontSize: 13, color: '#2563EB', marginTop: 2 },
  callArrow: { fontSize: 24, color: colors.danger, fontWeight: '300' },
  callArrow113: { fontSize: 24, color: '#1D4ED8', fontWeight: '300' },
  infoBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  safeBtn: {
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  safeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
