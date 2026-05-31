import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography } from '../../constants/theme';
import { CrisisOverlay } from '../../components/ui/CrisisOverlay';
import { AltheaFooter } from '../../components/ui/AltheaFooter';
import { AltheaAvatar } from '../../components/ui/AltheaAvatar';
import { crisisKeywords } from '../../data/mockIntake';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: Message[] = [
  {
    id: 'm0',
    role: 'assistant',
    content:
      "Hello. I'm Althea, your support assistant. I'm here to help you while you wait for your appointment.\n\nI can help you with coping strategies, preparation for your appointment, or just talk through how you're feeling. What's on your mind?",
  },
];

const supportResponses = [
  "Thank you for sharing that with me. It sounds like things have been challenging lately. When you feel overwhelmed, it can help to focus on small, manageable steps. Would you like to try a brief breathing exercise?",
  "I hear you. What you're feeling is understandable. While I'm not a therapist and can't provide treatment, I can help you prepare for your appointment. Would you like to think through what you want to share with your provider?",
  "That's worth noting — you might want to mention that to your provider at your first appointment. Is there anything specific you'd like help preparing for that conversation?",
  "Waiting for care can feel difficult. Your feelings are valid. If at any point things feel urgent, please don't hesitate to contact 113 Suicide Prevention or call 112. Is there a coping strategy you've found helpful before?",
  "I understand. Let's take this one step at a time. One thing that some people find helpful is writing down their thoughts before a difficult period. Would you like me to suggest a simple journaling prompt?",
];

let responseIndex = 0;

export default function ChatScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

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
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: 'user', content: userMsg }]);

    if (detectCrisis(userMsg)) {
      setShowCrisis(true);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = supportResponses[responseIndex % supportResponses.length];
      responseIndex++;
      setMessages((prev) => [...prev, { id: `a${Date.now()}`, role: 'assistant', content: response }]);
    }, 1200);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* ── Chat header ── */}
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderAvatar}>
          <AltheaAvatar size={38} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.chatHeaderName}>Althea</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>AI Support · Available 24/7</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.bubbleRow, msg.role === 'user' && styles.bubbleRowUser]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.avatarWrap}>
                  <AltheaAvatar size={28} />
                </View>
              )}
              <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.bubbleRow}>
              <View style={styles.avatarWrap}>
                <AltheaAvatar size={28} />
              </View>
              <View style={[styles.bubble, styles.assistantBubble]}>
                <Text style={styles.typingText}>Althea is typing…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Talk to Althea..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            disabled={!input.trim()}
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
          setMessages((prev) => [
            ...prev,
            {
              id: `a${Date.now()}`,
              role: 'assistant',
              content: "I'm glad you're safe. Please remember that professional support is available. You can continue when you're ready.",
            },
          ]);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },

  // ── Header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatHeaderAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatHeaderName: { fontSize: 16, fontWeight: '700', color: colors.text },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  onlineText: { fontSize: 12, color: colors.textSecondary },

  // ── Messages
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 10, paddingBottom: 20 },
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
  avatarWrap: {
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
  userBubble: { backgroundColor: colors.primary },
  bubbleText: { ...typography.body, lineHeight: 22 },
  userText: { color: colors.white },
  typingText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },

  // ── Input
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
