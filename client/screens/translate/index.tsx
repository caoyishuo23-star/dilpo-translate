import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { createFormDataFile } from '@/utils';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  LanguageCode,
  LanguageInfo,
  getLanguageByCode,
} from '@/constants/languages';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
const HISTORY_STORAGE_KEY = 'translation_history';

// 历史记录类型
interface HistoryItem {
  id: string;
  sourceText: string;
  primaryText: string;
  secondaryText: string;
  sourceLang: LanguageCode;
  primaryLang: LanguageCode;
  secondaryLang: LanguageCode;
  timestamp: number;
}

export default function TranslateScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // 语言状态 - 三种语言
  const [sourceLang, setSourceLang] = useState<LanguageCode>('auto'); // 第一语言（支持自动检测）
  const [primaryLang, setPrimaryLang] = useState<LanguageCode>('en'); // 第二语言
  const [secondaryLang, setSecondaryLang] = useState<LanguageCode>('ur'); // 第三语言
  
  const [inputText, setInputText] = useState('');
  const [primaryText, setPrimaryText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [detectedLang, setDetectedLang] = useState<LanguageCode | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 语音相关状态
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingPrimary, setIsPlayingPrimary] = useState(false);
  const [isPlayingSecondary, setIsPlayingSecondary] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // 引用
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
    requestAudioPermission();
  }, []);

  // 请求录音权限
  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (e) {
      console.error('Permission error:', e);
    }
  };

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

  // 开始录音
  const startRecording = async () => {
    if (!hasPermission) {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('需要权限', '请授予录音权限');
        return;
      }
      setHasPermission(true);
    }

    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }

    try {
      await Audio.setAudioModeAsync({ 
        allowsRecordingIOS: true, 
        playsInSilentModeIOS: true 
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('录音失败:', error);
      Alert.alert('错误', '录音启动失败');
    }
  };

  // 停止录音并进行语音识别
  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (uri) {
        await handleSpeechRecognition(uri);
      }
    } catch (error) {
      console.error('停止录音失败:', error);
      setIsRecording(false);
    }
  };

  // 语音识别
  const handleSpeechRecognition = async (audioUri: string) => {
    try {
      // 使用 createFormDataFile 创建跨平台兼容的文件对象
      const audioFile = await createFormDataFile(audioUri, 'audio.m4a', 'audio/m4a');
      const formData = new FormData();
      formData.append('audio', audioFile as any);

      /**
       * 服务端文件：server/src/routes/audio.ts
       * 接口：POST /api/v1/audio/asr
       * Body: FormData with audio file
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/audio/asr`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data?.text) {
        setInputText(data.data.text);
      } else {
        Alert.alert('提示', '语音识别失败，请重试');
      }
    } catch (e) {
      console.error('ASR error:', e);
      Alert.alert('错误', '语音识别服务暂时不可用');
    }
  };

  // 播放语音
  const playTTS = async (text: string, lang: LanguageCode, isPrimaryOutput: boolean) => {
    const playingState = isPrimaryOutput ? isPlayingPrimary : isPlayingSecondary;
    const setPlayingState = isPrimaryOutput ? setIsPlayingPrimary : setIsPlayingSecondary;

    if (playingState && soundRef.current) {
      // 正在播放，停止
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setPlayingState(false);
      return;
    }

    try {
      /**
       * 服务端文件：server/src/routes/audio.ts
       * 接口：POST /api/v1/audio/tts
       * Body 参数：text: string, lang: string
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/audio/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      const data = await response.json();

      if (data.success && data.data?.audioUri) {
        // 播放音频
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.data.audioUri },
          { shouldPlay: true, isLooping: false },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlayingState(false);
            }
          }
        );
        soundRef.current = sound;
        setPlayingState(true);
      } else {
        Alert.alert('提示', '语音合成失败');
      }
    } catch (e) {
      console.error('TTS error:', e);
      Alert.alert('错误', '语音服务暂时不可用');
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
          sourceLang: sourceLang === 'auto' ? undefined : sourceLang,
          autoDetect: sourceLang === 'auto',
          targetLangs: [primaryLang, secondaryLang],
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setPrimaryText(data.data.translations?.[primaryLang] || '');
        setSecondaryText(data.data.translations?.[secondaryLang] || '');
        setDetectedLang(data.data.detectedLang || null);
        
        // 添加到历史记录
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          sourceText: inputText.trim(),
          primaryText: data.data.translations?.[primaryLang] || '',
          secondaryText: data.data.translations?.[secondaryLang] || '',
          sourceLang: data.data.detectedLang || sourceLang,
          primaryLang,
          secondaryLang,
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
    setPrimaryText('');
    setSecondaryText('');
    setDetectedLang(null);
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
    setPrimaryLang(item.primaryLang);
    setSecondaryLang(item.secondaryLang);
    setInputText(item.sourceText);
    setPrimaryText(item.primaryText);
    setSecondaryText(item.secondaryText);
    setError(null);
  };

  // 获取源语言信息（考虑自动检测）
  const getDisplaySourceLang = (): LanguageInfo => {
    if (sourceLang === 'auto' && detectedLang) {
      return getLanguageByCode(detectedLang);
    }
    return getLanguageByCode(sourceLang === 'auto' ? 'en' : sourceLang);
  };

  const primaryLangInfo = getLanguageByCode(primaryLang);
  const secondaryLangInfo = getLanguageByCode(secondaryLang);
  const hasOutput = primaryText || secondaryText;

  return (
    <Screen backgroundColor="#FAFAFA" statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <ThemedView level="root" style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <ThemedText variant="h2" style={styles.headerTitle}>
              Diplo
            </ThemedText>
          </View>
          <ThemedText variant="small" style={styles.headerSubtitle}>
            Your thoughtful translation assistant
          </ThemedText>
        </ThemedView>

        {/* Language Selector - 三语言选择器 */}
        <View style={styles.languageSelectorContainer}>
          {/* 第一语言（支持自动检测） */}
          <View style={styles.langSelectorItem}>
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              label="源语言"
              showAutoDetect={true}
              excludeLanguages={[]}
            />
          </View>

          {/* 箭头 */}
          <View style={styles.arrowContainer}>
            <FontAwesome6 name="arrow-right" size={16} color="#6B5B95" />
          </View>

          {/* 第二语言 */}
          <View style={styles.langSelectorItem}>
            <LanguageSelector
              value={primaryLang}
              onChange={setPrimaryLang}
              label="主翻译"
              showAutoDetect={false}
              excludeLanguages={[sourceLang === 'auto' ? 'en' : sourceLang, secondaryLang]}
            />
          </View>

          {/* 箭头 */}
          <View style={styles.arrowContainer}>
            <FontAwesome6 name="arrow-right" size={16} color="#6B5B95" />
          </View>

          {/* 第三语言 */}
          <View style={styles.langSelectorItem}>
            <LanguageSelector
              value={secondaryLang}
              onChange={setSecondaryLang}
              label="参考翻译"
              showAutoDetect={false}
              excludeLanguages={[sourceLang === 'auto' ? 'en' : sourceLang, primaryLang]}
            />
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <ThemedText variant="smallMedium" style={styles.inputLabel}>
            输入文本 {sourceLang === 'auto' && '(自动检测语种)'}
          </ThemedText>
          <ThemedView level="default" style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                getDisplaySourceLang().isRTL && styles.inputRTL,
              ]}
              placeholder="输入要翻译的文本..."
              placeholderTextColor="#AAAAAA"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={2}
            />
            <View style={styles.inputActions}>
              {/* 语音输入按钮 */}
              <TouchableOpacity
                style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                <FontAwesome6 
                  name="microphone" 
                  size={16} 
                  color={isRecording ? '#FFFFFF' : '#6B5B95'} 
                />
              </TouchableOpacity>
              {inputText.length > 0 && (
                <TouchableOpacity style={styles.inputActionButton} onPress={handleClear}>
                  <FontAwesome6 name="xmark" size={16} color="#666666" />
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
              <ActivityIndicator color="#FFFFFF" size="small" />
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

        {/* Detected Language Info */}
        {detectedLang && sourceLang === 'auto' && (
          <View style={styles.detectedLangInfo}>
            <FontAwesome6 name="wand-magic-sparkles" size={14} color="#6B5B95" />
            <ThemedText style={styles.detectedLangText}>
              检测到语言: {getLanguageByCode(detectedLang).nativeName}
            </ThemedText>
          </View>
        )}

        {/* Output Sections */}
        {hasOutput && (
          <View style={styles.resultsContainer}>
            {/* 主翻译结果 */}
            <View style={styles.primaryOutputSection}>
              <View style={styles.primaryOutputHeader}>
                <View style={styles.primaryOutputLabel}>
                  <View style={styles.primaryOutputLabelIcon}>
                    <FontAwesome6 name="language" size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.primaryOutputLangTag}>
                    <ThemedText variant="captionMedium" color="#FFFFFF">
                      {primaryLangInfo.nativeName}
                    </ThemedText>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={styles.primaryCopyButton}
                    onPress={() => playTTS(primaryText, primaryLang, true)}
                  >
                    <FontAwesome6 
                      name={isPlayingPrimary ? "stop" : "volume-high"} 
                      size={12} 
                      color="#FFFFFF" 
                    />
                    <ThemedText variant="caption" color="#FFFFFF">
                      {isPlayingPrimary ? '停止' : '播放'}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryCopyButton}
                    onPress={() => handleCopy(primaryText)}
                  >
                    <FontAwesome6 name="copy" size={12} color="#FFFFFF" />
                    <ThemedText variant="caption" color="#FFFFFF">复制</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.primaryOutputContainer}>
                <ThemedText
                  style={[
                    styles.primaryOutputText,
                    primaryLangInfo.isRTL && styles.primaryOutputTextRTL,
                  ]}
                >
                  {primaryText || ' '}
                </ThemedText>
              </View>
            </View>

            {/* 参考翻译 */}
            <View style={styles.referenceOutputSection}>
              <View style={styles.referenceOutputHeader}>
                <View style={styles.referenceOutputLabel}>
                  <View style={styles.referenceOutputLabelIcon}>
                    <FontAwesome6 name="eye" size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.referenceTag}>
                    <ThemedText variant="captionMedium" color="#FFFFFF">
                      {secondaryLangInfo.nativeName}
                    </ThemedText>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={styles.primaryCopyButton}
                    onPress={() => playTTS(secondaryText, secondaryLang, false)}
                  >
                    <FontAwesome6 
                      name={isPlayingSecondary ? "stop" : "volume-high"} 
                      size={12} 
                      color="#FFFFFF" 
                    />
                    <ThemedText variant="caption" color="#FFFFFF">
                      {isPlayingSecondary ? '停止' : '播放'}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryCopyButton}
                    onPress={() => handleCopy(secondaryText)}
                  >
                    <FontAwesome6 name="copy" size={12} color="#FFFFFF" />
                    <ThemedText variant="caption" color="#FFFFFF">复制</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.referenceOutputContainer}>
                <ThemedText
                  style={[
                    styles.outputText,
                    secondaryLangInfo.isRTL && styles.outputTextRTL,
                  ]}
                >
                  {secondaryText || ' '}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <ThemedText variant="title" style={styles.historyTitle}>
                历史记录
              </ThemedText>
              <TouchableOpacity style={styles.clearAllButton} onPress={handleClearHistory}>
                <ThemedText variant="small" color="#E57373">清空</ThemedText>
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
                    <ThemedText style={styles.historyItemDivider}>→</ThemedText>
                    <ThemedText
                      style={styles.historyItemUrdu}
                      numberOfLines={1}
                    >
                      {item.primaryText}
                    </ThemedText>
                    <ThemedText style={styles.historyItemDivider}>+</ThemedText>
                    <ThemedText
                      style={styles.historyItemEnglish}
                      numberOfLines={1}
                    >
                      {item.secondaryText}
                    </ThemedText>
                    <TouchableOpacity
                      style={styles.historyItemDelete}
                      onPress={() => handleDeleteHistoryItem(item.id)}
                    >
                      <FontAwesome6 name="xmark" size={12} color="#999999" />
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
            <FontAwesome6 name="clock-rotate-left" size={36} color="#CCCCCC" />
            <ThemedText variant="small" style={styles.emptyHistoryText}>
              暂无历史记录
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
