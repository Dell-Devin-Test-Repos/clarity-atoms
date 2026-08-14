import { css, cx } from '@emotion/css';
import { useState } from 'preact/hooks';

import { SVGIcon } from '../icons/SVGIcon';

import { PaginationItem, usePagination } from './usePagination';


export interface PaginationLabels {
  root: string;
  pageSize: string;
  previous: string;
  next: string;
  page: string;
  currentPage: string;
  /** Summary of the visible range, e.g. `1 - 10 of 240 items`. */
  status: (from: number, to: number, total: number) => string;
}

export interface PaginationProps {
  class?: string;

  /** Current page, 1 based. */
  page: number;
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;

  onPageChange: (page: number) => void;

  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;

  siblingCount?: number;
  boundaryCount?: number;

  /** Hide the range summary shown before the page buttons. */
  hideStatus?: boolean;
  disabled?: boolean;

  labels?: Partial<PaginationLabels>;
}


const defaultLabels: PaginationLabels = {
  root: 'Pagination',
  pageSize: 'Rows per page',
  previous: 'Previous page',
  next: 'Next page',
  page: 'Page',
  currentPage: 'Current page',
  status: (from, to, total) => `${from} - ${to} of ${total}`
};


let pageSizeCounter = 0;


const rootStyle = css`
  display: flex;
  padding: 0.5rem 0;

  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  font-size: 0.875rem;
`;

const statusStyle = css`
  color: var(--ca-text-secondary);
`;

const sizeGroupStyle = css`
  display: inline-flex;

  align-items: center;
  gap: 0.5rem;

  select {
    padding: 0.25rem 0.5rem;

    background: transparent;
    border: 1px solid var(--ca-border);
    border-radius: 0.2rem;
    outline: none;

    color: inherit;
    font: inherit;
    cursor: pointer;

    &:focus {
      border-color: var(--ca-primary);
    }

    &:disabled {
      border-color: var(--ca-disabled-light);
      color: var(--ca-disabled);
      cursor: default;
    }
  }
`;

const listStyle = css`
  display: inline-flex;
  margin: 0;
  padding: 0;

  align-items: center;
  gap: 0.25rem;

  list-style: none;
`;

const pageButtonStyle = css`
  display: inline-flex;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;

  align-items: center;
  justify-content: center;

  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.2rem;
  outline: none;
  cursor: pointer;

  color: inherit;
  font: inherit;

  transition: all 120ms ease-out;

  &:hover:not(:disabled) {
    background: var(--ca-button-hover);
  }

  &:focus {
    border-color: var(--ca-primary);
  }

  &:disabled {
    color: var(--ca-disabled);
    cursor: default;
  }
`;

const currentPageStyle = css`
  background: var(--ca-primary);
  color: var(--ca-primary-comp);
  font-weight: 600;

  &:hover:not(:disabled) {
    background: var(--ca-primary-semilight);
  }
`;

const ellipsisStyle = css`
  display: inline-flex;
  min-width: 1.5rem;

  justify-content: center;

  color: var(--ca-text-secondary);
`;

const arrowStyle = css`
  width: 12px;
  height: 12px;

  fill: currentColor;
  transform: rotateZ(-90deg);
`;

const arrowNextStyle = css`
  transform: rotateZ(90deg);
`;


export function Pagination(props: PaginationProps) {

  const { total, pageSize, onPageChange, onPageSizeChange, pageSizeOptions, disabled = false } = props;

  const labels = { ...defaultLabels, ...props.labels };

  const [sizeId] = useState(() => `ca_pagination_size_${pageSizeCounter++}`);

  const state = usePagination({
    page: props.page,
    pageSize,
    total,
    siblingCount: props.siblingCount,
    boundaryCount: props.boundaryCount
  });

  const goTo = (page: number) => {
    if (!disabled && page !== state.page) {
      onPageChange(page);
    }
  };

  const onSizeChange = (e: Event) => {
    const value = Number((e.currentTarget as HTMLSelectElement).value);

    if (!Number.isNaN(value)) {
      onPageSizeChange?.(value);
    }
  };

  const renderItem = (item: PaginationItem, index: number) => {

    if (typeof item !== 'number') {
      return (
        <li key={`${item}-${index}`} aria-hidden='true' class={ellipsisStyle}>…</li>
      );
    }

    const isCurrent = item === state.page;

    return (
      <li key={item}>
        <button type='button' disabled={disabled}
          class={cx(pageButtonStyle, isCurrent && currentPageStyle)}
          aria-label={`${labels.page} ${item}`}
          aria-current={isCurrent ? 'page' : undefined}
          onClick={() => goTo(item)}>
          {item}
        </button>
      </li>
    );
  };

  return (
    <nav class={cx('ca-pagination', rootStyle, props.class)} aria-label={labels.root}>

      {(pageSizeOptions && pageSizeOptions.length > 0) && (
        <div class={sizeGroupStyle}>
          <label for={sizeId}>{labels.pageSize}</label>
          <select id={sizeId} value={String(pageSize)} disabled={disabled || !onPageSizeChange}
            onChange={onSizeChange}>
            {pageSizeOptions.map((size) => (
              <option key={size} value={String(size)}>{size}</option>
            ))}
          </select>
        </div>
      )}

      {!props.hideStatus && (
        <span class={statusStyle} aria-live='polite'>
          {labels.status(state.from, state.to, total)}
        </span>
      )}

      <ul class={listStyle}>
        <li>
          <button type='button' class={pageButtonStyle} aria-label={labels.previous}
            disabled={disabled || !state.hasPrevious} onClick={() => goTo(state.page - 1)}>
            <SVGIcon name='chevThick' class={arrowStyle} />
          </button>
        </li>
        {state.items.map(renderItem)}
        <li>
          <button type='button' class={pageButtonStyle} aria-label={labels.next}
            disabled={disabled || !state.hasNext} onClick={() => goTo(state.page + 1)}>
            <SVGIcon name='chevThick' class={cx(arrowStyle, arrowNextStyle)} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
