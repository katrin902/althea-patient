import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography } from '../constants/theme';
import { AltheaAvatar } from '../components/ui/AltheaAvatar';
import { useApp } from '../context/AppContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'q1' | 'q2' | 'q3' | 'done';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// ─── Script ───────────────────────────────────────────────────────────────────

const INTRO =
  "Hi 👋 I'm AltHea, your AI support assistant.\n\nI'll ask you 3 short questions to help us find the right support for you. This only takes a minute.";

const Q1 = 'What is your main concern right now?';

const Q2 =
  "Thank you for sharing that — it helps me understand what you're going through.\n\nHow long have you been experiencing this?";

const Q3 =
  "Got it. The duration is really helpful context.\n\nHow severe does this feel for you right now? For example: mild, moderate, or quite overwhelming.";

const FOUND =
  'Based on your assessment, we have found suitable therapists for you. You can now browse and choose a provider that feels right.';

function buildSummary(concern: string, duration: string, severity: string) {
  return (
    `Thank you for sharing this. Based on your answers:\n\n` +
    `• Main concern: ${concern}\n` +
    `• Duration: ${duration}\n` +
    `• Severity: ${severity}\n\n` +
    `This information will help us match you with the most suitable providers.`
  );
}

function msg(role: 'user' | 'assistant', content: string): Message {
  return { id: `${role}-${Date.now()}-${Math.random()}`, role, content };
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AIIntakeScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  // Answers stored in a ref — always current inside timeout callbacks
  const answers = useRef({ concern: '', duration: '', severity: '' });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('intro');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Auto-scroll on every change
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages, isTyping]);

  // Intro sequence on mount
  useEffect(() => {
    setIsTyping(true);
    const t1 = setTimeout(() => {
      setIsTyping(false);
      setMessages([msg('assistant', INTRO)]);
      setIsTyping(true);
      const t2 = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg('assistant', Q1)]);
        setPhase('q1');
      }, 900);
      return () => clearTimeout(t2);
    }, 1000);
    return () => clearTimeout(t1);
  }, []);

  // Show input only when a question is active AND Althea is not typing
  const showInput = (phase === 'q1' || phase === 'q2' || phase === 'q3') && !isTyping;

  const progressLabel =
    phase === 'q1' ? 'Question 1 of 3' :
    phase === 'q2' ? 'Question 2 of 3' :
    phase === 'q3' ? 'Question 3 of 3' :
    phase === 'done' ? 'Complete ✓' : null;

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, msg('user', text)]);
    setIsTyping(true);

    if (phase === 'q1') {
      answers.current.concern = text;
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg('assistant', Q2)]);
        setPhase('q2');
      }, 1200);

    } else if (phase === 'q2') {
      answers.current.duration = text;
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg('assistant', Q3)]);
        setPhase('q3');
      }, 1200);

    } else if (phase === 'q3') {
      answers.current.severity = text;
      const { concern, duration } = answers.current;

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg('assistant', buildSummary(concern, duration, text))]);

        // Persist to app state
        dispatch({ type: 'SET_CURRENT_SITUATION', payload: concern });
        dispatch({ type: 'SET_INTAKE_COMPLETED', payload: true });
        dispatch({ type: 'SET_CURRENT_STATUS', payload: 'intake_completed' });

        // Final message after a beat
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, msg('assistant', FOUND)]);
          setIsDone(true);
          setPhase('done');
        }, 1100);
      }, 1500);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <AltheaAvatar size={34} />
          </View>
          <View>
            <Text style={styles.headerName}>AltHea</Text>
            <Text style={styles.headerSub}>Initial assessment · 3 questions</Text>
          </View>
        </View>
        {progressLabel && (
          <View style={[styles.badge, phase === 'done' && styles.badgeDone]}>
            <Text style={[styles.badgeText, phase === 'done' && styles.badgeTextDone]}>
              {progressLabel}
            </Text>
          </View>
        )}
      </View>

      {/* ── Disclaimer ── */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Althea does not diagnose or provide therapy. If you are in immediate danger, call 112.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >

        {/* ── Messages ── */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.chat}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(m => (
            <View
              key={m.id}
              style={[styles.row, m.role === 'user' && styles.rowUser]}
            >
              {m.role === 'assistant' && (
                <View style={styles.msgAvatar}>
                  <AltheaAvatar size={26} />
                </View>
              )}
              <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, m.role === 'user' && styles.bubbleTextUser]}>
                  {m.content}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.row}>
              <View style={styles.msgAvatar}>
                <AltheaAvatar size={26} />
              </View>
              <View style={[styles.bubble, styles.bubbleBot]}>
                <Text style={styles.typingText}>Althea is typing…</Text>
              </View>
            </View>
          )}

          {isDone && (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => router.push('/providers' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Choose a provider now →</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ── Input ── */}
        {showInput && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type your answer…"
              placeholderTextColor={colors.textMuted}
              multiline
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
              onPress={handleSend}
              disabled={!input.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  headerName: { fontSize: 16, fontWeight: '700', color: colors.text },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  // Progress badge
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeDone: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 12, color: colors.primaryDark, fontWeight: '600' },
  badgeTextDone: { color: '#15803D' },

  // Disclaimer
  disclaimer: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#FDE68A',
  },
  disclaimerText: {
    fontSize: 11, color: '#92400E',
    textAlign: 'center', lineHeight: 16,
  },

  // Chat area
  chat: { padding: 16, gap: 10, paddingBottom: 24 },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '86%',
    alignSelf: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  msgAvatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden',
  },
  bubble: {
    flex: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleBot: {
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  bubbleUser: { backgroundColor: colors.primary },
  bubbleText: { ...typography.body, lineHeight: 22 },
  bubbleTextUser: { color: colors.white },
  typingText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },

  // CTA
  ctaBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },

  // Input row
  inputRow: {
    flexDirection: 'row', gap: 10, padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1, backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 16, color: colors.text,
    maxHeight: 110,
    borderWidth: 1, borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 20, paddingVertical: 11,
  },
  sendBtnOff: { backgroundColor: colors.border },
  sendBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
