import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography, spacing } from '../constants/theme';
import { CrisisOverlay } from '../components/ui/CrisisOverlay';
import { AltheaFooter } from '../components/ui/AltheaFooter';
import { AltheaAvatar } from '../components/ui/AltheaAvatar';
import { useApp } from '../context/AppContext';
import { intakeQuestions, mockFollowUpResponses, crisisKeywords } from '../data/mockIntake';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function IntakeChatScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', role: 'assistant', content: intakeQuestions[0] },
  ]);
  const [input, setInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [intakeDone, setIntakeDone] = useState(false);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  function detectCrisis(text: string) {
    const lower = text.toLowerCase();
    return crisisKeywords.some((kw) => lower.includes(kw));
  }

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');

    if (detectCrisis(userMsg)) {
      setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: 'user', content: userMsg }]);
      setShowCrisis(true);
      return;
    }

    const newUserMsg: Message = { id: `u${Date.now()}`, role: 'user', content: userMsg };
    setMessages((prev) => [...prev, newUserMsg]);
    dispatch({ type: 'ADD_INTAKE_MESSAGE', payload: { role: 'user', content: userMsg } });

    const nextIndex = questionIndex + 1;
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (nextIndex < intakeQuestions.length) {
        const response = mockFollowUpResponses[questionIndex] + '\n\n' + intakeQuestions[nextIndex];
        const assistantMsg: Message = { id: `a${Date.now()}`, role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMsg]);
        setQuestionIndex(nextIndex);
      } else {
        const doneMsg: Message = {
          id: `a${Date.now()}`,
          role: 'assistant',
          content:
            "Thank you for answering all my questions. I've prepared a summary based on what you've shared.\n\nPlease review it before we continue — you can edit it or ask me to revise anything.",
        };
        setMessages((prev) => [...prev, doneMsg]);
        setIntakeDone(true);
        dispatch({ type: 'SET_INTAKE_COMPLETED', payload: true });
      }
    }, 1200);
  }

  const progress = Math.round(((questionIndex) / intakeQuestions.length) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarWrap}>
                <AltheaAvatar size={34} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Althea</Text>
                <Text style={styles.headerSub}>Intake questionnaire</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => {
                dispatch({ type: 'SET_INTAKE_COMPLETED', payload: true });
                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                router.replace('/(tabs)' as any);
              }}
              activeOpacity={0.75}
            >
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progress}% complete</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubbleRow, msg.role === 'user' && styles.bubbleRowUser]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.bubbleAvatarWrap}>
                  <AltheaAvatar size={26} />
                </View>
              )}
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.bubbleRow}>
              <View style={styles.bubbleAvatarWrap}>
                <AltheaAvatar size={26} />
              </View>
              <View style={[styles.bubble, styles.assistantBubble]}>
                <Text style={styles.typingText}>Althea is typing…</Text>
              </View>
            </View>
          )}
          {intakeDone && (
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => router.push('/intake-summary')}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Review my summary</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type your answer..."
            placeholderTextColor={colors.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
            editable={!intakeDone}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, (!input.trim() || intakeDone) && styles.sendBtnDisabled]}
            disabled={!input.trim() || intakeDone}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>

        <AltheaFooter />
      </KeyboardAvoidingView>

      <CrisisOverlay
        visible={showCrisis}
        onSafe={() => {
          setShowCrisis(false);
          const safeMsg: Message = {
            id: `a${Date.now()}`,
            role: 'assistant',
            content:
              "I'm glad you're safe. Please reach out to a professional if things feel difficult. We can continue when you're ready.",
          };
          setMessages((prev) => [...prev, safeMsg]);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  headerSub: { fontSize: 12, color: colors.textSecondary },
  skipBtn: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  progressLabel: { fontSize: 11, color: colors.textMuted },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12, paddingBottom: 20 },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  bubbleRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  bubbleAvatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  bubble: {
    borderRadius: radius.lg,
    padding: 13,
    flex: 1,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  bubbleText: { ...typography.body, lineHeight: 22 },
  userBubbleText: { color: colors.white },
  typingText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
