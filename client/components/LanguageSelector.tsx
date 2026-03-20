import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/hooks/useTheme';
import {
  LanguageCode,
  LanguageInfo,
  languages,
  categoryNames,
  getLanguageByCode,
} from '@/constants/languages';
import { Spacing, BorderRadius } from '@/constants/theme';

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  label?: string;
  showAutoDetect?: boolean;
  excludeLanguages?: LanguageCode[];
}

export function LanguageSelector({
  value,
  onChange,
  label,
  showAutoDetect = false,
  excludeLanguages = [],
}: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedLanguage = getLanguageByCode(value);

  // 过滤语言列表
  const filteredLanguages = languages.filter(lang => {
    // 如果不显示自动检测，则过滤掉
    if (!showAutoDetect && lang.code === 'auto') return false;
    // 排除指定语言
    if (excludeLanguages.includes(lang.code)) return false;
    // 搜索过滤
    if (searchText) {
      const search = searchText.toLowerCase();
      return (
        lang.name.toLowerCase().includes(search) ||
        lang.nativeName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // 按分类分组
  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    const category = lang.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(lang);
    return acc;
  }, {} as Record<string, LanguageInfo[]>);

  const handleSelect = (code: LanguageCode) => {
    onChange(code);
    setModalVisible(false);
    setSearchText('');
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.xs,
          paddingVertical: Spacing.sm + 2,
          paddingHorizontal: Spacing.md,
          backgroundColor: '#F8F5FF',
          borderRadius: BorderRadius.lg,
          minWidth: 100,
        }}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText
          style={{
            color: '#6B5B95',
            fontSize: 14,
            fontWeight: '500',
          }}
          numberOfLines={1}
        >
          {selectedLanguage.nativeName}
        </ThemedText>
        <FontAwesome6 name="chevron-down" size={10} color="#6B5B95" />
      </TouchableOpacity>

      {label && (
        <ThemedText
          style={{
            fontSize: 11,
            color: '#999999',
            marginTop: 2,
            textAlign: 'center',
          }}
        >
          {label}
        </ThemedText>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView
            level="root"
            style={{
              borderTopLeftRadius: BorderRadius.xl,
              borderTopRightRadius: BorderRadius.xl,
              maxHeight: '80%',
              paddingBottom: Spacing.xl,
            }}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* 搜索框 */}
            <View
              style={{
                padding: Spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: '#E8E8E8',
              }}
            >
              <TextInput
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.md,
                  fontSize: 15,
                  color: '#1A1A2E',
                }}
                placeholder="搜索语言..."
                placeholderTextColor="#999999"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* 语言列表 */}
            <FlatList
              data={Object.entries(groupedLanguages)}
              keyExtractor={([category]) => category}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item: [category, langs] }) => (
                <View>
                  <View
                    style={{
                      backgroundColor: '#F8F8F8',
                      paddingVertical: Spacing.sm,
                      paddingHorizontal: Spacing.lg,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 12,
                        color: '#666666',
                        fontWeight: '600',
                      }}
                    >
                      {categoryNames[category] || category}
                    </ThemedText>
                  </View>
                  {langs.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: Spacing.md,
                        paddingHorizontal: Spacing.lg,
                        backgroundColor:
                          value === lang.code ? '#F8F5FF' : 'transparent',
                        borderBottomWidth: 1,
                        borderBottomColor: '#F0F0F0',
                      }}
                      onPress={() => handleSelect(lang.code)}
                    >
                      <View style={{ flex: 1 }}>
                        <ThemedText
                          style={{
                            fontSize: 15,
                            color: '#1A1A2E',
                            fontWeight: value === lang.code ? '600' : '400',
                          }}
                        >
                          {lang.nativeName}
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontSize: 12,
                            color: '#999999',
                            marginTop: 2,
                          }}
                        >
                          {lang.name}
                        </ThemedText>
                      </View>
                      {value === lang.code && (
                        <FontAwesome6
                          name="check"
                          size={16}
                          color="#6B5B95"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              style={{ maxHeight: 400 }}
            />
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// 目标语言选择Modal（选择两种目标语言）
interface TargetLanguageModalProps {
  visible: boolean;
  primaryLang: LanguageCode;
  secondaryLang: LanguageCode;
  onPrimaryChange: (code: LanguageCode) => void;
  onSecondaryChange: (code: LanguageCode) => void;
  onClose: () => void;
  excludeLangs?: LanguageCode[];
}

export function TargetLanguageModal({
  visible,
  primaryLang,
  secondaryLang,
  onPrimaryChange,
  onSecondaryChange,
  onClose,
  excludeLangs = [],
}: TargetLanguageModalProps) {
  const [searchText, setSearchText] = useState('');
  const [selectingPrimary, setSelectingPrimary] = useState(true);

  const primaryLangInfo = getLanguageByCode(primaryLang);
  const secondaryLangInfo = getLanguageByCode(secondaryLang);

  // 过滤语言列表
  const filteredLanguages = languages.filter(lang => {
    if (lang.code === 'auto') return false;
    if (excludeLangs.includes(lang.code)) return false;
    if (searchText) {
      const search = searchText.toLowerCase();
      return (
        lang.name.toLowerCase().includes(search) ||
        lang.nativeName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // 按分类分组
  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    const category = lang.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(lang);
    return acc;
  }, {} as Record<string, LanguageInfo[]>);

  const handleSelect = (code: LanguageCode) => {
    if (selectingPrimary) {
      onPrimaryChange(code);
      setSelectingPrimary(false);
    } else {
      onSecondaryChange(code);
      onClose();
      setSearchText('');
      setSelectingPrimary(true);
    }
  };

  const currentLang = selectingPrimary ? primaryLang : secondaryLang;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        onClose();
        setSearchText('');
        setSelectingPrimary(true);
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
        activeOpacity={1}
        onPress={() => {
          onClose();
          setSearchText('');
          setSelectingPrimary(true);
        }}
      >
        <ThemedView
          level="root"
          style={{
            borderTopLeftRadius: BorderRadius.xl,
            borderTopRightRadius: BorderRadius.xl,
            maxHeight: '80%',
            paddingBottom: Spacing.xl,
          }}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* 标题和当前选择 */}
          <View
            style={{
              padding: Spacing.lg,
              borderBottomWidth: 1,
              borderBottomColor: '#E8E8E8',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
              <ThemedText style={{ fontSize: 16, fontWeight: '600', color: '#1A1A2E' }}>
                选择目标语言
              </ThemedText>
              <TouchableOpacity onPress={() => {
                onClose();
                setSearchText('');
                setSelectingPrimary(true);
              }}>
                <FontAwesome6 name="xmark" size={18} color="#999999" />
              </TouchableOpacity>
            </View>
            
            {/* 当前选择状态 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.lg,
                  backgroundColor: selectingPrimary ? '#F8F5FF' : '#F5F5F5',
                  borderWidth: 1,
                  borderColor: selectingPrimary ? '#8B7DB8' : '#E8E8E8',
                }}
                onPress={() => setSelectingPrimary(true)}
              >
                <ThemedText style={{ fontSize: 11, color: '#999999', marginBottom: 2 }}>主翻译</ThemedText>
                <ThemedText style={{ fontSize: 14, fontWeight: '600', color: '#6B5B95' }}>
                  {primaryLangInfo.nativeName}
                </ThemedText>
              </TouchableOpacity>
              <ThemedText style={{ color: '#999999' }}>+</ThemedText>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: Spacing.md,
                  borderRadius: BorderRadius.lg,
                  backgroundColor: !selectingPrimary ? '#F8F5FF' : '#F5F5F5',
                  borderWidth: 1,
                  borderColor: !selectingPrimary ? '#8B7DB8' : '#E8E8E8',
                }}
                onPress={() => setSelectingPrimary(false)}
              >
                <ThemedText style={{ fontSize: 11, color: '#999999', marginBottom: 2 }}>参考翻译</ThemedText>
                <ThemedText style={{ fontSize: 14, fontWeight: '600', color: '#6B5B95' }}>
                  {secondaryLangInfo.nativeName}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 搜索框 */}
          <View style={{ padding: Spacing.lg, paddingTop: Spacing.sm }}>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: BorderRadius.lg,
                padding: Spacing.md,
                fontSize: 15,
                color: '#1A1A2E',
              }}
              placeholder="搜索语言..."
              placeholderTextColor="#999999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* 语言列表 */}
          <FlatList
            data={Object.entries(groupedLanguages)}
            keyExtractor={([category]) => category}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: [category, langs] }) => (
              <View>
                <View
                  style={{
                    backgroundColor: '#F8F8F8',
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.lg,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: '#666666',
                      fontWeight: '600',
                    }}
                  >
                    {categoryNames[category] || category}
                  </ThemedText>
                </View>
                {langs.map((lang) => {
                  const isSelected = lang.code === primaryLang || lang.code === secondaryLang;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: Spacing.md,
                        paddingHorizontal: Spacing.lg,
                        backgroundColor: currentLang === lang.code ? '#F8F5FF' : 'transparent',
                        borderBottomWidth: 1,
                        borderBottomColor: '#F0F0F0',
                      }}
                      onPress={() => handleSelect(lang.code)}
                    >
                      <View style={{ flex: 1 }}>
                        <ThemedText
                          style={{
                            fontSize: 15,
                            color: '#1A1A2E',
                            fontWeight: currentLang === lang.code ? '600' : '400',
                          }}
                        >
                          {lang.nativeName}
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontSize: 12,
                            color: '#999999',
                            marginTop: 2,
                          }}
                        >
                          {lang.name}
                        </ThemedText>
                      </View>
                      {isSelected && (
                        <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                          {lang.code === primaryLang && (
                            <View style={{ backgroundColor: '#8B7DB8', paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.sm }}>
                              <ThemedText style={{ fontSize: 10, color: '#FFFFFF' }}>主</ThemedText>
                            </View>
                          )}
                          {lang.code === secondaryLang && (
                            <View style={{ backgroundColor: '#A8C8B8', paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: BorderRadius.sm }}>
                              <ThemedText style={{ fontSize: 10, color: '#FFFFFF' }}>参考</ThemedText>
                            </View>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            style={{ maxHeight: 350 }}
          />
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}
