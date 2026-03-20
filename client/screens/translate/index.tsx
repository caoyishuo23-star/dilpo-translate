import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// 历史记录类型
interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}

export default function TranslateScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 状态
  const [sourceLang, setSourceLang] = useState<Language>('zh');
  const [targetLang, setTargetLang] = useState<Language>('ur');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
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

  // 交换语言
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
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
      /**
       * 服务端文件：server/src/routes/translate.ts
       * 接口：POST /api/v1/translate
       * Body 参数：text: string, sourceLang: string, targetLang: string
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang,
          targetLang,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setOutputText(data.data.translatedText);
        
        // 添加到历史记录
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          sourceText: inputText.trim(),
          translatedText: data.data.translatedText,
          sourceLang,
          targetLang,
          timestamp: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, 20); // 保留最近20条
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
    setOutputText('');
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
    setTargetLang(item.targetLang);
    setInputText(item.sourceText);
    setOutputText(item.translatedText);
    setError(null);
  };

  // 判断是否是RTL语言
  const isRTLLanguage = (lang: Language) => lang === 'ur';

  // 语言选择器组件
  const LanguageSelector = useCallback(
    ({ value, onChange, exclude }: { value: Language; onChange: (lang: Language) => void; exclude: Language }) => {
      const languages: Language[] = (['zh', 'en', 'ur'] as Language[]).filter((l) => l !== exclude);
      
      return (
        <View style={styles.languageButton}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                value === lang && styles.languageButtonActive,
                { flex: 1, marginBottom: lang !== languages[languages.length - 1] ? Spacing.xs : 0 }
              ]}
              onPress={() => onChange(lang)}
            >
              <ThemedText
                style={[
                  styles.languageButtonText,
                  value === lang && styles.languageButtonTextActive,
                ]}
              >
                {languageNames[lang]}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      );
    },
    [styles]
  );

  const Spacing = useMemo(() => ({
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  }), []);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <ThemedView level="root" style={styles.header}>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.headerTitle}>
            乌尔都语翻译
          </ThemedText>
          <ThemedText variant="small" color={theme.textSecondary} style={styles.headerSubtitle}>
            中文 · 英语 · 乌尔都语 互译
          </ThemedText>
        </ThemedView>

        {/* Language Selector */}
        <View style={styles.languageSelector}>
          {/* Source Language */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.languageButton, styles.languageButtonActive]}
              onPress={() => {
                const availableLanguages: Language[] = (['zh', 'en', 'ur'] as Language[]).filter(l => l !== targetLang);
                const currentIndex = availableLanguages.indexOf(sourceLang);
                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                setSourceLang(availableLanguages[nextIndex]);
              }}
            >
              <ThemedText style={[styles.languageButtonText, styles.languageButtonTextActive]}>
                {languageNames[sourceLang]}
              </ThemedText>
              <FontAwesome6 name="chevron-down" size={12} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={handleSwapLanguages}>
            <FontAwesome6 name="arrow-right-arrow-left" size={16} color={theme.buttonPrimaryText} />
          </TouchableOpacity>

          {/* Target Language */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.languageButton, styles.languageButtonActive]}
              onPress={() => {
                const availableLanguages: Language[] = (['zh', 'en', 'ur'] as Language[]).filter(l => l !== sourceLang);
                const currentIndex = availableLanguages.indexOf(targetLang);
                const nextIndex = (currentIndex + 1) % availableLanguages.length;
                setTargetLang(availableLanguages[nextIndex]);
              }}
            >
              <ThemedText style={[styles.languageButtonText, styles.languageButtonTextActive]}>
                {languageNames[targetLang]}
              </ThemedText>
              <FontAwesome6 name="chevron-down" size={12} color={theme.primary} />
            </TouchableOpacity>
          </View>
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
                isRTLLanguage(sourceLang) && styles.inputRTL,
              ]}
              placeholder={`输入${languageNames[sourceLang]}文本...`}
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
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

        {/* Output Section */}
        {outputText ? (
          <View style={styles.outputSection}>
            <ThemedText variant="smallMedium" color={theme.textSecondary} style={styles.inputLabel}>
              翻译结果 ({languageNames[targetLang]})
            </ThemedText>
            <ThemedView level="default" style={styles.outputContainer}>
              <ThemedText
                style={[
                  styles.outputText,
                  isRTLLanguage(targetLang) && styles.outputTextRTL,
                ]}
              >
                {outputText}
              </ThemedText>
              <View style={styles.outputActions}>
                <TouchableOpacity
                  style={styles.inputActionButton}
                  onPress={() => handleCopy(outputText)}
                >
                  <FontAwesome6 name="copy" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
        ) : null}

        {/* History Section */}
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
              {history.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => handleUseHistory(item)}
                >
                  <View style={styles.historyItemHeader}>
                    <View style={styles.historyItemLang}>
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {languageNames[item.sourceLang]}
                      </ThemedText>
                      <FontAwesome6 name="arrow-right" size={10} color={theme.textMuted} />
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {languageNames[item.targetLang]}
                      </ThemedText>
                    </View>
                    <TouchableOpacity
                      style={styles.historyItemDelete}
                      onPress={() => handleDeleteHistoryItem(item.id)}
                    >
                      <FontAwesome6 name="trash" size={14} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <ThemedText
                    variant="small"
                    color={theme.textPrimary}
                    style={styles.historyItemText}
                    numberOfLines={1}
                  >
                    {item.sourceText}
                  </ThemedText>
                  <ThemedText
                    variant="small"
                    color={theme.textSecondary}
                    style={[
                      styles.historyItemText,
                      isRTLLanguage(item.targetLang) && styles.historyItemTextRTL,
                    ]}
                    numberOfLines={1}
                  >
                    {item.translatedText}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Empty History */}
        {history.length === 0 && (
          <View style={styles.emptyHistory}>
            <FontAwesome6 name="clock-rotate-left" size={48} color={theme.textMuted} />
            <ThemedText variant="small" color={theme.textMuted} style={styles.emptyHistoryText}>
              暂无历史记录
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
