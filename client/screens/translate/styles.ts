import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA', // 更浅的背景
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
      color: '#1A1A2E', // 深色标题
    },
    headerSubtitle: {
      textAlign: 'center',
      color: '#666666',
    },
    // 语言选择器 - 左右箭头形式
    languageSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.xl,
      padding: Spacing.sm,
      borderWidth: 1,
      borderColor: '#E8E8E8',
    },
    langSelectButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: '#F8F5FF',
      borderRadius: BorderRadius.lg,
    },
    langSelectText: {
      color: '#6B5B95',
      fontSize: 15,
      fontWeight: '600',
    },
    swapButton: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.full,
      backgroundColor: '#6B5B95',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: Spacing.xs,
      shadowColor: '#6B5B95',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    targetLangButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: '#F5F5F5',
      borderRadius: BorderRadius.lg,
    },
    targetLangText: {
      color: '#666666',
      fontSize: 14,
      fontWeight: '500',
    },
    languageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      gap: Spacing.xs,
    },
    languageButtonActive: {
      borderColor: '#C4B5E8', // 淡紫色边框
      backgroundColor: '#F8F5FF', // 更浅的紫色背景
    },
    languageButtonText: {
      color: '#666666',
      fontSize: 13,
    },
    languageButtonTextActive: {
      color: '#6B5B95', // 清晰的紫色文字
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
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      minHeight: 60,
    },
    input: {
      flex: 1,
      padding: Spacing.md,
      fontSize: 15,
      color: '#1A1A2E', // 清晰的深色文字
      textAlignVertical: 'top',
    },
    inputRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    inputActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: Spacing.sm,
      gap: Spacing.sm,
    },
    inputActionButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.sm,
      backgroundColor: '#F5F5F5',
    },
    // 语音按钮
    voiceButton: {
      padding: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: '#F0EBFF', // 淡紫色背景
    },
    voiceButtonActive: {
      backgroundColor: '#D4C4FF', // 录音时更深的紫色
    },
    // 翻译按钮
    translateButton: {
      backgroundColor: '#C4B5E8', // 淡紫色
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.lg,
      shadowColor: '#C4B5E8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
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
    // 主翻译结果（乌尔都语）
    primaryOutputSection: {
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: '#C4B5E8',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    primaryOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#B8A9D8', // 淡紫色标题
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
      backgroundColor: 'rgba(255,255,255,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryOutputLangTag: {
      backgroundColor: 'rgba(255,255,255,0.35)',
      paddingVertical: 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
    },
    primaryOutputContainer: {
      backgroundColor: '#FAF8FF', // 更浅的紫色背景
      padding: Spacing.lg,
      minHeight: 80,
    },
    primaryOutputText: {
      fontSize: 18,
      color: '#1A1A2E', // 清晰的深色文字
      lineHeight: 28,
      fontWeight: '600',
    },
    primaryOutputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    primaryCopyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.35)',
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    // 参考翻译（英文）
    referenceOutputSection: {
      marginBottom: Spacing.sm,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      shadowColor: '#A8C8B8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    referenceOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#A8C8B8', // 淡绿色标题
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
      backgroundColor: 'rgba(255,255,255,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    referenceOutputContainer: {
      backgroundColor: '#F8FFF8', // 更浅的绿色背景
      padding: Spacing.md,
    },
    referenceLabelText: {
      color: '#FFFFFF',
    },
    referenceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: 'rgba(255,255,255,0.35)',
      paddingVertical: 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
    },
    outputText: {
      fontSize: 14,
      color: '#1A1A2E', // 清晰的深色文字
      lineHeight: 22,
    },
    outputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    outputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#E8E8E8',
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
      color: '#1A1A2E',
    },
    clearAllButton: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
    },
    clearAllButtonText: {
      color: '#E57373',
    },
    historyList: {
      gap: Spacing.sm,
    },
    historyItemCompact: {
      backgroundColor: '#FFFDF8', // 米白色背景
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: '#F0E8D8',
    },
    historyItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    historyItemSource: {
      color: '#1A1A2E', // 清晰的深色
      fontSize: 14,
      flex: 1,
    },
    historyItemDivider: {
      color: '#999999',
      fontSize: 12,
    },
    historyItemUrdu: {
      color: '#6B5B95', // 紫色加深
      fontSize: 14,
      fontWeight: '600',
      flex: 1.2,
      textAlign: 'right',
    },
    historyItemEnglish: {
      color: '#555555',
      fontSize: 13,
      flex: 1,
    },
    historyItemDelete: {
      padding: Spacing.xs,
      marginLeft: Spacing.sm,
    },
    historyItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: '#E8E8E8',
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
      color: '#1A1A2E',
      marginBottom: Spacing.xs,
    },
    historyItemTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    historyItemTranslation: {
      color: '#555555',
    },
    emptyHistory: {
      alignItems: 'center',
      paddingVertical: Spacing['2xl'],
    },
    emptyHistoryText: {
      color: '#999999',
      marginTop: Spacing.md,
    },
    errorContainer: {
      backgroundColor: '#FFEBEE',
      borderRadius: BorderRadius.md,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    errorText: {
      color: '#C62828',
      textAlign: 'center',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
  });
};
