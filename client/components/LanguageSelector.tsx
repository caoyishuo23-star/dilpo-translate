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
