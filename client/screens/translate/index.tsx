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
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { createFormDataFile } from '@/utils';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TargetLanguageModal } from '@/components/LanguageSelector';
import { LearningModule } from '@/components/LearningModule';
import { CurvedArrow } from '@/components/CurvedArrow';
import {
  LanguageCode,
  LanguageInfo,
  getLanguageByCode,
} from '@/constants/languages';

// 从环境变量或 extra 配置获取后端地址
const EXPO_PUBLIC_BACKEND_BASE_URL = 
  process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 
  (Constants as any).expoConfig?.extra?.EXPO_PUBLIC_BACKEND_BASE_URL || 
  'https://diplo-translate-server-production.up.railway.app';
const HISTORY_STORAGE_KEY = 'translation_history';
const LANGUAGE_SETTINGS_KEY = 'language_settings';

// 语言设置类型
interface LanguageSettings {
  sourceLang: LanguageCode;
  primaryLang: LanguageCode;
  secondaryLang: LanguageCode;
}

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

  // 语言状态 - 三种语言（默认值，会被持久化数据覆盖）
  const [sourceLang, setSourceLang] = useState<LanguageCode>('auto'); // 第一语言（支持自动检测）
  const [primaryLang, setPrimaryLang] = useState<LanguageCode>('ur'); // 第二语言（默认乌尔都语）
  const [secondaryLang, setSecondaryLang] = useState<LanguageCode>('en'); // 第三语言（默认英文）
  const [settingsLoaded, setSettingsLoaded] = useState(false); // 标记设置是否已加载
  
  const [inputText, setInputText] = useState('');
  const [primaryText, setPrimaryText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [detectedLang, setDetectedLang] = useState<LanguageCode | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // 语音相关状态
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingPrimary, setIsPlayingPrimary] = useState(false);
  const [isPlayingSecondary, setIsPlayingSecondary] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showTargetLangModal, setShowTargetLangModal] = useState(false);

  // 引用
  const recordingRef = useRef<Audio.Recording | null>(null);

  // 加载历史记录和语言设置
  useEffect(() => {
    loadHistory();
    loadLanguageSettings();
    requestAudioPermission();
  }, []);

  // 保存语言设置（当语言变化时）
  useEffect(() => {
    if (settingsLoaded) {
      saveLanguageSettings();
    }
  }, [sourceLang, primaryLang, secondaryLang, settingsLoaded]);

  // 加载语言设置
  const loadLanguageSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_SETTINGS_KEY);
      if (stored) {
        const settings: LanguageSettings = JSON.parse(stored);
        setSourceLang(settings.sourceLang);
        setPrimaryLang(settings.primaryLang);
        setSecondaryLang(settings.secondaryLang);
      }
      setSettingsLoaded(true);
    } catch (e) {
      console.error('Failed to load language settings:', e);
      setSettingsLoaded(true);
    }
  };

  // 保存语言设置
  const saveLanguageSettings = async () => {
    try {
      const settings: LanguageSettings = {
        sourceLang,
        primaryLang,
        secondaryLang,
      };
      await AsyncStorage.setItem(LANGUAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save language settings:', e);
    }
  };

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

      // 检查 HTTP 状态
      if (!response.ok) {
        if (response.status === 503) {
          Alert.alert(
            '语音输入暂不可用',
            '语音识别服务正在配置中，请稍后再试。\n\n您可以直接输入文字进行翻译。',
            [{ text: '好的' }]
          );
          return;
        }
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.text) {
        setInputText(data.data.text);
      } else {
        Alert.alert(
          '语音识别提示',
          '未能识别语音内容，请尝试：\n• 说话更清晰\n• 在安静环境中录制\n• 靠近麦克风',
          [{ text: '知道了' }]
        );
      }
    } catch (e) {
      console.error('ASR error:', e);
      Alert.alert(
        '语音输入暂不可用',
        '语音识别服务正在配置中。\n\n您可以：\n• 直接输入文字进行翻译\n• 稍后再试',
        [{ text: '好的' }]
      );
    }
  };

  // 使用云端 TTS 播放语音（后备方案）
  const playCloudTTS = async (text: string, lang: LanguageCode, setPlayingState: (v: boolean) => void) => {
    try {
      /**
       * 服务端文件：server/src/routes/audio.ts
       * 接口：POST /api/v1/audio/tts
       * Body: text: string, lang: string
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/audio/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        throw new Error('TTS service unavailable');
      }

      const data = await response.json();

      if (data.success && data.data?.audioUri) {
        // 使用 expo-av 播放音频
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.data.audioUri },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlayingState(false);
              sound.unloadAsync();
            }
          }
        );
      } else {
        throw new Error('No audio returned');
      }
    } catch (e) {
      console.error('Cloud TTS error:', e);
      setPlayingState(false);
      Alert.alert(
        '语音播放失败',
        '语音服务暂时不可用，请稍后重试。'
      );
    }
  };

  // 播放语音 - 优先本地TTS，失败时使用云端TTS
  const playTTS = async (text: string, lang: LanguageCode, isPrimaryOutput: boolean) => {
    const playingState = isPrimaryOutput ? isPlayingPrimary : isPlayingSecondary;
    const setPlayingState = isPrimaryOutput ? setIsPlayingPrimary : setIsPlayingSecondary;

    // 如果正在播放，停止
    if (playingState) {
      Speech.stop();
      setPlayingState(false);
      return;
    }

    // 检查文本是否为空
    if (!text || text.trim() === '') {
      Alert.alert('提示', '没有可播放的内容');
      return;
    }

    try {
      // 语言代码映射到语音语言
      const langMap: Record<string, string> = {
        'zh': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'ur': 'ur-PK',
        'ar': 'ar-SA',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES',
        'pt': 'pt-PT',
        'ru': 'ru-RU',
        'hi': 'hi-IN',
      };

      const speechLang = langMap[lang] || 'en-US';
      
      setPlayingState(true);

      // 尝试本地 TTS
      Speech.speak(text, {
        language: speechLang,
        rate: 0.9,
        pitch: 1.0,
        onDone: () => {
          setPlayingState(false);
        },
        onError: (error) => {
          console.log('Local TTS failed, trying cloud TTS:', error);
          setPlayingState(false);
          // 本地 TTS 失败，尝试云端 TTS
          playCloudTTS(text, lang, setPlayingState);
        },
        onStopped: () => setPlayingState(false),
      });
    } catch (e) {
      console.error('TTS error:', e);
      // 尝试云端 TTS
      await playCloudTTS(text, lang, setPlayingState);
    }
  };

  // 翻译 - 两步串联翻译：源语言 → 主语言 → 参考语言
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('提示', '请输入要翻译的文本');
      return;
    }

    setIsTranslating(true);
    setError(null);
    setPrimaryText('');
    setSecondaryText('');

    try {
      // 第一步：源语言 → 主语言
      const primaryResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          sourceLang: sourceLang === 'auto' ? undefined : sourceLang,
          autoDetect: sourceLang === 'auto',
          targetLangs: [primaryLang],
        }),
      });

      const primaryData = await primaryResponse.json();

      if (primaryData.success && primaryData.data) {
        const primaryResult = primaryData.data.translations?.[primaryLang] || '';
        setPrimaryText(primaryResult);
        setDetectedLang(primaryData.data.detectedLang || null);

        // 第二步：主翻译结果 → 参考语言
        if (primaryResult) {
          try {
            const secondaryResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/translate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: primaryResult,
                sourceLang: primaryLang,
                autoDetect: false,
                targetLangs: [secondaryLang],
              }),
            });

            const secondaryData = await secondaryResponse.json();

            if (secondaryData.success && secondaryData.data) {
              setSecondaryText(secondaryData.data.translations?.[secondaryLang] || '');
            }
          } catch (e) {
            console.error('Secondary translation error:', e);
            // 参考翻译失败不影响主翻译
          }
        }
        
        // 添加到历史记录
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          sourceText: inputText.trim(),
          primaryText: primaryResult,
          secondaryText: secondaryText,
          sourceLang: primaryData.data.detectedLang || sourceLang,
          primaryLang,
          secondaryLang,
          timestamp: Date.now(),
        };
        const newHistory = [newItem, ...history].slice(0, 20);
        setHistory(newHistory);
        await saveHistory(newHistory);
      } else {
        setError(primaryData.error || '翻译失败，请重试');
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
    <Screen 
      backgroundColor="#8B7DB8" 
      statusBarStyle="light"
      safeAreaEdges={['left', 'right', 'bottom']} // 禁用顶部安全区
    >
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

        {/* Language Selector - 简洁形式：源语言 → 目标语言组合 */}
        <View style={styles.languageSelector}>
          {/* 源语言选择 */}
          <LanguageSelector
            value={sourceLang}
            onChange={setSourceLang}
            showAutoDetect={true}
            excludeLanguages={[]}
          />

          {/* 箭头 */}
          <View style={styles.arrowButton}>
            <FontAwesome6 name="arrow-right-arrow-left" size={16} color="#FFFFFF" />
          </View>

          {/* 目标语言组合 */}
          <TouchableOpacity
            style={styles.targetLangButton}
            onPress={() => {
              // 显示Modal让用户选择两种目标语言
              setShowTargetLangModal(true);
            }}
          >
            <ThemedText style={styles.targetLangText}>
              {getLanguageByCode(primaryLang).nativeName} + {getLanguageByCode(secondaryLang).nativeName}
            </ThemedText>
            <FontAwesome6 name="chevron-down" size={10} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* 目标语言选择Modal */}
        {showTargetLangModal && (
          <TargetLanguageModal
            visible={showTargetLangModal}
            primaryLang={primaryLang}
            secondaryLang={secondaryLang}
            onPrimaryChange={setPrimaryLang}
            onSecondaryChange={setSecondaryLang}
            onClose={() => setShowTargetLangModal(false)}
            excludeLangs={[sourceLang === 'auto' ? 'zh' : sourceLang]}
          />
        )}

        {/* 白色内容卡片区域 */}
        <View style={styles.contentCard}>

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

        {/* Output Sections - 语言小卡片 + 输出框 */}
        {hasOutput && (
          <View style={styles.resultsWrapper}>
            {/* 主翻译结果 */}
            <View style={styles.primaryOutputSection}>
              <View style={styles.outputHeader}>
                <View style={styles.outputLangCard}>
                  <ThemedText style={styles.outputLangCardText}>
                    {primaryLangInfo.nativeName}
                  </ThemedText>
                </View>
                <View style={styles.outputActions}>
                  <TouchableOpacity
                    style={styles.outputActionButton}
                    onPress={() => playTTS(primaryText, primaryLang, true)}
                  >
                    <FontAwesome6 
                      name={isPlayingPrimary ? "stop" : "volume-high"} 
                      size={14} 
                      color="#6B5B95" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.outputActionButton}
                    onPress={() => handleCopy(primaryText)}
                  >
                    <FontAwesome6 name="copy" size={14} color="#6B5B95" />
                  </TouchableOpacity>
                </View>
              </View>
              <ThemedText
                style={[
                  styles.outputText,
                  primaryLangInfo.isRTL && styles.outputTextRTL,
                ]}
              >
                {primaryText || ' '}
              </ThemedText>
            </View>

            {/* 语言小卡片 + 箭头连接 */}
            <View style={styles.langCardsRow}>
              <View style={styles.langCardPrimary}>
                <ThemedText style={styles.langCardText}>{primaryLangInfo.nativeName}</ThemedText>
              </View>
              <View style={styles.langCardArrow}>
                <FontAwesome6 name="arrow-down" size={12} color="#8B7DB8" />
              </View>
              <View style={styles.langCardSecondary}>
                <ThemedText style={styles.langCardText}>{secondaryLangInfo.nativeName}</ThemedText>
              </View>
            </View>

            {/* 参考翻译 */}
            <View style={styles.secondaryOutputSection}>
              <View style={styles.outputHeader}>
                <View style={[styles.outputLangCard, styles.outputLangCardSecondary]}>
                  <ThemedText style={[styles.outputLangCardText, styles.outputLangCardTextSecondary]}>
                    {secondaryLangInfo.nativeName}
                  </ThemedText>
                </View>
                <View style={styles.outputActions}>
                  <TouchableOpacity
                    style={styles.outputActionButton}
                    onPress={() => playTTS(secondaryText, secondaryLang, false)}
                  >
                    <FontAwesome6 
                      name={isPlayingSecondary ? "stop" : "volume-high"} 
                      size={14} 
                      color="#059669" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.outputActionButton}
                    onPress={() => handleCopy(secondaryText)}
                  >
                    <FontAwesome6 name="copy" size={14} color="#059669" />
                  </TouchableOpacity>
                </View>
              </View>
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
        )}

        {/* History Section */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <FontAwesome6 name="clock-rotate-left" size={14} color="#6B5B95" />
                <ThemedText variant="title" style={styles.historyTitle}>
                  历史记录
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.clearAllButton} onPress={handleClearHistory}>
                <ThemedText variant="small" color="#E57373">清空</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
              {(isHistoryExpanded ? history.slice(0, 50) : history.slice(0, 2)).map((item) => (
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
                      <FontAwesome6 name="xmark" size={10} color="#999999" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
              {/* 展开更多 */}
              {history.length > 2 && (
                <TouchableOpacity
                  style={styles.historyExpandButton}
                  onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
                >
                  <ThemedText style={styles.historyExpandText}>
                    {isHistoryExpanded ? '收起' : `...展开全部 (${history.length}条)`}
                  </ThemedText>
                  <FontAwesome6 
                    name={isHistoryExpanded ? 'chevron-up' : 'chevron-down'} 
                    size={10} 
                    color="#8B7DB8" 
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Learning Module */}
        <LearningModule
          primaryLang={primaryLang}
          recentWords={history.slice(0, 5).map(item => item.sourceText)}
        />
        </View>{/* contentCard 结束 */}
      </ScrollView>
    </Screen>
  );
}
