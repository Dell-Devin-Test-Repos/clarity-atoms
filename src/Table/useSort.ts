import { useState } from 'preact/hooks';


export type SortDirection = 'asc' | 'desc';

export interface SortState {
  id: string;
  direction: SortDirection;
}

export interface UseSortProps {
  /** Controlled sort state. When provided, the hook does not keep its own state. */
  sort?: SortState[];
  defaultSort?: SortState[];

  /** Allow more than one column to participate in the sort. */
  multiple?: boolean;

  onSortChange?: (sort: SortState[]) => void;
}

export interface UseSort {
  sort: SortState[];

  directionOf: (id: string) => SortDirection | undefined;
  precedenceOf: (id: string) => number;

  /**
   * Cycle a column between ascending, descending and unsorted.
   * When `additive` is set (and multiple sort is enabled), the column
   * joins the existing sort instead of replacing it.
   */
  toggle: (id: string, additive?: boolean) => void;
  clear: () => void;
}


const nextDirection = (current: SortDirection | undefined): SortDirection | undefined =>
  current === undefined ? 'asc' : (current === 'asc' ? 'desc' : undefined);


export function useSort(props: UseSortProps = {}): UseSort {

  const { multiple = false, onSortChange } = props;

  const [internal, setInternal] = useState<SortState[]>(props.defaultSort ?? []);

  const sort = props.sort ?? internal;

  const apply = (next: SortState[]) => {
    if (!props.sort) {
      setInternal(next);
    }

    onSortChange?.(next);
  };

  const directionOf = (id: string) => sort.find((x) => x.id === id)?.direction;
  const precedenceOf = (id: string) => sort.findIndex((x) => x.id === id);

  const toggle = (id: string, additive: boolean = false) => {

    const direction = nextDirection(directionOf(id));

    if (multiple && additive) {
      const without = sort.filter((x) => x.id !== id);

      apply(direction ? [...without, { id, direction }] : without);
    } else {
      apply(direction ? [{ id, direction }] : []);
    }
  };

  return {
    sort,
    directionOf,
    precedenceOf,
    toggle,
    clear: () => apply([])
  };
}


export type SortValue = string | number | boolean | Date | null | undefined;

/**
 * Natural ordering used when a column exposes a plain value. Empty values are
 * always pushed to the end, irrespective of the sort direction.
 */
export function compareValues(a: SortValue, b: SortValue): number {

  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';

  if (aEmpty || bEmpty) {
    return aEmpty && bEmpty ? 0 : (aEmpty ? 1 : -1);
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  return Number(a) < Number(b) ? -1 : (Number(a) > Number(b) ? 1 : 0);
}


/**
 * Stable, multi-column sort. `comparators` resolves a column id into a
 * comparator; columns without one are skipped.
 */
export function sortRows<T>(rows: T[], sort: SortState[],
  comparators: (id: string) => ((a: T, b: T) => number) | undefined): T[] {

  const active = sort
    .map((x) => ({ direction: x.direction, compare: comparators(x.id) }))
    .filter((x): x is { direction: SortDirection; compare: (a: T, b: T) => number; } => !!x.compare);

  if (active.length === 0) {
    return rows;
  }

  // Decorate with the original index to keep the sort stable across engines.
  return rows
    .map((row, index) => [row, index] as [T, number])
    .sort((a, b) => {
      for (const { compare, direction } of active) {
        const result = compare(a[0], b[0]);

        if (result !== 0) {
          return direction === 'asc' ? result : -result;
        }
      }

      return a[1] - b[1];
    })
    .map(([row]) => row);
}
