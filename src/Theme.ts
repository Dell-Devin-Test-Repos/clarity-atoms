import { injectGlobal } from '@emotion/css';
import Color from 'color';


export interface Theme {
  primary: string;
  primaryComp: string;

  border: string;
  borderLight: string;

  disabled: string;
  disabledLight: string;

  /** Text colour of secondary content - captions, status text, placeholders. */
  textSecondary?: string;
  /** Colour used to report a failure, e.g. options which could not be loaded. */
  error?: string;
}

const defaultTextSecondary = '#666666';
const defaultError = '#CE1126';

export function setupTheme(theme: Theme) {

  const x = theme;

  const primary = Color(x.primary);
  const primarySemiLight = primary.lighten(0.1).rgb().string();
  const primaryLight = primary.lighten(0.2).rgb().string();

  const primaryHover = primary.alpha(0.08).string();
  const primaryFocus = primary.alpha(0.16).string();

  const borderLight = Color(x.borderLight);

  const textSecondary = x.textSecondary ?? defaultTextSecondary;
  const error = x.error ?? defaultError;

  injectGlobal`
    :root {
      --ca-primary: ${x.primary};
      --ca-primary-comp: ${x.primaryComp};
      --ca-primary-semilight: ${primarySemiLight};
      --ca-primary-light: ${primaryLight};

      --ca-border: ${x.border};
      --ca-border-secondary: ${x.borderLight};

      --ca-disabled: ${x.disabled};
      --ca-disabled-light: ${x.disabledLight};

      --ca-text-secondary: ${textSecondary};
      --ca-error: ${error};

      /* Specific styling for components */

      /* Styling for button components */
      --ca-button-hover: ${primaryHover};
      --ca-button-focus: ${primaryFocus};

      /* Styling for DatePicker */
      --ca-border-hover: ${Color(x.border).lighten(0.18).string()};

      /* Styling for DataTable */
      --ca-table-header: ${borderLight.lighten(0.1).string()};
      --ca-table-stripe: ${borderLight.lighten(0.13).string()};
      --ca-table-row-hover: ${primary.alpha(0.04).string()};
      --ca-table-row-selected: ${primary.alpha(0.1).string()};

      /* Styling for Combobox chips */
      --ca-chip-background: ${primary.alpha(0.12).string()};
      --ca-chip-text: ${x.primary};
    }
  `;

  return {

  };
}
