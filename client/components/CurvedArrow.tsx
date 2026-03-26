import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CurvedArrowProps {
  color?: string;
  size?: number;
}

/**
 * 垂直弧形箭头组件 - 用于连接上下两个翻译输出框
 * 从上方弯曲指向下方，表示翻译结果的转换流程
 */
export function CurvedArrow({ color = '#8B7DB8', size = 40 }: CurvedArrowProps) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size * 2.5} viewBox="0 0 40 100">
        <Defs>
          <LinearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* 垂直弧形曲线 + 箭头 */}
        <Path
          d="M20 5
             C 20 20, 5 30, 5 50
             C 5 70, 20 80, 20 95
             M 20 95
             L 14 85
             M 20 95
             L 26 85"
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
  },
});
