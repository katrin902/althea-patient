import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography } from '../constants/theme';
import { AltheaFooter } from '../components/ui/AltheaFooter';
import { useApp } from '../context/AppContext';
import { mockProviders } from '../data/mockProviders';

const institutionQuestions = [
  "Welcome to the {PROVIDER} intake. I'll ask a few additional questions specific to this provider.\n\nHave you been in contact with this provider before?",
  "Are there specific days or times that work best for appointments?",
  "Do you have a preference for the gender of your therapist?",
  "Is there anything specific you hope to work on or achieve through your sessions here?",
  "Do you have any accessibility needs we should know about?",
  "Is there anything else you'd like us to know before your first appointment?",
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function InstitutionIntakeScreen() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const scrollRef = useRef<ScrollView>(null);
  const acceptedRequest = state.providerRequests.find((r) => r.status === 'accepted');
  const provider = mockProviders.find((p) => p.id === (acceptedRequest?.providerId ?? state.providerRequests[0]?.providerId));

  const firstQuestion = institutionQuestions[0].replace('{PROVIDER}', provider?.name ?? 'your provider');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', role: 'assistant', content: firstQuestion },
  ]);
  const [input, setInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: 'user', content: userMsg }]);

    const nextIndex = questionIndex + 1;
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (nextIndex < institutionQuestions.length) {
        const q = institutionQuestions[nextIndex].replace('{PROVIDER}', provider?.name ?? 'your provider');
        setMessages((prev) => [...prev, { id: `a${Date.now()}`, role: 'assistant', content: q }]);
        setQuestionIndex(nextIndex);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a${Date.now()}`,
            role: 'assistant',
            content:
              "Thank you. I have recorded your answers for the provider's intake.\n\nYou're all set. Your provider will receive your information once you approve it. You can now visit your dashboard to track your next steps.",
          },
        ]);
        setDone(true);
        dispatch({ type: 'SET_CURRENT_STATUS', payload: 'waiting' });
      }
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{provider?.name ?? 'Provider intake'}</Text>
          <Text style={styles.headerSub}>Institution-specific questionnaire</Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              {msg.role === 'assistant' && <View style={styles.avatarDot} />}
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>{msg.content}</Text>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.bubble, styles.assistantBubble]}>
              <View style={styles.avatarDot} />
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          )}
          {done && (
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => router.replace('/(tabs)/index' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Go to my dashboard</Text>
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
            editable={!done}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, (!input.trim() || done) && styles.sendBtnDisabled]}
            disabled={!input.trim() || done}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
        <AltheaFooter />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  header: {
    backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  headerSub: { fontSize: 12, color: colors.textSecondary },
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 12, paddingBottom: 20 },
  bubble: { maxWidth: '82%', borderRadius: radius.lg, padding: 14, flexDirection: 'row', gap: 8 },
  assistantBubble: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border },
  userBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  avatarDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6, flexShrink: 0 },
  bubbleText: { ...typography.body, flex: 1, lineHeight: 22 },
  userText: { color: colors.white },
  typingText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  doneBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  doneBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  inputRow: {
    flexDirection: 'row', gap: 10, padding: 12,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end',
  },
  textInput: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.lg,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: colors.text,
    maxHeight: 120, borderWidth: 1, borderColor: colors.border,
  },
  sendBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: 18, paddingVertical: 10 },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
