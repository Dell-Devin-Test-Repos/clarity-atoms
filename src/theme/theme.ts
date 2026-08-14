import { injectGlobal } from '@emotion/css';
import { BehaviorSubject } from 'rxjs';

import { tokensToRule } from './css';
import { darkTheme, highContrastTheme, lightTheme, ThemeName, ThemePreference, themes } from './themes';
import { TokenSet } from './tokens';


/** Attribute used to scope tokens to a subtree. */
export const themeAttribute = 'data-ca-theme';

const darkQuery = '(prefers-color-scheme: dark)';

let installed = false;

/**
 * Current preference. Themes are applied through a DOM attribute, so switching
 * never re-renders the component tree; this subject only exists so that UI
 * (e.g. a theme switcher) can observe the active value.
 */
const preference$ = new BehaviorSubject<ThemePreference>('light');


export interface InstallThemesOptions {
  /** Additional or replacement token sets, keyed by theme name. */
  themes?: Partial<Record<ThemeName, TokenSet>>;
  /** Theme used by `:root` and by `auto` in light mode. Defaults to `light`. */
  defaultTheme?: ThemeName;
}


function selectorFor(name: ThemeName): string {
  return `[${themeAttribute}='${name}']`;
}


/**
 * Inject the `--ca-*` custom properties for every theme.
 *
 * Tokens are emitted once per theme and scoped to `[data-ca-theme]`, so any
 * number of themes can co-exist on a page and switching is a single attribute
 * write. The default theme is additionally emitted on `:root` so that
 * consumers who never set an attribute still get a working theme.
 */
export function installThemes(options: InstallThemesOptions = {}) {

  const resolved = { ...themes, ...options.themes };
  const defaultName = options.defaultTheme ?? 'light';
  const defaultTokens = resolved[defaultName];

  const rules = [
    tokensToRule(`:root, ${selectorFor(defaultName)}`, defaultTokens),
    ...(Object.keys(resolved) as ThemeName[])
      .filter((name) => name !== defaultName)
      .map((name) => tokensToRule(selectorFor(name), resolved[name])),

    // `auto` follows the OS setting without any scripting.
    tokensToRule(`[${themeAttribute}='auto']`, defaultTokens),
    `@media ${darkQuery} {\n${tokensToRule(`[${themeAttribute}='auto']`, resolved.dark)}\n}`
  ];

  injectGlobal`${rules.join('\n\n')}`;

  installed = true;

  return resolved;
}


function ensureInstalled() {
  if (!installed) {
    installThemes();
  }
}


/** Does the OS currently ask for a dark colour scheme? */
export function prefersDark(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(darkQuery).matches;
}


/** Resolve `auto` into the theme that is actually rendered right now. */
export function resolveTheme(preference: ThemePreference): ThemeName {
  return preference === 'auto'
    ? (prefersDark() ? 'dark' : 'light')
    : preference;
}


/**
 * Apply a theme by setting `data-ca-theme` on `element`
 * (`<html>` by default, so that portals and dialogs inherit it too).
 */
export function setTheme(preference: ThemePreference, element?: HTMLElement) {

  ensureInstalled();

  const target = element ?? document.documentElement as HTMLElement;

  target.setAttribute(themeAttribute, preference);

  preference$.next(preference);

  return preference;
}


/** The preference last applied through `setTheme`. */
export function getTheme(): ThemePreference {
  return preference$.value;
}


/** Stream of theme preferences, starting with the current one. */
export const theme$ = preference$.asObservable();


export { lightTheme, darkTheme, highContrastTheme, themes };
