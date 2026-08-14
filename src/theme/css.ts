import { TokenName, TokenSet } from './tokens';


/** CSS custom property name for a token, e.g. `text-primary` -> `--ca-text-primary`. */
export function tokenVarName(token: TokenName): string {
  return `--ca-${token}`;
}

/** `var()` reference for a token, for use inside `css` template literals. */
export function token(name: TokenName): string {
  return `var(${tokenVarName(name)})`;
}


/**
 * Deprecated `--ca-*` names kept alive for consumers that styled against the
 * pre-token API. Each maps onto the token that replaces it. Names that a token
 * already owns (`--ca-border`) are intentionally absent - aliasing them would
 * make the declaration self-referential.
 */
export const legacyAliases: Record<string, TokenName> = {
  '--ca-primary': 'interactive',
  '--ca-primary-comp': 'text-on-interactive',
  '--ca-primary-semilight': 'interactive-hover',
  '--ca-primary-light': 'interactive-active',
  '--ca-border-secondary': 'border-subtle',
  '--ca-border-hover': 'border-strong',
  '--ca-disabled': 'state-disabled',
  '--ca-disabled-light': 'state-disabled-subtle',
  '--ca-button-hover': 'state-hover',
  '--ca-button-focus': 'state-focus'
};


/** Render a token set as CSS custom property declarations. */
export function tokensToDeclarations(tokens: TokenSet, indent = '  '): string {

  const names = Object.keys(tokens) as TokenName[];

  const declarations = names
    .map((name) => `${indent}${tokenVarName(name)}: ${tokens[name]};`);

  const aliases = Object.keys(legacyAliases)
    .map((alias) => `${indent}${alias}: ${token(legacyAliases[alias])};`);

  return [
    ...declarations,
    `${indent}/* Deprecated aliases - see setupTheme() */`,
    ...aliases
  ].join('\n');
}


/**
 * Render a token set as a CSS rule for the given selector. `extras` are plain
 * declarations emitted alongside the custom properties, e.g. `color-scheme`.
 */
export function tokensToRule(selector: string, tokens: TokenSet, extras: string[] = []): string {

  const body = [
    tokensToDeclarations(tokens),
    ...extras.map((x) => `  ${x};`)
  ].join('\n');

  return `${selector} {\n${body}\n}`;
}
