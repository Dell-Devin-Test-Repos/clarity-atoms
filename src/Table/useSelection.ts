import { useState } from 'preact/hooks';


export type SelectionMode = 'none' | 'single' | 'multi';

export type RowKey = string | number;

export interface UseSelectionProps {
  mode?: SelectionMode;

  /** Controlled selection. When provided, the hook does not keep its own state. */
  selected?: RowKey[];
  defaultSelected?: RowKey[];

  /** Keys eligible for the "select all" toggle - usually the visible page. */
  keys: RowKey[];

  onSelectionChange?: (selected: RowKey[]) => void;
}

export interface UseSelection {
  selected: RowKey[];
  isSelected: (key: RowKey) => boolean;

  /** True when every eligible key is selected. */
  allSelected: boolean;
  /** True when some - but not all - eligible keys are selected. */
  someSelected: boolean;

  toggle: (key: RowKey, selected?: boolean) => void;
  toggleAll: (selected?: boolean) => void;
  clear: () => void;
}


export function useSelection(props: UseSelectionProps): UseSelection {

  const { mode = 'none', keys, onSelectionChange } = props;

  const [internal, setInternal] = useState<RowKey[]>(props.defaultSelected ?? []);

  const selected = props.selected ?? internal;

  const apply = (next: RowKey[]) => {
    if (!props.selected) {
      setInternal(next);
    }

    onSelectionChange?.(next);
  };

  const isSelected = (key: RowKey) => selected.includes(key);

  const selectedCount = keys.reduce<number>((acc, key) => acc + (isSelected(key) ? 1 : 0), 0);

  const toggle = (key: RowKey, next?: boolean) => {

    const shouldSelect = next ?? !isSelected(key);

    if (mode === 'none') {
      return;
    }

    if (mode === 'single') {
      apply(shouldSelect ? [key] : []);
    } else {
      apply(shouldSelect
        ? [...selected, key]
        : selected.filter((x) => x !== key));
    }
  };

  const toggleAll = (next?: boolean) => {

    if (mode !== 'multi') {
      return;
    }

    const shouldSelect = next ?? !(keys.length > 0 && selectedCount === keys.length);

    apply(shouldSelect
      // Preserve selections which are outside of the eligible keys (other pages).
      ? [...selected.filter((x) => !keys.includes(x)), ...keys]
      : selected.filter((x) => !keys.includes(x)));
  };

  return {
    selected,
    isSelected,
    allSelected: keys.length > 0 && selectedCount === keys.length,
    someSelected: selectedCount > 0 && selectedCount < keys.length,
    toggle,
    toggleAll,
    clear: () => apply([])
  };
}
