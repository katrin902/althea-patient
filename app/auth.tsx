import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useApp } from '../context/AppContext';

type Mode = 'choice' | 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [mode, setMode] = useState<Mode>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function continueAsGuest() {
    router.push('/personal-details');
  }

  function handleAuth() {
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    router.push('/personal-details');
  }

  if (mode === 'choice') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.sub}>
            You can start your intake without an account. You'll need to create one before uploading documents or sharing information with a provider.
          </Text>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <Button label="Sign up with email" onPress={() => setMode('signup')} />
          <Button label="Log in" onPress={() => setMode('login')} variant="secondary" style={{ marginTop: 10 }} />

          <TouchableOpacity onPress={continueAsGuest} style={styles.skipLink}>
            <Text style={styles.skipText}>Continue without account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{mode === 'login' ? 'Log in' : 'Create account'}</Text>

        <Input
          label="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="your@email.com"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          style={{ marginTop: 12 }}
        />

        <Button
          label={mode === 'login' ? 'Log in' : 'Create account'}
          onPress={handleAuth}
          style={{ marginTop: 20 }}
        />

        <TouchableOpacity onPress={() => setMode('choice')} style={styles.backLink}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  socialBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialBtnText: { fontSize: 16, fontWeight: '500', color: colors.text },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { ...typography.caption, color: colors.textMuted },
  skipLink: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: colors.primary, fontWeight: '500', fontSize: 15 },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  backText: { color: colors.textSecondary, fontSize: 15 },
});
