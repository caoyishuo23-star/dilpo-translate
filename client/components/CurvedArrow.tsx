import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CurvedArrowProps {
  color?: string;
  size?: number;
}

/**
 * 弧形箭头组件 - 用于表示翻译结果的转换流程
 * 从上方输出框弯曲指向下方输出框
 */
export function CurvedArrow({ color = '#8B7DB8', size = 40 }: CurvedArrowProps) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size * 1.2} viewBox="0 0 40 48">
        <Defs>
          <LinearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* 弧形曲线 + 箭头 */}
        <Path
          d="M20 0 
             C 20 8, 35 12, 35 24 
             C 35 36, 20 40, 20 48
             M 20 48
             L 14 40
             M 20 48
             L 26 40"
          fill="none"
          stroke="url(#arrowGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
