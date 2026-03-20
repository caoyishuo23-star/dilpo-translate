import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundRoot,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing['4xl'],
    },
    header: {
      marginBottom: Spacing.xl,
    },
    headerTitle: {
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    headerSubtitle: {
      textAlign: 'center',
    },
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
      gap: Spacing.md,
    },
    languageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundDefault,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.sm,
    },
    languageButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.backgroundTertiary,
    },
    languageButtonText: {
      color: theme.textPrimary,
    },
    languageButtonTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    swapButton: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputSection: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      marginBottom: Spacing.sm,
    },
    inputContainer: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 120,
    },
    input: {
      flex: 1,
      padding: Spacing.lg,
      fontSize: 16,
      color: theme.textPrimary,
      textAlignVertical: 'top',
    },
    inputRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    inputActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: Spacing.sm,
      gap: Spacing.xs,
    },
    inputActionButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.sm,
      backgroundColor: theme.backgroundTertiary,
    },
    translateButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    translateButtonDisabled: {
      opacity: 0.6,
    },
    translateButtonText: {
      color: theme.buttonPrimaryText,
      fontWeight: '600',
      fontSize: 16,
    },
    outputSection: {
      marginBottom: Spacing.lg,
    },
    outputContainer: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 120,
      padding: Spacing.lg,
    },
    outputText: {
      fontSize: 16,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    outputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    outputActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      padding: Spacing.sm,
      gap: Spacing.xs,
    },
    historySection: {
      marginTop: Spacing.lg,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    historyTitle: {
      color: theme.textPrimary,
    },
    clearAllButton: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
    },
    clearAllButtonText: {
      color: theme.error,
    },
    historyList: {
      gap: Spacing.sm,
    },
    historyItem: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.lg,
    },
    historyItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    historyItemLang: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    historyItemDelete: {
      padding: Spacing.xs,
    },
    historyItemText: {
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    historyItemTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    historyItemTranslation: {
      color: theme.textSecondary,
    },
    emptyHistory: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyHistoryText: {
      color: theme.textMuted,
      marginTop: Spacing.md,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    errorContainer: {
      backgroundColor: theme.error + '15',
      borderRadius: BorderRadius.md,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    errorText: {
      color: theme.error,
      textAlign: 'center',
    },
  });
};
