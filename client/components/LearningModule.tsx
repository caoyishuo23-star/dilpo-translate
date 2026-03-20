import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import {
  LanguageCode,
  getLanguageByCode,
} from '@/constants/languages';
import {
  PhraseCategory,
  PhraseItem,
  CategoryPhrases,
  getPhrasesForLanguage,
  categoryNames,
} from '@/constants/commonPhrases';

interface RelatedSentence {
  source: string;
  target: string;
  word: string;
}

interface IELTSSentence {
  sentence: string;
  type: string;
  vocabulary: string[];
  translation: string;
}

interface LearningModuleProps {
  primaryLang: LanguageCode;
  recentWords?: string[];
}

// 默认显示的最大高度（约40行）
const DEFAULT_MAX_HEIGHT = 640;

export function LearningModule({ primaryLang, recentWords = [] }: LearningModuleProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [relatedSentences, setRelatedSentences] = useState<RelatedSentence[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [ieltSentences, setIeltSentences] = useState<IELTSSentence[]>([]);
  const [isLoadingIELTS, setIsLoadingIELTS] = useState(false);
  const [activeTab, setActiveTab] = useState<'phrases' | 'ielts'>('phrases');
  const [isExpanded, setIsExpanded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const soundRef = useRef<Audio.Sound | null>(null);

  const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
  const langInfo = getLanguageByCode(primaryLang);
  const phrases = getPhrasesForLanguage(primaryLang);
  const isEnglish = primaryLang === 'en';
  const hasRecentWords = recentWords.length > 0;

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // 获取相关句子
  useEffect(() => {
    if (hasRecentWords && primaryLang) {
      fetchRelatedSentences();
    }
  }, [recentWords, primaryLang]);

  // 获取雅思句子
  useEffect(() => {
    if (isEnglish && hasRecentWords && activeTab === 'ielts') {
      fetchIELTSSentences();
    }
  }, [recentWords, activeTab, isEnglish]);

  // 切换Tab时重置展开状态
  useEffect(() => {
    setIsExpanded(false);
    stopPlaying();
  }, [activeTab]);

  const fetchRelatedSentences = async () => {
    if (recentWords.length === 0) return;
    
    setIsLoadingRelated(true);
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/learning/related`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: recentWords.slice(0, 3),
          targetLang: primaryLang,
          count: 3,
        }),
      });

      const data = await response.json();
      if (data.success && data.data?.sentences) {
        setRelatedSentences(data.data.sentences);
      }
    } catch (e) {
      console.error('Failed to fetch related sentences:', e);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const fetchIELTSSentences = async () => {
    if (recentWords.length === 0) return;
    
    setIsLoadingIELTS(true);
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/learning/ielts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: recentWords.slice(0, 5),
          count: 3,
        }),
      });

      const data = await response.json();
      if (data.success && data.data?.sentences) {
        setIeltSentences(data.data.sentences);
      }
    } catch (e) {
      console.error('Failed to fetch IELTS sentences:', e);
    } finally {
      setIsLoadingIELTS(false);
    }
  };

  // 停止播放
  const stopPlaying = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingId(null);
  };

  // 播放TTS
  const playTTS = async (text: string, lang: LanguageCode, id: string) => {
    // 如果正在播放同一个，停止
    if (playingId === id) {
      await stopPlaying();
      return;
    }

    // 停止之前的播放
    await stopPlaying();

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
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.data.audioUri },
          { shouldPlay: true, isLooping: false },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlayingId(null);
            }
          }
        );
        soundRef.current = sound;
        setPlayingId(id);
      }
    } catch (e) {
      console.error('TTS error:', e);
    }
  };

  // 渲染场景选择
  const renderCategorySelector = () => (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    }}>
      {phrases.map((cat) => (
        <TouchableOpacity
          key={cat.category}
          style={{
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.sm,
            borderRadius: BorderRadius.full,
            backgroundColor: selectedCategory === cat.category ? '#8B7DB8' : '#F5F5F5',
            borderWidth: 1,
            borderColor: selectedCategory === cat.category ? '#8B7DB8' : '#E8E8E8',
          }}
          onPress={() => setSelectedCategory(
            selectedCategory === cat.category ? null : cat.category
          )}
        >
          <ThemedText
            style={{
              fontSize: 11,
              color: selectedCategory === cat.category ? '#FFFFFF' : '#666666',
            }}
          >
            {categoryNames[cat.category]}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 渲染相关句子（基于最近搜索词）
  const renderRelatedSentences = () => {
    if (!hasRecentWords) {
      return null;
    }

    if (isLoadingRelated) {
      return (
        <View style={{ alignItems: 'center', paddingVertical: Spacing.sm }}>
          <ActivityIndicator color="#F59E0B" size="small" />
        </View>
      );
    }

    if (relatedSentences.length === 0) {
      return null;
    }

    return (
      <View style={{ marginBottom: Spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            marginBottom: Spacing.xs,
          }}
        >
          <FontAwesome6 name="lightbulb" size={11} color="#F59E0B" />
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#F59E0B',
            }}
          >
            相关学习
          </ThemedText>
        </View>
        {relatedSentences.map((item, index) => {
          const itemId = `related-${index}`;
          const isPlaying = playingId === itemId;
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingVertical: Spacing.xs + 2,
                borderBottomWidth: 1,
                borderBottomColor: '#F5F5F5',
              }}
            >
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: '#1A1A2E',
                  }}
                >
                  {item.source}
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#6B5B95',
                    textAlign: langInfo.isRTL ? 'right' : 'left',
                  }}
                >
                  {item.target}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={{
                  padding: Spacing.xs,
                  marginLeft: Spacing.xs,
                }}
                onPress={() => playTTS(item.target, primaryLang, itemId)}
              >
                <FontAwesome6 
                  name={isPlaying ? "stop" : "volume-high"} 
                  size={14} 
                  color={isPlaying ? '#F59E0B' : '#999999'} 
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  // 渲染日常对话列表
  const renderDailyPhrases = () => {
    const displayPhrases: CategoryPhrases[] = selectedCategory
      ? phrases.filter((p) => p.category === selectedCategory)
      : phrases.slice(0, 2);

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            marginBottom: Spacing.xs,
          }}
        >
          <FontAwesome6 name="comments" size={11} color="#8B7DB8" />
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#6B5B95',
            }}
          >
            日常对话
          </ThemedText>
        </View>
        {renderCategorySelector()}
        {displayPhrases.map((cat) => (
          <View key={cat.category} style={{ marginBottom: Spacing.sm }}>
            <ThemedText
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: '#999999',
                marginBottom: Spacing.xs,
              }}
            >
              {categoryNames[cat.category]}
            </ThemedText>
            {cat.phrases.slice(0, 5).map((phrase, index) => {
              const itemId = `phrase-${cat.category}-${index}`;
              const isPlaying = playingId === itemId;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: Spacing.xs + 2,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F5F5F5',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      style={{
                        fontSize: 12,
                        color: '#1A1A2E',
                      }}
                    >
                      {phrase.source}
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: '#6B5B95',
                        textAlign: langInfo.isRTL ? 'right' : 'left',
                      }}
                    >
                      {phrase.target}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={{
                      padding: Spacing.xs,
                      marginLeft: Spacing.xs,
                    }}
                    onPress={() => playTTS(phrase.target, primaryLang, itemId)}
                  >
                    <FontAwesome6 
                      name={isPlaying ? "stop" : "volume-high"} 
                      size={14} 
                      color={isPlaying ? '#8B7DB8' : '#999999'} 
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // 渲染雅思句子
  const renderIELTS = () => {
    if (!hasRecentWords) {
      return (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: Spacing.lg,
          }}
        >
          <FontAwesome6 name="book-open" size={28} color="#CCCCCC" />
          <ThemedText
            style={{
              fontSize: 12,
              color: '#999999',
              marginTop: Spacing.sm,
              textAlign: 'center',
            }}
          >
            翻译后可查看相关雅思真题句子
          </ThemedText>
        </View>
      );
    }

    if (isLoadingIELTS) {
      return (
        <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
          <ActivityIndicator color="#8B7DB8" />
          <ThemedText style={{ fontSize: 12, color: '#999999', marginTop: Spacing.sm }}>
            正在生成雅思真题句子...
          </ThemedText>
        </View>
      );
    }

    return (
      <View>
        {ieltSentences.map((item, index) => {
          const itemId = `ielts-${index}`;
          const isPlaying = playingId === itemId;
          return (
            <View
              key={index}
              style={{
                backgroundColor: '#FAF8FF',
                borderRadius: BorderRadius.md,
                padding: Spacing.sm,
                marginBottom: Spacing.sm,
                borderLeftWidth: 2,
                borderLeftColor: '#8B7DB8',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: Spacing.xs,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#8B7DB8',
                    paddingVertical: 1,
                    paddingHorizontal: Spacing.xs,
                    borderRadius: BorderRadius.sm,
                  }}
                >
                  <ThemedText style={{ fontSize: 9, color: '#FFFFFF', fontWeight: '600' }}>
                    {item.type}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={{ padding: Spacing.xs }}
                  onPress={() => playTTS(item.sentence, 'en', itemId)}
                >
                  <FontAwesome6 
                    name={isPlaying ? "stop" : "volume-high"} 
                    size={14} 
                    color={isPlaying ? '#8B7DB8' : '#999999'} 
                  />
                </TouchableOpacity>
              </View>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: '#1A1A2E',
                  lineHeight: 18,
                  marginBottom: Spacing.xs,
                }}
              >
                {item.sentence}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 11,
                  color: '#666666',
                  lineHeight: 16,
                }}
              >
                {item.translation}
              </ThemedText>
              {item.vocabulary && item.vocabulary.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: Spacing.xs,
                    marginTop: Spacing.xs,
                  }}
                >
                  {item.vocabulary.map((word, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: '#F0EBFF',
                        paddingVertical: 1,
                        paddingHorizontal: Spacing.xs,
                        borderRadius: BorderRadius.sm,
                      }}
                    >
                      <ThemedText style={{ fontSize: 10, color: '#6B5B95' }}>
                        {word}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // 展开按钮
  const renderExpandButton = () => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
      }}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <ThemedText style={{ fontSize: 12, color: '#8B7DB8' }}>
        {isExpanded ? '收起' : '...展开更多'}
      </ThemedText>
      <FontAwesome6 
        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
        size={10} 
        color="#8B7DB8" 
      />
    </TouchableOpacity>
  );

  if (phrases.length === 0 && !isEnglish) {
    return null;
  }

  return (
    <View style={{ marginTop: Spacing.lg }}>
      {/* 标题 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: Spacing.sm,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <FontAwesome6 name="battery-full" size={16} color="#8B7DB8" />
          <ThemedText style={{ fontSize: 15, fontWeight: '600', color: '#1A1A2E' }}>
            充电小站
          </ThemedText>
        </View>
      </View>

      {/* 只有英文时显示Tab切换 */}
      {isEnglish && (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: Spacing.sm,
            backgroundColor: '#F5F5F5',
            borderRadius: BorderRadius.md,
            padding: 2,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: Spacing.xs + 2,
              borderRadius: BorderRadius.sm,
              backgroundColor: activeTab === 'phrases' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab('phrases')}
          >
            <ThemedText
              style={{
                fontSize: 12,
                color: activeTab === 'phrases' ? '#6B5B95' : '#666666',
                fontWeight: activeTab === 'phrases' ? '600' : '400',
              }}
            >
              常用对话
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: Spacing.xs + 2,
              borderRadius: BorderRadius.sm,
              backgroundColor: activeTab === 'ielts' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab('ielts')}
          >
            <ThemedText
              style={{
                fontSize: 12,
                color: activeTab === 'ielts' ? '#6B5B95' : '#666666',
                fontWeight: activeTab === 'ielts' ? '600' : '400',
              }}
            >
              雅思真题
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* 内容区域 - 固定高度限制 */}
      <ThemedView
        level="default"
        style={{
          borderRadius: BorderRadius.lg,
          padding: Spacing.md,
          backgroundColor: '#FFFFFF',
        }}
      >
        <View style={{ maxHeight: isExpanded ? undefined : DEFAULT_MAX_HEIGHT }}>
          <ScrollView 
            scrollEnabled={isExpanded}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'phrases' ? (
              <>
                {renderRelatedSentences()}
                {renderDailyPhrases()}
              </>
            ) : (
              renderIELTS()
            )}
          </ScrollView>
        </View>
        {renderExpandButton()}
      </ThemedView>
    </View>
  );
}
