import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/AppContext';

const documentTypes = ['GP referral letter', 'Previous diagnosis report', 'Medication list', 'Insurance document', 'Other'];

interface UploadedFile {
  name: string;
  type: string;
  size: string;
}

export default function ReferralUploadScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [simulating, setSimulating] = useState(false);

  function simulateUpload(docType: string) {
    setSimulating(true);
    setTimeout(() => {
      setUploaded((prev) => [
        ...prev,
        { name: `${docType.replace(/\s/g, '_')}.pdf`, type: docType, size: '234 KB' },
      ]);
      setSimulating(false);
      if (docType === 'GP referral letter') {
        dispatch({ type: 'SET_REFERRAL_STATUS', payload: 'uploaded' });
      }
    }, 1200);
  }

  function handleContinue() {
    router.push('/providers/index');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProgressBar step={6} total={8} label="Step 6 of 8: Upload documents" />

        <Text style={styles.title}>Upload your documents</Text>
        <Text style={styles.sub}>
          Upload your GP referral letter and any other relevant documents. These will be shared with your chosen provider only after your approval.
        </Text>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyNoteText}>
            Documents are stored securely and only visible to your chosen provider after you give consent.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Select document type to upload</Text>

        <View style={styles.docTypes}>
          {documentTypes.map((docType) => {
            const isUploaded = uploaded.some((u) => u.type === docType);
            return (
              <TouchableOpacity
                key={docType}
                onPress={() => !isUploaded && simulateUpload(docType)}
                style={[styles.docTypeBtn, isUploaded && styles.docTypeBtnDone]}
                disabled={simulating || isUploaded}
                activeOpacity={0.8}
              >
                <Text style={styles.docTypeIcon}>{isUploaded ? '✓' : '📎'}</Text>
                <View style={styles.docTypeText}>
                  <Text style={[styles.docTypeName, isUploaded && styles.docTypeDoneText]}>{docType}</Text>
                  {isUploaded ? (
                    <Text style={styles.docUploaded}>Uploaded</Text>
                  ) : (
                    <Text style={styles.docTypeHint}>Tap to upload (PDF, JPG, PNG, Word)</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {uploaded.length > 0 && (
          <View style={styles.uploadedSection}>
            <Text style={styles.sectionLabel}>Uploaded documents</Text>
            {uploaded.map((file, i) => (
              <View key={i} style={styles.fileCard}>
                <View style={styles.fileIcon}><Text style={styles.fileIconText}>📄</Text></View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileMeta}>{file.type} · {file.size}</Text>
                </View>
                <View style={styles.fileStatus}>
                  <Text style={styles.fileStatusText}>Ready</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {simulating && (
          <View style={styles.uploadingIndicator}>
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        )}

        <View style={styles.extractNote}>
          <Text style={styles.extractTitle}>Document extraction</Text>
          <Text style={styles.extractBody}>
            Althea will extract key information from your referral letter to pre-fill your intake. You can review extracted information before sharing.
          </Text>
          {uploaded.some((u) => u.type === 'GP referral letter') && (
            <View style={styles.extractPreview}>
              <Text style={styles.extractPreviewTitle}>Extracted from referral:</Text>
              <Text style={styles.extractPreviewText}>Patient: [Your name]</Text>
              <Text style={styles.extractPreviewText}>Referred by: Dr. J. de Boer, GP</Text>
              <Text style={styles.extractPreviewText}>Referral type: Basis GGZ</Text>
              <Text style={styles.extractPreviewText}>Date: June 2025</Text>
              <Text style={styles.extractPreviewNote}>* This is a simulated extraction for the MVP.</Text>
            </View>
          )}
        </View>

        <Button label="Continue to providers" onPress={handleContinue} style={styles.cta} />
        <Button
          label="Skip for now"
          onPress={handleContinue}
          variant="ghost"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: 40, gap: 16 },
  title: { ...typography.h2 },
  sub: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  privacyNote: {
    backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 12,
  },
  privacyNoteText: { fontSize: 13, color: colors.primaryDark, lineHeight: 18 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  docTypes: { gap: 8 },
  docTypeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border,
  },
  docTypeBtnDone: { borderColor: colors.success, backgroundColor: '#F0FDF4' },
  docTypeIcon: { fontSize: 22 },
  docTypeText: { flex: 1, gap: 2 },
  docTypeName: { fontSize: 15, fontWeight: '600', color: colors.text },
  docTypeDoneText: { color: colors.success },
  docUploaded: { fontSize: 12, color: colors.success, fontWeight: '500' },
  docTypeHint: { fontSize: 12, color: colors.textMuted },
  uploadedSection: { gap: 8 },
  fileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface,
    borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: '#BBF7D0',
  },
  fileIcon: {
    width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#F0FDF4',
    alignItems: 'center', justifyContent: 'center',
  },
  fileIconText: { fontSize: 20 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: colors.text },
  fileMeta: { fontSize: 12, color: colors.textSecondary },
  fileStatus: {
    backgroundColor: '#F0FDF4', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  fileStatusText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  uploadingIndicator: {
    backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 12, alignItems: 'center',
  },
  uploadingText: { color: colors.primaryDark, fontWeight: '500' },
  extractNote: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16,
    borderWidth: 1, borderColor: colors.border, gap: 8,
  },
  extractTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  extractBody: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  extractPreview: {
    backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: 12, gap: 4, marginTop: 4,
  },
  extractPreviewTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4 },
  extractPreviewText: { fontSize: 13, color: colors.textSecondary },
  extractPreviewNote: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontStyle: 'italic' },
  cta: { marginTop: 4 },
});
