import { css, cx } from '@emotion/css';

import { prefersDark, setTheme, ThemePreference, useTheme } from '../../src/theme';


export interface ThemeSwitcherProps {
  class?: string;
}

const storageKey = 'clarity-atoms-theme';

const options: { value: ThemePreference; label: string; }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'high-contrast', label: 'Contrast' },
  { value: 'auto', label: 'Auto' }
];


/** Restore the preference chosen on a previous visit. */
export function restoreTheme(): ThemePreference {

  const stored = window.localStorage.getItem(storageKey) as ThemePreference | null;

  const valid = stored && options.some((x) => x.value === stored);

  return setTheme(valid ? stored! : 'light');
}


const rootStyle = css`
  display: flex;
  padding: 0 var(--ca-space-2);

  align-items: center;

  gap: var(--ca-space-1);
`;

const buttonStyle = css`
  padding: var(--ca-space-1) var(--ca-space-2);

  border: var(--ca-border-width) solid currentColor;
  border-radius: var(--ca-radius-sm);

  background: transparent;
  color: inherit;

  font-family: inherit;
  font-size: var(--ca-font-size-xs);

  cursor: pointer;

  transition: all var(--ca-duration-instant) var(--ca-easing-standard);

  &:hover {
    background: var(--ca-interactive-hover);
  }

  &:focus-visible {
    outline: var(--ca-focus-ring-width) solid var(--ca-state-focus-ring);
    outline-offset: var(--ca-focus-ring-width);
  }
`;

const selectedStyle = css`
  background: var(--ca-interactive-active);

  font-weight: var(--ca-font-weight-bold);
`;


export function ThemeSwitcher(props: ThemeSwitcherProps) {

  const { preference } = useTheme();

  // Describe what the OS asks for, regardless of the current preference.
  const systemTheme = prefersDark() ? 'dark' : 'light';

  const onSelect = (value: ThemePreference) => {
    window.localStorage.setItem(storageKey, value);
    setTheme(value);
  };

  return (
    <div class={cx('theme-switcher', rootStyle, props.class)} role='group' aria-label='Theme'>
      {options.map((x) => (
        <button type='button' class={cx(buttonStyle, preference === x.value && selectedStyle)}
          aria-pressed={preference === x.value}
          title={x.value === 'auto' ? `Follow system (${systemTheme})` : `${x.label} theme`}
          onClick={() => onSelect(x.value)}>
            {x.label}
        </button>
      ))}
    </div>
  );
}
