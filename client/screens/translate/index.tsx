import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
const HISTORY_STORAGE_KEY = 'translation_history';

// 语言类型
type Language = 'zh' | 'en' | 'ur';

// 语言名称映射
const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
  ur: 'اردو',
};

// 语言图标
const languageIcons: Record<Language, string> = {
  zh: 'language',
  en: 'font',
  ur: 'language',
};

// 历史记录类型
interface HistoryItem {
  id: string;
  sourceText: string;
  englishText: string;
  urduText: string;
  chineseText?: string;
  sourceLang: Language;
  timestamp: number;
}

export default function TranslateScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 状态
  const [sourceLang, setSourceLang] = useState<Language>('zh');
  const [inputText, setInputText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [urduText, setUrduText] = useState('');
  const [chineseText, setChineseText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const saveHistory = async (items: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  // 翻译
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('提示', '请输入要翻译的文本');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setEnglishText(data.data.englishText || '');
        setUrduText(data.data.urduText || '');
        setChineseText(data.data.chineseText || '');
        
        // 添加到历史记录
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          sourceText: inputText.trim(),
          englishText: data.data.englishText || '',
          urduText: data.data.urduText || '',
          chineseText: data.data.chineseText || '',
          sourceLang,
          timestamp: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, 20);
        setHistory(newHistory);
        await saveHistory(newHistory);
      } else {
        setError(data.error || '翻译失败，请重试');
      }
    } catch (e) {
      console.error('Translation error:', e);
      setError('网络错误，请检查网络连接后重试');
    } finally {
      setIsTranslating(false);
    }
  };

  // 复制文本
  const handleCopy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('成功', '已复制到剪贴板');
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  // 清空输入
  const handleClear = () => {
    setInputText('');
    setEnglishText('');
    setUrduText('');
    setChineseText('');
    setError(null);
  };

  // 删除单条历史
  const handleDeleteHistoryItem = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  // 清空所有历史
  const handleClearHistory = () => {
    Alert.alert('确认', '确定要清空所有历史记录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          setHistory([]);
          await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
        },
      },
    ]);
  };

  // 使用历史记录
  const handleUseHistory = (item: HistoryItem) => {
    setSourceLang(item.sourceLang);
    setInputText(item.sourceText);
    setEnglishText(item.englishText);
    setUrduText(item.urduText);
    setChineseText(item.chineseText || '');
    setError(null);
  };

  // 获取主翻译结果（目标：乌尔都语或中文）
  const getPrimaryTranslation = () => {
    if (sourceLang === 'zh') {
      // 中文输入 → 主翻译：乌尔都语
      return { text: urduText, label: 'اردو', isRTL: true };
    } else if (sourceLang === 'en') {
      // 英文输入 → 主翻译：乌尔都语
      return { text: urduText, label: 'اردو', isRTL: true };
    } else {
      // 乌尔都语输入 → 主翻译：中文
      return { text: chineseText, label: '中文', isRTL: false };
    }
  };

  // 获取参考翻译结果（用于对照检验）
  const getReferenceTranslation = () => {
    if (sourceLang === 'zh') {
      // 中文输入 → 参考：英文
      return { text: englishText, label: 'English 参考翻译', isRTL: false };
    } else if (sourceLang === 'en') {
      // 英文输入 → 参考：中文
      return { text: chineseText, label: '中文 参考翻译', isRTL: false };
    } else {
      // 乌尔都语输入 → 参考：英文
      return { text: englishText, label: 'English 参考翻译', isRTL: false };
    }
  };

  const primaryTranslation = getPrimaryTranslation();
  const referenceTranslation = getReferenceTranslation();
  const hasOutput = englishText || urduText || chineseText;

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <ThemedView level="root" style={styles.header}>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.headerTitle}>
            乌尔都语翻译
          </ThemedText>
          <ThemedText variant="small" color={theme.textSecondary} style={styles.headerSubtitle}>
            输入文本，获取乌尔都语翻译
          </ThemedText>
        </ThemedView>

        {/* Language Selector - 源语言选择 */}
        <View style={styles.languageSelector}>
          {(['zh', 'en', 'ur'] as Language[]).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                sourceLang === lang && styles.languageButtonActive,
              ]}
              onPress={() => setSourceLang(lang)}
            >
              <FontAwesome6
                name={languageIcons[lang]}
                size={12}
                color={sourceLang === lang ? '#7C5DC4' : theme.textMuted}
              />
              <ThemedText
                style={[
                  styles.languageButtonText,
                  sourceLang === lang && styles.languageButtonTextActive,
                ]}
              >
                {languageNames[lang]}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <ThemedText variant="smallMedium" color={theme.textSecondary} style={styles.inputLabel}>
            输入文本 ({languageNames[sourceLang]})
          </ThemedText>
          <ThemedView level="default" style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                sourceLang === 'ur' && styles.inputRTL,
              ]}
              placeholder={`输入${languageNames[sourceLang]}文本...`}
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={2}
            />
            <View style={styles.inputActions}>
              {inputText.length > 0 && (
                <TouchableOpacity style={styles.inputActionButton} onPress={handleClear}>
                  <FontAwesome6 name="xmark" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </ThemedView>
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[
            styles.translateButton,
            isTranslating && styles.translateButtonDisabled,
          ]}
          onPress={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
        >
          {isTranslating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={theme.buttonPrimaryText} size="small" />
              <ThemedText style={styles.translateButtonText}>翻译中...</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.translateButtonText}>翻译</ThemedText>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Output Sections */}
        {hasOutput && (
          <View style={styles.resultsContainer}>
            {/* 主翻译结果（突出显示） */}
            <View style={styles.primaryOutputSection}>
              {/* 深色标题行 */}
              <View style={styles.primaryOutputHeader}>
                <View style={styles.primaryOutputLabel}>
                  <View style={styles.primaryOutputLabelIcon}>
                    <FontAwesome6 name="language" size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.primaryOutputLangTag}>
                    <ThemedText variant="captionMedium" color="#FFFFFF">
                      PK 乌尔都语 / اردو
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.primaryCopyButton}
                  onPress={() => handleCopy(primaryTranslation.text)}
                >
                  <FontAwesome6 name="copy" size={12} color="#FFFFFF" />
                  <ThemedText variant="caption" color="#FFFFFF">复制</ThemedText>
                </TouchableOpacity>
              </View>
              {/* 浅色内容区 */}
              <View style={styles.primaryOutputContainer}>
                <ThemedText
                  style={[
                    styles.primaryOutputText,
                    primaryTranslation.isRTL && styles.primaryOutputTextRTL,
                  ]}
                >
                  {primaryTranslation.text || ' '}
                </ThemedText>
              </View>
            </View>

            {/* 参考翻译（次要显示） */}
            <View style={styles.referenceOutputSection}>
              {/* 深色标题行 */}
              <View style={styles.referenceOutputHeader}>
                <View style={styles.referenceOutputLabel}>
                  <View style={styles.referenceOutputLabelIcon}>
                    <FontAwesome6 name="eye" size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.referenceTag}>
                    <ThemedText variant="captionMedium" color="#FFFFFF">
                      EN 英文 / English
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.primaryCopyButton}
                  onPress={() => handleCopy(referenceTranslation.text)}
                >
                  <FontAwesome6 name="copy" size={12} color="#FFFFFF" />
                  <ThemedText variant="caption" color="#FFFFFF">复制</ThemedText>
                </TouchableOpacity>
              </View>
              {/* 浅色内容区 */}
              <View style={styles.referenceOutputContainer}>
                <ThemedText
                  style={[
                    styles.outputText,
                    referenceTranslation.isRTL && styles.outputTextRTL,
                  ]}
                >
                  {referenceTranslation.text || ' '}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* History Section - 最近3条 */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <ThemedText variant="title" color={theme.textPrimary} style={styles.historyTitle}>
                历史记录
              </ThemedText>
              <TouchableOpacity style={styles.clearAllButton} onPress={handleClearHistory}>
                <ThemedText variant="small" color={theme.error}>清空</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
              {history.slice(0, 3).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItemCompact}
                  onPress={() => handleUseHistory(item)}
                >
                  <View style={styles.historyItemRow}>
                    <ThemedText
                      style={styles.historyItemSource}
                      numberOfLines={1}
                    >
                      {item.sourceText}
                    </ThemedText>
                    <ThemedText style={styles.historyItemDivider}>—</ThemedText>
                    <ThemedText
                      style={styles.historyItemUrdu}
                      numberOfLines={1}
                    >
                      {item.urduText}
                    </ThemedText>
                    <ThemedText style={styles.historyItemDivider}>—</ThemedText>
                    <ThemedText
                      style={styles.historyItemEnglish}
                      numberOfLines={1}
                    >
                      {item.englishText}
                    </ThemedText>
                    <TouchableOpacity
                      style={styles.historyItemDelete}
                      onPress={() => handleDeleteHistoryItem(item.id)}
                    >
                      <FontAwesome6 name="xmark" size={12} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty History */}
        {history.length === 0 && (
          <View style={styles.emptyHistory}>
            <FontAwesome6 name="clock-rotate-left" size={36} color={theme.textMuted} />
            <ThemedText variant="small" color={theme.textMuted} style={styles.emptyHistoryText}>
              暂无历史记录
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
