import { css } from '@emotion/css';

import { lightTheme, TokenName, tokenVarName, useTheme } from '../../../src/theme';


const tableStyle = css`
  width: 100%;
  margin-top: var(--ca-space-4);

  border-collapse: collapse;
  font-size: var(--ca-font-size-sm);

  th,
  td {
    padding: var(--ca-space-2);

    border-bottom: var(--ca-border-width) solid var(--ca-border-subtle);
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: var(--ca-text-secondary);
    font-weight: var(--ca-font-weight-medium);
  }

  code {
    font-family: var(--ca-font-family-mono);
    font-size: var(--ca-font-size-xs);
  }
`;

const swatchStyle = css`
  display: inline-block;
  width: 2.5rem;
  height: 1.25rem;

  border: var(--ca-border-width) solid var(--ca-border);
  border-radius: var(--ca-radius-sm);
`;


/** Every token, grouped by prefix, rendered from the live theme. */
export function TokenTable(props: { group?: string; }) {

  // Re-read on theme change so that resolved values stay in sync.
  const { theme } = useTheme();

  const names = (Object.keys(lightTheme) as TokenName[])
    .filter((name) => !props.group || name.startsWith(props.group));

  const computed = typeof window !== 'undefined'
    ? window.getComputedStyle(document.documentElement)
    : null;

  const isColor = (name: TokenName) =>
    /^(surface|text|border$|border-|interactive|state|feedback)/.test(name);

  return (
    <table class={tableStyle} data-theme={theme}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Custom property</th>
          <th>Value</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {names.map((name) => {

          const value = computed?.getPropertyValue(tokenVarName(name)).trim() || lightTheme[name];

          return (
            <tr key={name}>
              <td><code>{name}</code></td>
              <td><code>{tokenVarName(name)}</code></td>
              <td><code>{value}</code></td>
              <td>
                {isColor(name)
                  ? <span class={swatchStyle} style={{ background: `var(${tokenVarName(name)})` }} />
                  : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
