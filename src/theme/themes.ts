import { alpha, makeRamp, readableOn } from './palette';
import { ColorTokens, ElevationTokens, structuralTokens, TokenSet } from './tokens';


export type ThemeName = 'light' | 'dark' | 'high-contrast';

/** `auto` follows the OS `prefers-color-scheme` setting. */
export type ThemePreference = ThemeName | 'auto';


/** Dell Clarity brand blue - the single source for every blue in the system. */
export const brandBase = '#0076CE';

/** Neutral base used to derive greys for surfaces, borders and disabled states. */
export const neutralBase = '#808080';

export const brand = makeRamp(brandBase);
export const neutral = makeRamp(neutralBase);


const lightColors: ColorTokens = {

  'surface': '#FFFFFF',
  'surface-raised': '#FFFFFF',
  'surface-sunken': neutral[50],
  'surface-overlay': alpha('#000000', 0.12),

  'text-primary': '#444444',
  'text-secondary': '#666666',
  'text-disabled': '#8C8C8C',
  'text-on-interactive': readableOn(brand[500]),

  'border': neutral[200],
  'border-strong': neutral[500],
  'border-subtle': neutral[100],

  'interactive': brand[500],
  'interactive-hover': brand[600],
  'interactive-active': brand[700],
  'interactive-subtle': brand[50],
  // A step darker than `interactive` so that link text also clears AA on the
  // subtle/selected backgrounds, not just on `surface`.
  'interactive-text': brand[600],

  'state-hover': alpha(brand[500], 0.08),
  'state-focus': alpha(brand[500], 0.16),
  'state-active': alpha(brand[500], 0.24),
  'state-selected': brand[50],
  'state-disabled': neutral[200],
  'state-disabled-subtle': neutral[50],
  'state-focus-ring': brand[500],

  'feedback-info': brand[500],
  'feedback-success': '#177245',
  'feedback-warning': '#8A5300',
  'feedback-error': '#C1272D'
};


const lightElevation: ElevationTokens = {
  'elevation-0': 'none',
  'elevation-1': `0 0 4px ${alpha('#000000', 0.12)}`,
  'elevation-2': `0 0 6px ${alpha('#141414', 0.2)}`,
  'elevation-3': `0 2px 12px ${alpha('#141414', 0.24)}`
};


const darkColors: ColorTokens = {

  'surface': '#1A1D21',
  'surface-raised': '#24282E',
  'surface-sunken': '#12151A',
  'surface-overlay': alpha('#000000', 0.56),

  'text-primary': '#F2F4F7',
  'text-secondary': '#B4BBC6',
  'text-disabled': '#7E8794',
  'text-on-interactive': readableOn(brand[300]),

  'border': '#3F464F',
  'border-strong': '#697280',
  'border-subtle': '#2C3138',

  'interactive': brand[300],
  'interactive-hover': brand[200],
  'interactive-active': brand[100],
  'interactive-subtle': '#1E3A52',
  'interactive-text': brand[300],

  'state-hover': alpha(brand[200], 0.12),
  'state-focus': alpha(brand[200], 0.24),
  'state-active': alpha(brand[200], 0.32),
  'state-selected': '#1E3A52',
  'state-disabled': '#3F464F',
  'state-disabled-subtle': '#2C3138',
  'state-focus-ring': brand[200],

  'feedback-info': brand[200],
  'feedback-success': '#5EC97F',
  'feedback-warning': '#F0B429',
  'feedback-error': '#FF8A8A'
};


const darkElevation: ElevationTokens = {
  'elevation-0': 'none',
  'elevation-1': `0 0 4px ${alpha('#000000', 0.6)}`,
  'elevation-2': `0 0 8px ${alpha('#000000', 0.7)}`,
  'elevation-3': `0 4px 16px ${alpha('#000000', 0.8)}`
};


const highContrastColors: ColorTokens = {

  'surface': '#000000',
  'surface-raised': '#000000',
  'surface-sunken': '#000000',
  'surface-overlay': alpha('#000000', 0.75),

  'text-primary': '#FFFFFF',
  'text-secondary': '#FFFFFF',
  'text-disabled': '#C0C0C0',
  'text-on-interactive': '#000000',

  'border': '#FFFFFF',
  'border-strong': '#FFFFFF',
  'border-subtle': '#FFFFFF',

  'interactive': '#7FC4FF',
  'interactive-hover': '#B3DCFF',
  'interactive-active': '#E0F1FF',
  'interactive-subtle': '#00263F',
  'interactive-text': '#7FC4FF',

  'state-hover': alpha('#7FC4FF', 0.24),
  'state-focus': alpha('#7FC4FF', 0.36),
  'state-active': alpha('#7FC4FF', 0.48),
  'state-selected': '#00263F',
  'state-disabled': '#767676',
  'state-disabled-subtle': '#3B3B3B',
  'state-focus-ring': '#FFFF00',

  'feedback-info': '#7FC4FF',
  'feedback-success': '#7BE495',
  'feedback-warning': '#FFD24D',
  'feedback-error': '#FF9E9E'
};


/** High contrast relies on borders rather than shadows to convey elevation. */
const highContrastElevation: ElevationTokens = {
  'elevation-0': 'none',
  'elevation-1': `0 0 0 1px #FFFFFF`,
  'elevation-2': `0 0 0 2px #FFFFFF`,
  'elevation-3': `0 0 0 2px #FFFFFF`
};


function makeTheme(colors: ColorTokens, elevation: ElevationTokens): TokenSet {
  return { ...structuralTokens, ...colors, ...elevation };
}


export const lightTheme: TokenSet = makeTheme(lightColors, lightElevation);
export const darkTheme: TokenSet = makeTheme(darkColors, darkElevation);
export const highContrastTheme: TokenSet = makeTheme(highContrastColors, highContrastElevation);

export const themes: Record<ThemeName, TokenSet> = {
  'light': lightTheme,
  'dark': darkTheme,
  'high-contrast': highContrastTheme
};
