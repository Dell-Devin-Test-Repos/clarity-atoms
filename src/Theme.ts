import { tokensToRule } from './theme/css';
import { alpha, makeRamp, readableOn } from './theme/palette';
import { installThemes, setTheme, themeAttribute } from './theme/theme';
import { darkTheme, highContrastTheme, lightTheme } from './theme/themes';
import { TokenSet } from './theme/tokens';


/**
 * @deprecated Use the token system instead - see `src/theme`.
 *
 * The six fields below are mapped onto semantic tokens:
 *
 * | Legacy field    | Token                                         |
 * | --------------- | --------------------------------------------- |
 * | `primary`       | `interactive` (+ derived hover/active shades) |
 * | `primaryComp`   | `text-on-interactive`                         |
 * | `border`        | `border`                                      |
 * | `borderLight`   | `border-subtle`                               |
 * | `disabled`      | `state-disabled`                              |
 * | `disabledLight` | `state-disabled-subtle`                       |
 */
export interface Theme {
  primary: string;
  primaryComp: string;

  border: string;
  borderLight: string;

  disabled: string;
  disabledLight: string;
}


/**
 * Build a token set by overriding the light theme with the legacy six fields.
 * Shades that used to be derived per component are derived once, from a ramp.
 */
function fromLegacyTheme(theme: Theme): TokenSet {

  const brand = makeRamp(theme.primary);

  return {
    ...lightTheme,

    'text-on-interactive': theme.primaryComp || readableOn(theme.primary),

    'border': theme.border,
    'border-subtle': theme.borderLight,
    'border-strong': makeRamp(theme.border)[600],

    'interactive': theme.primary,
    'interactive-hover': brand[600],
    'interactive-active': brand[700],
    'interactive-subtle': brand[50],
    'interactive-text': theme.primary,

    'state-hover': alpha(theme.primary, 0.08),
    'state-focus': alpha(theme.primary, 0.16),
    'state-active': alpha(theme.primary, 0.24),
    'state-selected': brand[50],
    'state-disabled': theme.disabled,
    'state-disabled-subtle': theme.disabledLight,
    'state-focus-ring': theme.primary,

    'feedback-info': theme.primary
  };
}


/**
 * @deprecated Prefer `installThemes()` + `setTheme()` from `src/theme`, which
 * support dark and high-contrast themes and per-subtree theming.
 *
 * Kept as a shim: the legacy palette becomes the `light` theme, while `dark`
 * and `high-contrast` remain available through `setTheme()`. All the old
 * `--ca-*` names (`--ca-primary`, `--ca-button-hover`, ...) are still emitted
 * as aliases of the new tokens.
 */
export function setupTheme(theme: Theme) {

  const light = fromLegacyTheme(theme);

  const resolved = installThemes({ themes: { light } });

  // Legacy callers never set `data-ca-theme`; `:root` already carries the
  // light tokens, so nothing else is required for them to keep working.
  return {
    tokens: resolved,
    setTheme,
    themeAttribute
  };
}


export {
  darkTheme, highContrastTheme, installThemes,
  lightTheme, setTheme, themeAttribute, tokensToRule
};
