/**
 * Source of truth for the Clarity Atoms design token system.
 *
 * Tokens are plain data. A `TokenSet` is converted into `--ca-*` CSS custom
 * properties by `theme/css.ts` and scoped to a `[data-ca-theme]` root by
 * `theme/theme.ts`. Components must only ever reference the generated custom
 * properties, never raw colour literals.
 */

/** Palette ramp produced by `makeRamp`. Keys are perceptual lightness steps. */
export type RampStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type Ramp = Record<RampStep, string>;

export const rampSteps: RampStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];


export interface ColorTokens {

  /** Page/app background. */
  'surface': string;
  /** Cards, dropdowns, dialogs - anything floating above `surface`. */
  'surface-raised': string;
  /** Recessed areas - code blocks, table headers. */
  'surface-sunken': string;
  /** Overlay scrim behind blocking layers. */
  'surface-overlay': string;

  'text-primary': string;
  'text-secondary': string;
  'text-disabled': string;
  /** Text placed on top of `interactive` fills. */
  'text-on-interactive': string;

  'border': string;
  'border-strong': string;
  'border-subtle': string;

  'interactive': string;
  'interactive-hover': string;
  'interactive-active': string;
  'interactive-subtle': string;
  /** Text/icon colour for interactive elements without a fill. */
  'interactive-text': string;

  /** Tint applied on hover of a transparent interactive surface. */
  'state-hover': string;
  /** Tint applied on focus of a transparent interactive surface. */
  'state-focus': string;
  'state-active': string;
  'state-selected': string;
  'state-disabled': string;
  'state-disabled-subtle': string;
  /** Colour of the focus ring outline. */
  'state-focus-ring': string;

  'feedback-info': string;
  'feedback-success': string;
  'feedback-warning': string;
  'feedback-error': string;
}

export interface SpaceTokens {
  'space-0': string;
  'space-1': string;
  'space-2': string;
  'space-3': string;
  'space-4': string;
  'space-5': string;
  'space-6': string;
}

export interface RadiusTokens {
  'radius-none': string;
  'radius-sm': string;
  'radius-md': string;
  'radius-lg': string;
  'radius-full': string;
}

export interface TypographyTokens {
  'font-family': string;
  'font-family-mono': string;

  'font-size-xs': string;
  'font-size-sm': string;
  'font-size-md': string;
  'font-size-lg': string;
  'font-size-xl': string;

  'font-weight-regular': string;
  'font-weight-medium': string;
  'font-weight-bold': string;

  'line-height-tight': string;
  'line-height-normal': string;
}

export interface ElevationTokens {
  'elevation-0': string;
  'elevation-1': string;
  'elevation-2': string;
  'elevation-3': string;
}

export interface MotionTokens {
  'duration-instant': string;
  'duration-fast': string;
  'duration-normal': string;
  'duration-slow': string;

  'easing-standard': string;
  'easing-enter': string;
  'easing-exit': string;
}

export interface SizeTokens {
  /** Clarity standard control height. */
  'control-height': string;
  /** Clarity compact control height. */
  'control-height-compact': string;
  'border-width': string;
  'focus-ring-width': string;
}

/** Full set of tokens that make up a theme. */
export interface TokenSet extends
  ColorTokens, SpaceTokens, RadiusTokens,
  TypographyTokens, ElevationTokens, MotionTokens, SizeTokens { }

/** Tokens that are shared by every theme (everything except colour). */
export type StructuralTokens =
  SpaceTokens & RadiusTokens & TypographyTokens & MotionTokens & SizeTokens;

export type TokenName = keyof TokenSet;


/**
 * Non-colour scales. These are identical across light, dark and
 * high-contrast themes, so they are defined exactly once.
 */
export const structuralTokens: StructuralTokens = {

  'space-0': '0',
  'space-1': '0.25rem',
  'space-2': '0.5rem',
  'space-3': '0.75rem',
  'space-4': '1rem',
  'space-5': '1.5rem',
  'space-6': '2rem',

  'radius-none': '0',
  'radius-sm': '0.2rem',
  'radius-md': '0.25rem',
  'radius-lg': '0.5rem',
  'radius-full': '9999px',

  'font-family': 'inherit',
  'font-family-mono': `'Fira Code', 'SFMono-Regular', Consolas, monospace`,

  'font-size-xs': '0.75rem',
  'font-size-sm': '0.875rem',
  'font-size-md': '1rem',
  'font-size-lg': '1.25rem',
  'font-size-xl': '1.5rem',

  'font-weight-regular': '400',
  'font-weight-medium': '500',
  'font-weight-bold': '700',

  'line-height-tight': '1',
  'line-height-normal': '1.5',

  'duration-instant': '80ms',
  'duration-fast': '120ms',
  'duration-normal': '150ms',
  'duration-slow': '240ms',

  'easing-standard': 'ease-out',
  'easing-enter': 'cubic-bezier(0, 0, 0.2, 1)',
  'easing-exit': 'cubic-bezier(0.4, 0, 1, 1)',

  'control-height': '36px',
  'control-height-compact': '24px',
  'border-width': '1px',
  'focus-ring-width': '2px'
};
