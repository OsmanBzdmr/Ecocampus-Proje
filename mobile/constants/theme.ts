/**
 * EcoCampus theme — web'deki eco renk paletiyle tutarlı (#22c55e tonları)
 * https://tailwindcss.com/docs/customizing-colors
 */

import { Platform } from 'react-native';

export const eco = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#145231',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: eco[500],
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: eco[500],
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: eco[400],
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: eco[400],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
