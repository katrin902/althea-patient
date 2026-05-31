import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../../constants/theme';
import { mockProviders } from '../../data/mockProviders';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  from: 'patient' | 'provider' | 'system';
  text: string;
  time: string;
}

const ACCEPTED_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    from: 'provider',
    text: "Hello Sophie, thank you for reaching out. We've reviewed your intake summary and we're pleased to welcome you as a patient. Your first intake appointment has been scheduled for June 24 at 14:00 at our Herengracht location.",
    time: 'Jun 3',
  },
  {
    id: 'm2',
    from: 'patient',
    text: "Thank you so much! I'm really relieved. Is there anything I should prepare or bring to the first session?",
    time: 'Jun 3',
  },
  {
    id: 'm3',
    from: 'provider',
    text: "Please bring your GP referral letter. If you're currently taking any medication, make a note of the name and dosage. We recommend arriving 10 minutes early for registration. Looking forward to meeting you!",
    time: 'Jun 4',
  },
  {
    id: 'm4',
    from: 'patient',
    text: "Got it, I'll make sure to have everything ready. See you on the 24th!",
    time: 'Jun 4',
  },
];

const PENDING_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    from: 'system',
    text: 'Your request was sent on Jun 10. GGZ Noord-Holland will review your intake summary and respond within 3–5 working days. You will receive a notification when they respond.',
    time: 'Jun 10',
  },
  {
    id: 'm2',
    from: 'patient',
    text: "Hi, I've been experiencing anxiety and stress mainly related to my studies at university. I'm looking for CBT-based support and would love to hear more about your approach to treatment.",
    time: 'Jun 10',
  },
];

export default function ProviderChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();

  const provider = mockProviders.find((p) => p.id === id);
  const request = state.providerRequests.find((r) => r.providerId === id);

  const isAccepted = request?.status === 'accepted';
  const isPending = request?.status === 'pending';

  const baseMessages = isAccepted ? ACCEPTED_MESSAGES : PENDING_MESSAGES;
  const [messages, setMessages] = useState<ChatMessage[]>(baseMessages);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  if (!provider || !request) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No active request</Text>
          <Text style={styles.emptyText}>
            You haven't sent a request to this provider yet.
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()}>
            <Text style={styles.emptyBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  function sendMessage() {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      from: 'patient',
      text: inputText.trim(),
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.avatar, isAccepted ? styles.avatarAccepted : styles.avatarPending]}>
            <Text style={[styles.avatarText, isAccepted ? styles.avatarTextAccepted : styles.avatarTextPending]}>
              {provider.name.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName} numberOfLines={1}>
              {provider.name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isAccepted ? styles.acceptedBadge : styles.pendingBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isAccepted ? styles.acceptedText : styles.pendingText,
                ]}
              >
                {isAccepted ? '✓ Accepted' : '⏳ Request pending'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push({ pathname: '/providers/[id]', params: { id: provider.id } })}
          activeOpacity={0.7}
        >
          <Text style={styles.profileBtnText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ── Pending banner ── */}
      {isPending && (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingBannerIcon}>⏳</Text>
          <Text style={styles.pendingBannerText}>
            Waiting for response · Usually 3–5 working days
          </Text>
        </View>
      )}

      {/* ── Messages ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          if (msg.from === 'system') {
            return (
              <View key={msg.id} style={styles.systemMsgWrap}>
                <View style={styles.systemMsg}>
                  <Text style={styles.systemMsgText}>{msg.text}</Text>
                </View>
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
            );
          }
          const isPatient = msg.from === 'patient';
          return (
            <View
              key={msg.id}
              style={[
                styles.msgRow,
                isPatient ? styles.msgRowRight : styles.msgRowLeft,
              ]}
            >
              {!isPatient && (
                <View style={styles.msgAvatar}>
                  <Text style={styles.msgAvatarText}>{provider.name.charAt(0)}</Text>
                </View>
              )}
              <View style={styles.msgBody}>
                <View
                  style={[
                    styles.bubble,
                    isPatient ? styles.bubblePatient : styles.bubbleProvider,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isPatient && styles.bubbleTextPatient,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
                <Text style={[styles.msgTime, isPatient && { textAlign: 'right' }]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── Input bar ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            🔒 Secure · Monitored for safety · Not for emergencies — call 112
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  emptyBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backText: { fontSize: 28, color: colors.primary, lineHeight: 32 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarAccepted: { backgroundColor: '#DCFCE7' },
  avatarPending: { backgroundColor: '#FEF3C7' },
  avatarText: { fontSize: 16, fontWeight: '800' },
  avatarTextAccepted: { color: '#15803D' },
  avatarTextPending: { color: '#92400E' },
  headerName: { fontSize: 14, fontWeight: '700', color: colors.text },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  acceptedBadge: { backgroundColor: '#DCFCE7' },
  pendingBadge: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: '700' },
  acceptedText: { color: '#15803D' },
  pendingText: { color: '#92400E' },
  profileBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
  },
  profileBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  // Pending banner
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  pendingBannerIcon: { fontSize: 14 },
  pendingBannerText: { fontSize: 12, color: '#92400E', fontWeight: '500' },

  // Messages
  messages: { flex: 1 },
  messagesContent: {
    padding: spacing.md,
    gap: 12,
    paddingBottom: 8,
  },

  // System message
  systemMsgWrap: { alignItems: 'center', gap: 4 },
  systemMsg: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  systemMsgText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Chat rows
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowLeft: { justifyContent: 'flex-start' },
  msgRowRight: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msgAvatarText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  msgBody: { maxWidth: '75%', gap: 2 },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  bubbleProvider: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubblePatient: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bubbleTextPatient: { color: colors.white },
  msgTime: { fontSize: 10, color: colors.textMuted, paddingHorizontal: 4 },

  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: { fontSize: 18, color: colors.white, fontWeight: '700' },

  // Disclaimer
  disclaimer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
    paddingTop: 2,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
