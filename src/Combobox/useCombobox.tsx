import { useEffect, useState } from 'preact/hooks';

import { useDropdownSurface } from '../Dropdown/useDropdownSurface';
import { ListValue, useList } from '../List/useList';
import { UseSurfaceHook } from '../surface/Surface';
import { makeKeyboardHandler, prevent } from '../util/keyboard';


export interface UseComboboxProps<T> {
  options: ListValue<T>[];

  /** Selected option in single select mode. */
  value?: ListValue<T> | null;
  /** Selected options in multi select mode. */
  values?: ListValue<T>[];
  multiple?: boolean;

  query: string;
  onQueryChange: (query: string) => void;

  onSelect?: (option: ListValue<T>) => void;
  onRemove?: (option: ListValue<T>) => void;

  disabled?: boolean;
}

export interface UseComboboxHook<T> extends UseSurfaceHook {
  /** Option highlighted by the keyboard, if any. */
  focused?: ListValue<T>;
  focusedIndex: number;

  listId: string;
  optionId: (index: number) => string;

  inputProps: {
    role: string;
    type: string;
    value: string;
    disabled?: boolean;
    autocomplete: string;
    'aria-expanded': string;
    'aria-controls': string;
    'aria-autocomplete': string;
    'aria-activedescendant'?: string;
    onInput: (e: Event) => void;
    onKeydown: (e: KeyboardEvent) => void;
    onClick: () => void;
  };

  select: (option: ListValue<T>) => void;
  remove: (option: ListValue<T>) => void;
}


let comboboxCounter = 0;


/**
 * Behaviour of an editable select. Built on the shared dropdown surface and
 * list navigation primitives, so positioning and roving stay consistent with
 * the other surface components.
 */
export function useCombobox<T>(props: UseComboboxProps<T>): UseComboboxHook<T> {

  const { options, value, values, query, multiple = false, disabled = false,
    onQueryChange, onSelect, onRemove } = props;

  const [id] = useState(() => `ca_combobox_${comboboxCounter++}`);

  const dds = useDropdownSurface({ followWidth: true });
  const list = useList({ options, value: multiple ? undefined : (value ?? undefined) });

  const listId = `${id}_list`;
  const optionId = (index: number) => `${id}_option_${index}`;

  // A new query always invalidates the highlighted option.
  useEffect(() => list.reset(), [query]);

  const open = () => {
    if (!disabled && !dds.isOpen) {
      dds.open();
    }
  };

  const select = (option: ListValue<T>) => {

    if (option.disabled) {
      return;
    }

    onSelect?.(option);

    if (multiple) {
      // Keep the surface open so more options can be picked.
      onQueryChange('');
      list.reset();
    } else {
      dds.close();
    }
  };

  const remove = (option: ListValue<T>) => onRemove?.(option);

  const onInput = (e: Event) => {
    open();
    onQueryChange((e.currentTarget as HTMLInputElement).value);
  };

  const onKeyboardSelect = (e: KeyboardEvent) => {
    if (dds.isOpen && list.focused) {
      e.preventDefault();
      select(list.focused);
    }
  };

  const onArrowDown = prevent(() => dds.isOpen ? list.setNext() : open());
  const onArrowUp = prevent(() => dds.isOpen ? list.setPrevious() : open());

  const onBackspace = () => {
    // Backspace on an empty query removes the last chip.
    if (multiple && query === '' && values && values.length > 0) {
      remove(values[values.length - 1]);
    }
  };

  const onKeydown = makeKeyboardHandler({
    ArrowDown: onArrowDown,
    ArrowUp: onArrowUp,
    Enter: onKeyboardSelect,
    Escape: prevent(dds.close),
    Tab: dds.close,
    Backspace: onBackspace
  });

  return {
    ...dds,
    open,
    select,
    remove,
    listId,
    optionId,
    focused: list.focused ?? undefined,
    focusedIndex: list.focusedIndex,
    inputProps: {
      role: 'combobox',
      type: 'text',
      value: query,
      disabled: disabled || undefined,
      autocomplete: 'off',
      'aria-expanded': dds.isOpen ? 'true' : 'false',
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': (dds.isOpen && list.focusedIndex >= 0)
        ? optionId(list.focusedIndex)
        : undefined,
      onInput,
      onKeydown,
      onClick: open
    }
  };
}
