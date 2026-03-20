import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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

export function LearningModule({ primaryLang, recentWords = [] }: LearningModuleProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | null>(null);
  const [relatedSentences, setRelatedSentences] = useState<RelatedSentence[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [ieltSentences, setIeltSentences] = useState<IELTSSentence[]>([]);
  const [isLoadingIELTS, setIsLoadingIELTS] = useState(false);
  const [activeTab, setActiveTab] = useState<'phrases' | 'ielts'>('phrases');

  const langInfo = getLanguageByCode(primaryLang);
  const phrases = getPhrasesForLanguage(primaryLang);
  const isEnglish = primaryLang === 'en';
  const hasRecentWords = recentWords.length > 0;

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

  const fetchRelatedSentences = async () => {
    if (recentWords.length === 0) return;
    
    setIsLoadingRelated(true);
    try {
      const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
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
      const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;
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

  // 渲染场景选择
  const renderCategorySelector = () => (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    }}>
      {phrases.map((cat) => (
        <TouchableOpacity
          key={cat.category}
          style={{
            paddingVertical: Spacing.xs + 2,
            paddingHorizontal: Spacing.md,
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
              fontSize: 12,
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
        <View style={{ alignItems: 'center', paddingVertical: Spacing.md }}>
          <ActivityIndicator color="#8B7DB8" size="small" />
        </View>
      );
    }

    if (relatedSentences.length === 0) {
      return null;
    }

    return (
      <View style={{ marginBottom: Spacing.lg }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            marginBottom: Spacing.sm,
          }}
        >
          <FontAwesome6 name="lightbulb" size={12} color="#F59E0B" />
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#F59E0B',
            }}
          >
            相关学习
          </ThemedText>
        </View>
        {relatedSentences.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingVertical: Spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0',
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: '#1A1A2E',
                  marginBottom: 2,
                }}
              >
                {item.source}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#6B5B95',
                  textAlign: langInfo.isRTL ? 'right' : 'left',
                }}
              >
                {item.target}
              </ThemedText>
            </View>
            <View
              style={{
                backgroundColor: '#FEF3C7',
                paddingVertical: 2,
                paddingHorizontal: Spacing.sm,
                borderRadius: BorderRadius.sm,
              }}
            >
              <ThemedText style={{ fontSize: 10, color: '#F59E0B' }}>
                {item.word}
              </ThemedText>
            </View>
          </View>
        ))}
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
            marginBottom: Spacing.sm,
          }}
        >
          <FontAwesome6 name="comments" size={12} color="#8B7DB8" />
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#6B5B95',
            }}
          >
            日常对话
          </ThemedText>
        </View>
        {renderCategorySelector()}
        {displayPhrases.map((cat) => (
          <View key={cat.category} style={{ marginBottom: Spacing.md }}>
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#999999',
                marginBottom: Spacing.sm,
              }}
            >
              {categoryNames[cat.category]}
            </ThemedText>
            {cat.phrases.slice(0, 5).map((phrase, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingVertical: Spacing.sm,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F0F0F0',
                }}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      color: '#1A1A2E',
                      marginBottom: 2,
                    }}
                  >
                    {phrase.source}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#6B5B95',
                      marginBottom: phrase.pronunciation ? 2 : 0,
                      textAlign: langInfo.isRTL ? 'right' : 'left',
                    }}
                  >
                    {phrase.target}
                  </ThemedText>
                  {phrase.pronunciation && (
                    <ThemedText
                      style={{
                        fontSize: 11,
                        color: '#999999',
                        fontStyle: 'italic',
                      }}
                    >
                      {phrase.pronunciation}
                    </ThemedText>
                  )}
                </View>
              </View>
            ))}
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
            paddingVertical: Spacing.xl,
          }}
        >
          <FontAwesome6 name="book-open" size={32} color="#CCCCCC" />
          <ThemedText
            style={{
              fontSize: 13,
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
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
          <ActivityIndicator color="#8B7DB8" />
          <ThemedText style={{ fontSize: 13, color: '#999999', marginTop: Spacing.sm }}>
            正在生成雅思真题句子...
          </ThemedText>
        </View>
      );
    }

    return (
      <View>
        {ieltSentences.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#FAF8FF',
              borderRadius: BorderRadius.lg,
              padding: Spacing.md,
              marginBottom: Spacing.sm,
              borderLeftWidth: 3,
              borderLeftColor: '#8B7DB8',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Spacing.xs,
              }}
            >
              <View
                style={{
                  backgroundColor: '#8B7DB8',
                  paddingVertical: 2,
                  paddingHorizontal: Spacing.sm,
                  borderRadius: BorderRadius.sm,
                }}
              >
                <ThemedText style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '600' }}>
                  {item.type}
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={{
                fontSize: 14,
                color: '#1A1A2E',
                lineHeight: 22,
                marginBottom: Spacing.xs,
              }}
            >
              {item.sentence}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: '#666666',
                lineHeight: 18,
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
                  marginTop: Spacing.sm,
                }}
              >
                {item.vocabulary.map((word, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: '#F0EBFF',
                      paddingVertical: 2,
                      paddingHorizontal: Spacing.sm,
                      borderRadius: BorderRadius.sm,
                    }}
                  >
                    <ThemedText style={{ fontSize: 11, color: '#6B5B95' }}>
                      {word}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (phrases.length === 0 && !isEnglish) {
    return null;
  }

  return (
    <View style={{ marginTop: Spacing.xl }}>
      {/* 标题 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: Spacing.md,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <FontAwesome6 name="battery-full" size={18} color="#8B7DB8" />
          <ThemedText style={{ fontSize: 16, fontWeight: '600', color: '#1A1A2E' }}>
            充电小站
          </ThemedText>
        </View>
      </View>

      {/* 只有英文时显示Tab切换 */}
      {isEnglish && (
        <View
          style={{
            flexDirection: 'row',
            marginBottom: Spacing.md,
            backgroundColor: '#F5F5F5',
            borderRadius: BorderRadius.lg,
            padding: 3,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: Spacing.sm,
              borderRadius: BorderRadius.md,
              backgroundColor: activeTab === 'phrases' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab('phrases')}
          >
            <ThemedText
              style={{
                fontSize: 13,
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
              paddingVertical: Spacing.sm,
              borderRadius: BorderRadius.md,
              backgroundColor: activeTab === 'ielts' ? '#FFFFFF' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setActiveTab('ielts')}
          >
            <ThemedText
              style={{
                fontSize: 13,
                color: activeTab === 'ielts' ? '#6B5B95' : '#666666',
                fontWeight: activeTab === 'ielts' ? '600' : '400',
              }}
            >
              雅思真题
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* 内容区域 */}
      <ThemedView
        level="default"
        style={{
          borderRadius: BorderRadius.xl,
          padding: Spacing.lg,
          backgroundColor: '#FFFFFF',
        }}
      >
        {activeTab === 'phrases' ? (
          <>
            {renderRelatedSentences()}
            {renderDailyPhrases()}
          </>
        ) : (
          renderIELTS()
        )}
      </ThemedView>
    </View>
  );
}
