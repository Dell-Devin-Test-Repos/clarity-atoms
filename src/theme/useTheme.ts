import { useEffect, useState } from 'preact/hooks';

import { useMediaQuery } from '../hooks';

import { getTheme, setTheme, theme$ } from './theme';
import { ThemeName, ThemePreference } from './themes';


export interface UseThemeHook {
  /** What the consumer asked for, possibly `auto`. */
  preference: ThemePreference;
  /** What is actually rendered - `auto` resolved against the OS setting. */
  theme: ThemeName;
  setTheme: (preference: ThemePreference) => void;
}


/**
 * Observe and change the active theme. Changing the theme mutates a DOM
 * attribute, so components do not need to subscribe to this hook to be themed
 * - it is only needed by UI that displays or switches the theme.
 */
export function useTheme(): UseThemeHook {

  const [preference, setPreference] = useState<ThemePreference>(getTheme);

  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    const subscription = theme$.subscribe(setPreference);

    return () => subscription.unsubscribe();
  }, []);

  const theme: ThemeName = preference === 'auto'
    ? (isDark ? 'dark' : 'light')
    : preference;

  return { preference, theme, setTheme };
}
