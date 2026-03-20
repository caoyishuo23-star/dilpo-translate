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
      paddingTop: Spacing.xl,
      paddingBottom: Spacing['4xl'],
    },
    header: {
      marginBottom: Spacing.lg,
    },
    headerTitle: {
      textAlign: 'center',
      marginBottom: 2,
    },
    headerSubtitle: {
      textAlign: 'center',
    },
    // 语言选择器
    languageSelector: {
      flexDirection: 'row',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    languageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundDefault,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.xs,
    },
    languageButtonActive: {
      borderColor: '#B8A9E8',
      backgroundColor: '#F5F0FF',
    },
    languageButtonText: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    languageButtonTextActive: {
      color: '#7C5DC4',
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
      minHeight: 60, // 默认约2行
    },
    input: {
      flex: 1,
      padding: Spacing.md,
      fontSize: 15,
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
      backgroundColor: '#B8A9E8', // 马卡龙紫色
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.lg,
      shadowColor: '#B8A9E8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 2,
    },
    translateButtonDisabled: {
      opacity: 0.6,
    },
    translateButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 15,
    },
    // 结果区域
    resultsContainer: {
      gap: Spacing.md,
    },
    outputSection: {
      marginBottom: Spacing.sm,
    },
    // 主翻译结果（乌尔都语）- 突出显示
    primaryOutputSection: {
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      // 马卡龙色阴影
      shadowColor: '#B8A9E8', // 淡紫色阴影
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    // 深色标题行
    primaryOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#A99BE8', // 马卡龙紫色
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.lg,
    },
    primaryOutputLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    primaryOutputLabelIcon: {
      width: 24,
      height: 24,
      borderRadius: BorderRadius.sm,
      backgroundColor: 'rgba(255,255,255,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryOutputLangTag: {
      backgroundColor: 'rgba(255,255,255,0.3)',
      paddingVertical: 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
    },
    // 浅色内容区
    primaryOutputContainer: {
      backgroundColor: '#F5F0FF', // 马卡龙浅紫色背景
      padding: Spacing.lg,
      minHeight: 80,
    },
    primaryOutputText: {
      fontSize: 18,
      color: theme.textPrimary,
      lineHeight: 28,
      fontWeight: '600', // 乌尔都语加深
    },
    primaryOutputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    primaryCopyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.3)',
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    // 参考翻译（英文）- 次要显示
    referenceOutputSection: {
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: '#A8D8B8', // 马卡龙绿色阴影
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
    },
    referenceOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#98C9A8', // 马卡龙绿色
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.lg,
    },
    referenceOutputLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    referenceOutputLabelIcon: {
      width: 24,
      height: 24,
      borderRadius: BorderRadius.sm,
      backgroundColor: 'rgba(255,255,255,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    referenceOutputContainer: {
      backgroundColor: '#F0F8F2', // 马卡龙浅绿色背景
      padding: Spacing.md,
    },
    referenceLabelText: {
      color: '#FFFFFF',
    },
    referenceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.3)',
      paddingVertical: 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
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
    outputText: {
      fontSize: 14,
      color: theme.textPrimary,
      lineHeight: 22,
    },
    outputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    outputContainer: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 100,
      padding: Spacing.lg,
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
    // 紧凑的历史记录项
    historyItemCompact: {
      backgroundColor: '#FFF8F0', // 马卡龙米色
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: '#F0E6D8',
    },
    historyItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    historyItemSource: {
      color: theme.textPrimary,
      fontSize: 14,
      flex: 1,
    },
    historyItemDivider: {
      color: theme.textMuted,
      fontSize: 12,
    },
    historyItemUrdu: {
      color: '#7C5DC4', // 紫色加深
      fontSize: 14,
      fontWeight: '600',
      flex: 1.2,
      textAlign: 'right',
    },
    historyItemEnglish: {
      color: theme.textSecondary,
      fontSize: 13,
      flex: 1,
    },
    historyItemDelete: {
      padding: Spacing.xs,
      marginLeft: Spacing.sm,
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
      paddingVertical: Spacing['2xl'],
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
