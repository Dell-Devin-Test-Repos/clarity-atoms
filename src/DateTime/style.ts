import { css } from '@emotion/css';


export const focusStyle = css`
  border-color: var(--ca-interactive);
`;

export const borderStyle = css`
  border: var(--ca-border-width) solid transparent;
  transition: border-color var(--ca-duration-normal) var(--ca-easing-standard);

  &:hover {
    border-color: var(--ca-border-strong);
  }

  &:focus {
    ${focusStyle};
  }
`;

export const hoverStyle = css`
  border-color: var(--ca-border-strong);
`;

export const disabledStyle = css`
  cursor: default;

  color: var(--ca-text-disabled);
  border-color: transparent;

  &:focus {
    border-color: var(--ca-state-disabled);
  }
`;

export const selectedStyle = css`
  color: var(--ca-text-on-interactive);
  background-color: var(--ca-interactive);
`;

export const currentStyle = css`
  position: relative;

  color: var(--ca-interactive-text);
  font-weight: var(--ca-font-weight-medium);

  &::after {
    content: '';
    position: absolute;
    width: 1rem;
    height: 2px;
    bottom: 2px;

    left: 50%;
    transform: translateX(-50%);

    background: currentColor;
  }
`;
