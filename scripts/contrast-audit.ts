/**
 * Report WCAG contrast ratios for the token combinations that carry text or
 * convey state, in every theme. Run with `npx ts-node scripts/contrast-audit.ts`
 * (or the esbuild-register equivalent) after changing colour tokens.
 */
import { contrast } from '../src/theme/palette';
import { themes, ThemeName } from '../src/theme/themes';
import { TokenName } from '../src/theme/tokens';


interface Pair {
  label: string;
  fg: TokenName;
  bg: TokenName;
  /** Minimum AA ratio. 4.5 for body text, 3 for large text and UI boundaries. */
  min: number;
  /** WCAG exempts disabled/inactive controls and purely decorative colour. */
  exempt?: boolean;
  note?: string;
}

const pairs: Pair[] = [
  { label: 'text-primary on surface', fg: 'text-primary', bg: 'surface', min: 4.5 },
  { label: 'text-primary on surface-raised', fg: 'text-primary', bg: 'surface-raised', min: 4.5 },
  { label: 'text-primary on surface-sunken', fg: 'text-primary', bg: 'surface-sunken', min: 4.5 },
  { label: 'text-secondary on surface', fg: 'text-secondary', bg: 'surface', min: 4.5 },
  { label: 'text-on-interactive on interactive', fg: 'text-on-interactive', bg: 'interactive', min: 4.5 },
  { label: 'text-on-interactive on interactive-hover', fg: 'text-on-interactive', bg: 'interactive-hover', min: 4.5 },
  { label: 'text-on-interactive on interactive-active', fg: 'text-on-interactive', bg: 'interactive-active', min: 4.5 },
  { label: 'interactive-text on surface', fg: 'interactive-text', bg: 'surface', min: 4.5 },
  { label: 'interactive-text on interactive-subtle', fg: 'interactive-text', bg: 'interactive-subtle', min: 4.5 },
  { label: 'interactive-text on state-selected', fg: 'interactive-text', bg: 'state-selected', min: 4.5 },
  { label: 'text-primary on state-selected', fg: 'text-primary', bg: 'state-selected', min: 4.5 },
  {
    label: 'border on surface', fg: 'border', bg: 'surface', min: 3, exempt: true,
    note: 'decorative separator - `border-strong` / `interactive` carry state'
  },
  { label: 'border-strong on surface', fg: 'border-strong', bg: 'surface', min: 3 },
  { label: 'interactive on surface (control boundary)', fg: 'interactive', bg: 'surface', min: 3 },
  { label: 'state-focus-ring on surface', fg: 'state-focus-ring', bg: 'surface', min: 3 },
  { label: 'feedback-error on surface', fg: 'feedback-error', bg: 'surface', min: 3 },
  { label: 'feedback-warning on surface', fg: 'feedback-warning', bg: 'surface', min: 3 },
  { label: 'feedback-success on surface', fg: 'feedback-success', bg: 'surface', min: 3 },
  { label: 'feedback-info on surface', fg: 'feedback-info', bg: 'surface', min: 3 },
  { label: 'text-disabled on surface (exempt)', fg: 'text-disabled', bg: 'surface', min: 4.5, exempt: true },
  { label: 'state-disabled on surface (exempt)', fg: 'state-disabled', bg: 'surface', min: 3, exempt: true }
];


let failed = false;

for (const name of Object.keys(themes) as ThemeName[]) {

  const tokens = themes[name];

  console.log(`\n## ${name}\n`);
  console.log('| Pair | Ratio | Required | Result |');
  console.log('| --- | --- | --- | --- |');

  for (const pair of pairs) {

    const ratio = contrast(tokens[pair.fg], tokens[pair.bg]);
    const pass = ratio >= pair.min;

    if (!pass && !pair.exempt) {
      failed = true;
    }

    const result = pair.exempt
      ? `exempt${pair.note ? ` (${pair.note})` : ''}`
      : (pass ? 'AA' : 'FAIL');

    console.log(`| ${pair.label} | ${ratio.toFixed(2)}:1 | ${pair.min}:1 | ${result} |`);
  }
}

if (failed) {
  console.error('\nWCAG AA failures found.');
  process.exit(1);
}
