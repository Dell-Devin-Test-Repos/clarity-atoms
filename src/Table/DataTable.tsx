import { cx } from '@emotion/css';
import { ComponentChildren } from 'preact';
import { useMemo } from 'preact/hooks';

import { Checkbox } from '../Checkbox';
import { SVGIcon } from '../icons/SVGIcon';

import {
  alignCenterStyle, alignRightStyle, busyStyle, containerStyle, messageCellStyle, rowStyle,
  selectCellStyle, sortButtonStyle, sortIconAscStyle, sortIconDescStyle, sortIconIdleStyle,
  sortIconStyle, sortOrderStyle, srOnlyStyle, stickyHeaderStyle, stripedStyle, tableStyle
} from './style';
import { RowKey, SelectionMode, useSelection } from './useSelection';
import { compareValues, SortState, SortValue, sortRows, useSort } from './useSort';
import { useVirtualRows } from './useVirtualRows';


export type ColumnAlign = 'left' | 'center' | 'right';

export interface DataTableColumn<T> {
  /** Stable identifier, also used as the sort key. */
  id: string;
  header: ComponentChildren;

  /** Plain value of the cell. Used for the default cell content and sorting. */
  value?: (row: T) => SortValue;
  /** Custom cell renderer. Takes precedence over `value` for display. */
  render?: (row: T, index: number) => ComponentChildren;

  sortable?: boolean;
  /** Custom comparator. Defaults to the natural ordering of `value`. */
  compare?: (a: T, b: T) => number;

  align?: ColumnAlign;
  width?: string;
  class?: string;
}

export interface DataTableLabels {
  selectAll: string;
  selectRow: string;
  sortAscending: string;
  sortDescending: string;
  loading: string;
  empty: string;
}

export interface DataTableProps<T> {
  class?: string;
  caption?: ComponentChildren;

  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => RowKey;

  /** Controlled sort state. Omit to let the table own it. */
  sort?: SortState[];
  defaultSort?: SortState[];
  /** Allow shift-click to sort by more than one column. */
  multiSort?: boolean;
  onSortChange?: (sort: SortState[]) => void;
  /** Set when `rows` already arrive sorted, e.g. sorted by a server. */
  manualSort?: boolean;

  selectionMode?: SelectionMode;
  /** Controlled selection, as row keys. Omit to let the table own it. */
  selected?: RowKey[];
  defaultSelected?: RowKey[];
  onSelectionChange?: (selected: RowKey[]) => void;
  isRowSelectable?: (row: T) => boolean;

  loading?: boolean;
  empty?: ComponentChildren;

  stickyHeader?: boolean;
  striped?: boolean;
  /** Height of the scroll container, required for a sticky header or virtual rows. */
  height?: string;

  /** Render only the rows within the viewport. Requires a fixed `rowHeight`. */
  virtualized?: boolean;
  rowHeight?: number;
  overscan?: number;

  onRowClick?: (row: T, index: number) => void;

  labels?: Partial<DataTableLabels>;
}


const defaultLabels: DataTableLabels = {
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  sortAscending: 'ascending',
  sortDescending: 'descending',
  loading: 'Loading…',
  empty: 'No data to display'
};

const alignStyle = (align: ColumnAlign | undefined) =>
  align === 'center' ? alignCenterStyle : (align === 'right' ? alignRightStyle : undefined);


function comparatorOf<T>(column: DataTableColumn<T> | undefined): ((a: T, b: T) => number) | undefined {

  if (!column || !column.sortable) {
    return undefined;
  }

  if (column.compare) {
    return column.compare;
  }

  const value = column.value;

  return value ? (a: T, b: T) => compareValues(value(a), value(b)) : undefined;
}


export function DataTable<T>(props: DataTableProps<T>) {

  const {
    columns, rows, rowKey, caption, onRowClick, isRowSelectable,
    selectionMode = 'none', manualSort = false, multiSort = false,
    loading = false, stickyHeader = false, striped = false,
    virtualized = false, rowHeight = 40, overscan = 8, height
  } = props;

  const labels = { ...defaultLabels, ...props.labels };

  const sorting = useSort({
    sort: props.sort,
    defaultSort: props.defaultSort,
    multiple: multiSort,
    onSortChange: props.onSortChange
  });

  const columnById = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = column;

      return acc;
    }, {} as { [id: string]: DataTableColumn<T>; });
  }, [columns]);

  const sorted = useMemo(() => manualSort
    ? rows
    : sortRows(rows, sorting.sort, (id) => comparatorOf(columnById[id])),
  [rows, sorting.sort, columnById, manualSort]);

  const keys = useMemo(() => sorted
    .map((row, index) => [row, rowKey(row, index)] as [T, RowKey])
    .filter(([row]) => !isRowSelectable || isRowSelectable(row))
    .map(([, key]) => key),
  [sorted, rowKey, isRowSelectable]);

  const selection = useSelection({
    mode: selectionMode,
    keys,
    selected: props.selected,
    defaultSelected: props.defaultSelected,
    onSelectionChange: props.onSelectionChange
  });

  const virtual = useVirtualRows({
    count: sorted.length,
    rowHeight,
    overscan,
    enabled: virtualized
  });

  const selectable = selectionMode !== 'none';
  const columnCount = columns.length + (selectable ? 1 : 0);

  const visibleRows = virtualized
    ? sorted.slice(virtual.start, virtual.end)
    : sorted;

  const showEmpty = !loading && sorted.length === 0;

  const onSort = (column: DataTableColumn<T>, additive: boolean) => {
    if (comparatorOf(column) || manualSort) {
      sorting.toggle(column.id, additive);
    }
  };

  return (
    <div class={cx('ca-data-table', containerStyle, props.class)}
      style={height ? { maxHeight: height } : undefined} {...virtual.scrollProps}>
      <table class={cx(tableStyle, stickyHeader && stickyHeaderStyle,
        striped && stripedStyle, loading && sorted.length > 0 && busyStyle)}
        aria-busy={loading ? 'true' : undefined}
        aria-rowcount={sorted.length}>

        {caption ? <caption>{caption}</caption> : null}

        <thead>
          <tr>
            {selectable && (
              <th scope='col' class={selectCellStyle}>
                {selectionMode === 'multi'
                  ? <Checkbox ariaLabel={labels.selectAll} checked={selection.allSelected}
                      indeterminate={selection.someSelected} onChange={(x) => selection.toggleAll(x)} />
                  : <span class={srOnlyStyle}>{labels.selectRow}</span>}
              </th>
            )}
            {columns.map((column) => {

              const direction = sorting.directionOf(column.id);
              const order = sorting.precedenceOf(column.id);
              const isSortable = column.sortable && (manualSort || !!comparatorOf(column));

              const ariaSort = direction
                ? (direction === 'asc' ? 'ascending' : 'descending')
                : (isSortable ? 'none' : undefined);

              return (
                <th key={column.id} scope='col' aria-sort={ariaSort}
                  class={cx(alignStyle(column.align), column.class)}
                  style={column.width ? { width: column.width } : undefined}>
                  {isSortable
                    ? (
                      <button type='button' class={sortButtonStyle}
                        onClick={(e: MouseEvent) => onSort(column, e.shiftKey)}>
                        {column.header}
                        <SVGIcon name='chevThick' class={cx(sortIconStyle,
                          !direction && sortIconIdleStyle,
                          direction === 'asc' && sortIconAscStyle,
                          direction === 'desc' && sortIconDescStyle)} />
                        {multiSort && order > 0
                          ? <span class={sortOrderStyle}>{order + 1}</span>
                          : null}
                        <span class={srOnlyStyle}>
                          {direction === 'asc' ? labels.sortAscending : ''}
                          {direction === 'desc' ? labels.sortDescending : ''}
                        </span>
                      </button>
                    )
                    : column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {virtual.paddingTop > 0 && (
            <tr aria-hidden='true' style={{ height: `${virtual.paddingTop}px` }}>
              <td colSpan={columnCount} />
            </tr>
          )}

          {loading && sorted.length === 0 && (
            <tr>
              <td class={messageCellStyle} colSpan={columnCount}>{labels.loading}</td>
            </tr>
          )}

          {showEmpty && (
            <tr>
              <td class={messageCellStyle} colSpan={columnCount}>{props.empty ?? labels.empty}</td>
            </tr>
          )}

          {visibleRows.map((row, index) => {

            const rowIndex = (virtualized ? virtual.start : 0) + index;
            const key = rowKey(row, rowIndex);
            const isSelected = selection.isSelected(key);
            const canSelect = selectable && (!isRowSelectable || isRowSelectable(row));

            return (
              <tr key={key} class={rowStyle} data-selected={isSelected ? 'true' : 'false'}
                aria-rowindex={rowIndex + 1}
                style={virtualized ? { height: `${rowHeight}px` } : undefined}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}>
                {selectable && (
                  <td class={selectCellStyle}>
                    {canSelect
                      ? <Checkbox ariaLabel={`${labels.selectRow} ${rowIndex + 1}`} checked={isSelected}
                          onChange={(x) => selection.toggle(key, x)} />
                      : null}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id} class={cx(alignStyle(column.align), column.class)}>
                    {column.render
                      ? column.render(row, rowIndex)
                      : String(column.value?.(row) ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}

          {virtual.paddingBottom > 0 && (
            <tr aria-hidden='true' style={{ height: `${virtual.paddingBottom}px` }}>
              <td colSpan={columnCount} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
