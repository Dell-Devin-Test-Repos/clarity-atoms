import { css, cx } from '@emotion/css';
import { Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import type { JSXInternal } from 'preact/src/jsx';

export type ButtonVariant = 'solid' | 'outline' | 'flat' | 'minimal';
export type ButtonType = 'button' | 'submit' | 'reset';


type BaseButtonProps = JSXInternal.HTMLAttributes<HTMLButtonElement>;

export interface ButtonProps extends BaseButtonProps {
  type?: ButtonType;
  variant?: ButtonVariant;
  compact?: boolean;
  ariaDisabled?: boolean;

  onClick?: (e: MouseEvent) => void;
  onClickDisabled?: (e: MouseEvent) => void;

  // Access native DOM Button element
  ref?: Ref<any>;
}


const base = css`
  display: inline-flex;
  padding: 0;

  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: transparent;
  color: var(--ca-interactive-text);

  font-family: inherit;
  font-size: inherit;
`;

export const minimal = css`
  ${base};

  color: inherit;
  outline: none;

  border: none;
`;

const standard = css`
  ${base};

  border-radius: var(--ca-radius-sm);
  padding: 0 var(--ca-space-4);

  /* Clarity standard button height */
  height: var(--ca-control-height);
  line-height: var(--ca-line-height-tight);

  border: none;
  outline: none;

  font-weight: var(--ca-font-weight-bold);
  white-space: nowrap;

  &[disabled] {
    color: var(--ca-text-disabled);
  }
`;

const flat = css`
  ${standard};

  background: transparent;

  transition: all var(--ca-duration-fast) var(--ca-easing-standard);

  &:hover {
    background: var(--ca-state-hover);
  }

  &:focus {
    background: var(--ca-state-focus);
  }

  &:focus-visible {
    outline: var(--ca-focus-ring-width) solid var(--ca-state-focus-ring);
    outline-offset: var(--ca-focus-ring-width);
  }

  &:active {
    background: var(--ca-state-active);
  }

  &:disabled {
    background-color: transparent;
  }
`;

const outline = css`
  ${standard};

  border: var(--ca-border-width) solid var(--ca-border);

  background: transparent;

  transition: all var(--ca-duration-fast) var(--ca-easing-standard);

  &:hover {
    background: var(--ca-state-hover);
    border-color: var(--ca-interactive);
  }

  &:focus {
    background: var(--ca-state-focus);
    border-color: var(--ca-interactive);
  }

  &:focus-visible {
    outline: var(--ca-focus-ring-width) solid var(--ca-state-focus-ring);
    outline-offset: var(--ca-focus-ring-width);
  }

  &:active {
    background: var(--ca-state-active);
    border-color: var(--ca-interactive-active);
  }

  &:disabled,
  &[aria-disabled='true'] {
    border-color: var(--ca-state-disabled);
    background-color: transparent;
  }
`;


// Backward compatibility with CSM buttons
const solid = css`
  ${standard};

  background-color: var(--ca-interactive);
  color: var(--ca-text-on-interactive);

  &:hover {
    background-color: var(--ca-interactive-hover);
  }

  &:focus {
    background-color: var(--ca-interactive-hover);
  }

  &:focus-visible {
    outline: var(--ca-focus-ring-width) solid var(--ca-state-focus-ring);
    outline-offset: var(--ca-focus-ring-width);
  }

  &:active {
    background-color: var(--ca-interactive-active);
  }

  &:disabled,
  &[aria-disabled='true'] {
    background-color: var(--ca-state-disabled-subtle);
    color: var(--ca-text-disabled);
  }
`;

const styles = { flat, outline, minimal, solid };

const compactStyle = css`
  /* Clarity compact button height */
  height: var(--ca-control-height-compact);
`;


export const Button = forwardRef(function Button(props: ButtonProps, ref: Ref<HTMLButtonElement>) {

  const { compact, title, children, onClick, onClickDisabled, ariaDisabled, disabled, type, variant } = props;

  const typeDef = type || 'button';
  const variantDef = variant || 'outline';

  const classes =  cx('ptr-button', styles[variantDef], compact && compactStyle, props.class);

  const propsCopy = { ...props };

  delete propsCopy.ariaDisabled;
  delete propsCopy.variant;

  const handler = (e: MouseEvent) => {
    if (ariaDisabled) {
      onClickDisabled?.(e);
    } else {
      onClick?.(e);
    }
  };

  return (
    <button {...propsCopy} type={typeDef} title={title} class={classes} ref={ref}
      aria-disabled={ariaDisabled} disabled={disabled}
      onClick={handler}>
        {children}
    </button>
  );
});
