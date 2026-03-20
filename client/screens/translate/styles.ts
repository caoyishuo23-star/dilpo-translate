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
    // 语言选择器
    languageSelector: {
      flexDirection: 'row',
      marginBottom: Spacing.xl,
      gap: Spacing.sm,
    },
    languageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundDefault,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.sm,
    },
    languageButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '15',
    },
    languageButtonText: {
      color: theme.textPrimary,
    },
    languageButtonTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    // 输入区域
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
    // 翻译按钮
    translateButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    translateButtonDisabled: {
      opacity: 0.6,
    },
    translateButtonText: {
      color: theme.buttonPrimaryText,
      fontWeight: '600',
      fontSize: 16,
    },
    // 结果区域
    resultsContainer: {
      gap: Spacing.lg,
    },
    outputSection: {
      marginBottom: Spacing.sm,
    },
    // 主翻译结果（乌尔都语）- 突出显示
    primaryOutputSection: {
      marginBottom: Spacing.sm,
    },
    primaryOutputContainer: {
      backgroundColor: theme.primary + '10',
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.primary,
      minHeight: 120,
      padding: Spacing.lg,
    },
    primaryOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    primaryOutputLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    primaryOutputLabelIcon: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryOutputText: {
      fontSize: 20,
      color: theme.textPrimary,
      lineHeight: 32,
      fontWeight: '500',
    },
    primaryOutputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    // 参考翻译（英文）- 次要显示
    referenceOutputSection: {
      marginBottom: Spacing.sm,
      opacity: 0.8,
    },
    referenceLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    outputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    outputLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    outputLabelIcon: {
      width: 32,
      height: 32,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outputContainer: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 100,
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
    // 历史记录
    historySection: {
      marginTop: Spacing.xl,
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
