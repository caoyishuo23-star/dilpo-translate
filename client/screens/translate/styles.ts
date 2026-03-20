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
      paddingTop: Spacing.md, // 减少顶部 padding，让 Screen 的安全区生效
      paddingBottom: Spacing['4xl'],
    },
    header: {
      marginBottom: Spacing.lg,
      alignItems: 'center',
      backgroundColor: '#8B7DB8', // 深紫色背景
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.xl, // 添加圆角，更现代
      marginTop: Spacing.sm, // 增加顶部间距，避免遮挡状态栏
    },
    headerTitleContainer: {
      backgroundColor: 'transparent', // 透明，使用header的背景
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
    },
    headerTitle: {
      textAlign: 'center',
      color: '#FFFFFF', // 白色文字
      fontWeight: '700',
      letterSpacing: 2,
    },
    headerSubtitle: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.85)', // 半透明白色
    },
    // 语言选择器 - 简洁形式
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
    arrowButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.full,
      backgroundColor: '#8B7DB8',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#8B7DB8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    targetLangButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.md,
      backgroundColor: '#F5F5F5',
      borderRadius: BorderRadius.lg,
    },
    targetLangText: {
      color: '#666666',
      fontSize: 14,
      fontWeight: '500',
    },
    // 检测语言提示
    detectedLangInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.md,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: '#F8F5FF',
      borderRadius: BorderRadius.lg,
    },
    detectedLangText: {
      color: '#6B5B95',
      fontSize: 13,
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
      backgroundColor: '#8B7DB8', // 深紫色，与标题一致
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.lg,
      shadowColor: '#8B7DB8',
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
    resultsWrapper: {
      backgroundColor: '#F8F5FF',
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      borderWidth: 2,
      borderColor: '#E8E0F0',
    },
    resultsContainer: {
      gap: Spacing.md,
    },
    // 主翻译结果（第二语言）
    primaryOutputSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    secondaryOutputSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    outputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    outputLangLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6B5B95',
    },
    outputActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    outputActionButton: {
      padding: Spacing.xs + 2,
      borderRadius: BorderRadius.md,
      backgroundColor: '#F5F5F5',
    },
    outputText: {
      fontSize: 18,
      color: '#1A1A2E',
      lineHeight: 28,
      fontWeight: '500',
    },
    outputTextRTL: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    // 旧样式保留（兼容）
    outputSection: {
      marginBottom: Spacing.sm,
    },
    primaryOutputHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#B8A9D8',
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
      backgroundColor: '#FAF8FF',
      padding: Spacing.lg,
      minHeight: 80,
    },
    primaryOutputText: {
      fontSize: 18,
      color: '#1A1A2E',
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
      backgroundColor: '#F8FFF8',
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
    outputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      minHeight: 100,
      padding: Spacing.lg,
    },
    // 历史记录
    historySection: {
      marginTop: Spacing.lg,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
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
      gap: Spacing.xs,
    },
    historyItemCompact: {
      backgroundColor: '#FFFDF8',
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.xs + 2,
      paddingHorizontal: Spacing.md,
      borderWidth: 1,
      borderColor: '#F0E8D8',
    },
    historyItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    historyItemSource: {
      color: '#1A1A2E',
      fontSize: 12,
      flex: 1,
    },
    historyItemDivider: {
      color: '#999999',
      fontSize: 10,
    },
    historyItemUrdu: {
      color: '#6B5B95',
      fontSize: 12,
      fontWeight: '600',
      flex: 1.2,
      textAlign: 'right',
    },
    historyItemEnglish: {
      color: '#555555',
      fontSize: 11,
      flex: 1,
    },
    historyItemDelete: {
      padding: 2,
      marginLeft: Spacing.xs,
    },
    historyExpandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.xs,
      marginTop: Spacing.xs,
    },
    historyExpandText: {
      fontSize: 12,
      color: '#8B7DB8',
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
