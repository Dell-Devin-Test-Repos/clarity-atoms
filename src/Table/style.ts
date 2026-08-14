import { css } from '@emotion/css';


export const containerStyle = css`
  position: relative;
  width: 100%;

  overflow: auto;

  border: 1px solid var(--ca-border-secondary);
  box-sizing: border-box;
`;

export const tableStyle = css`
  width: 100%;
  border-collapse: collapse;

  font-size: 0.875rem;
  text-align: left;

  caption {
    padding: 0.5rem 0.75rem;

    color: var(--ca-text-secondary);
    text-align: left;
  }

  th,
  td {
    padding: 0.5rem 0.75rem;

    border-bottom: 1px solid var(--ca-border-secondary);
    box-sizing: border-box;
  }

  th {
    background: var(--ca-table-header);
    font-weight: 600;
    white-space: nowrap;
  }
`;

export const stickyHeaderStyle = css`
  thead th {
    position: sticky;
    top: 0;

    /* Keep the header above the scrolling body */
    z-index: 1;
  }
`;

export const rowStyle = css`
  transition: background-color 120ms ease-out;

  &:hover {
    background-color: var(--ca-table-row-hover);
  }

  &[data-selected='true'] {
    background-color: var(--ca-table-row-selected);
  }
`;

export const stripedStyle = css`
  tbody tr:nth-of-type(even) {
    background-color: var(--ca-table-stripe);
  }
`;

export const selectCellStyle = css`
  width: 1px;
  white-space: nowrap;
`;

export const sortButtonStyle = css`
  display: inline-flex;
  padding: 0;

  align-items: center;
  gap: 0.25rem;

  background: transparent;
  border: 1px solid transparent;
  outline: none;
  cursor: pointer;

  color: inherit;
  font: inherit;
  font-weight: 600;

  &:hover {
    color: var(--ca-primary);
  }

  &:focus-visible,
  &:focus {
    border-color: var(--ca-primary);
  }
`;

export const sortIconStyle = css`
  width: 10px;
  height: 10px;
  min-width: 10px;

  fill: var(--ca-text-secondary);
  transform: rotateZ(180deg);
  transition: transform 120ms ease-out;
`;

export const sortIconAscStyle = css`
  fill: var(--ca-primary);
  transform: rotateZ(0deg);
`;

export const sortIconDescStyle = css`
  fill: var(--ca-primary);
`;

export const sortIconIdleStyle = css`
  opacity: 0.4;
`;

export const sortOrderStyle = css`
  color: var(--ca-primary);
  font-size: 0.6875rem;
  font-weight: 600;
`;

export const messageCellStyle = css`
  padding: 2rem 0.75rem;

  color: var(--ca-text-secondary);
  text-align: center;
`;

export const alignCenterStyle = css`
  text-align: center;
`;

export const alignRightStyle = css`
  text-align: right;
`;

export const busyStyle = css`
  opacity: 0.6;
`;

export const srOnlyStyle = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;

  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
