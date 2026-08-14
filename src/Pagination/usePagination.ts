export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

export interface UsePaginationProps {
  /** Current page, 1 based. */
  page: number;
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;

  /** Pages rendered on either side of the current page. */
  siblingCount?: number;
  /** Pages always rendered at the start and the end of the range. */
  boundaryCount?: number;
}

export interface UsePagination {
  page: number;
  pageCount: number;

  /** Index of the first item on the current page, 1 based. Zero when empty. */
  from: number;
  /** Index of the last item on the current page, 1 based. Zero when empty. */
  to: number;

  hasPrevious: boolean;
  hasNext: boolean;

  items: PaginationItem[];
}


const clamp = (x: number, min: number, max: number) => Math.min(Math.max(x, min), max);

const range = (start: number, end: number): number[] =>
  end < start ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);


/**
 * Page range calculation shared by `Pagination` and any custom pager. The
 * returned `items` collapse the hidden pages into ellipsis markers.
 */
export function usePagination(props: UsePaginationProps): UsePagination {

  const { pageSize, total, siblingCount = 1, boundaryCount = 1 } = props;

  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const page = clamp(Math.floor(props.page), 1, pageCount);

  const startPages = range(1, Math.min(boundaryCount, pageCount));
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount);

  const siblingStart = Math.max(
    Math.min(page - siblingCount, pageCount - boundaryCount - (siblingCount * 2) - 1),
    boundaryCount + 2);

  const siblingEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + (siblingCount * 2) + 2),
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1);

  const items: PaginationItem[] = [
    ...startPages,

    ...(siblingStart > boundaryCount + 2
      ? ['start-ellipsis' as const]
      : (boundaryCount + 1 < pageCount - boundaryCount ? [boundaryCount + 1] : [])),

    ...range(siblingStart, siblingEnd),

    ...(siblingEnd < pageCount - boundaryCount - 1
      ? ['end-ellipsis' as const]
      : (pageCount - boundaryCount > boundaryCount ? [pageCount - boundaryCount] : [])),

    ...endPages
  ];

  return {
    page,
    pageCount,
    from: total === 0 ? 0 : ((page - 1) * pageSize) + 1,
    to: total === 0 ? 0 : Math.min(total, page * pageSize),
    hasPrevious: page > 1,
    hasNext: page < pageCount,
    items
  };
}


/** Slice a client side dataset for the given page. */
export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {

  if (pageSize <= 0) {
    return rows;
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = clamp(Math.floor(page), 1, pageCount);
  const start = (current - 1) * pageSize;

  return rows.slice(start, start + pageSize);
}
