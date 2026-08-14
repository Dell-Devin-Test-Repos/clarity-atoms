import { css, cx } from '@emotion/css';
import { ComponentChildren } from 'preact';

import { SVGIcon } from '../icons/SVGIcon';
import { ListItem } from '../List/ListItem';
import { ListValue } from '../List/useList';
import { Surface } from '../surface/Surface';

import { useCombobox } from './useCombobox';


export interface ComboboxLabels {
  loading: string;
  noResults: string;
  error: string;
  retry: string;
  remove: string;
  clear: string;
}

export interface ComboboxProps<T> {
  class?: string;

  /** Options to display. Already filtered when `onQueryChange` is handled by the consumer. */
  options: ListValue<T>[];

  /** Selected option, single select mode. */
  value?: ListValue<T> | null;
  /** Selected options, multi select mode. */
  values?: ListValue<T>[];
  multiple?: boolean;

  /** Current text in the input. */
  query: string;
  onQueryChange: (query: string) => void;

  onChange?: (value: ListValue<T> | null) => void;
  onValuesChange?: (values: ListValue<T>[]) => void;

  render: (option: ListValue<T>) => ComponentChildren;
  /** Text placed in the input for a selected option. Defaults to `render`. */
  display?: (option: ListValue<T>) => string;

  placeholder?: string;
  disabled?: boolean;

  loading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;

  labels?: Partial<ComboboxLabels>;

  /** Accessible name for the input, when there is no associated label element. */
  ariaLabel?: string;
  id?: string;
}


const defaultLabels: ComboboxLabels = {
  loading: 'Loading…',
  noResults: 'No results found',
  error: 'Could not load options',
  retry: 'Retry',
  remove: 'Remove',
  clear: 'Clear selection'
};


const rootStyle = css`
  display: flex;
  width: 100%;
  padding: 0.25rem 0.5rem;

  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;

  box-sizing: border-box;
  background: transparent;
  border: 1px solid var(--ca-border);
  outline: none;

  font-size: 0.875rem;
  cursor: text;

  &.focused,
  &:focus-within {
    border-color: var(--ca-primary);
  }

  &.disabled {
    border-color: var(--ca-disabled-light);
    color: var(--ca-disabled);
    cursor: default;
  }
`;

const inputStyle = css`
  flex: 1 1 6rem;
  min-width: 4rem;
  padding: 0.25rem 0;

  background: transparent;
  border: none;
  outline: none;

  color: inherit;
  font: inherit;

  &::placeholder {
    color: var(--ca-text-secondary);
  }
`;

const chipStyle = css`
  display: inline-flex;
  padding: 0.125rem 0.25rem 0.125rem 0.5rem;

  align-items: center;
  gap: 0.25rem;

  background: var(--ca-chip-background);
  border-radius: 0.75rem;

  color: var(--ca-chip-text);
  font-size: 0.8125rem;
  white-space: nowrap;
`;

const chipRemoveStyle = css`
  display: inline-flex;
  padding: 0;

  align-items: center;

  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  outline: none;
  cursor: pointer;

  color: inherit;

  &:focus {
    border-color: var(--ca-primary);
  }
`;

const chipIconStyle = css`
  width: 0.75rem;
  height: 0.75rem;

  fill: currentColor;
`;

const chevStyle = css`
  width: 12px;
  height: 12px;
  min-width: 12px;
  margin-left: auto;

  transform: rotateZ(180deg);

  fill: var(--ca-text-secondary);
`;

const surfaceStyle = css`
  max-height: 15rem;
`;

const messageStyle = css`
  padding: 0.5rem 1rem;

  color: var(--ca-text-secondary);
`;

const errorStyle = css`
  display: flex;
  padding: 0.5rem 1rem;

  align-items: center;
  gap: 0.5rem;

  color: var(--ca-error);
`;

const retryStyle = css`
  padding: 0;

  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  color: var(--ca-primary);
  font: inherit;
  text-decoration: underline;
`;


export function Combobox<T>(props: ComboboxProps<T>) {

  const { options, value, values = [], multiple = false, query, render, display,
    placeholder, disabled = false, loading = false, error = null,
    onQueryChange, onChange, onValuesChange, onRetry } = props;

  const labels = { ...defaultLabels, ...props.labels };

  const text = (option: ListValue<T>) => display
    ? display(option)
    : String(render(option) ?? '');

  const onSelect = (option: ListValue<T>) => {
    if (multiple) {
      onValuesChange?.(values.includes(option) ? values : [...values, option]);
    } else {
      onChange?.(option);
      onQueryChange(text(option));
    }
  };

  const onRemove = (option: ListValue<T>) => {
    if (multiple) {
      onValuesChange?.(values.filter((x) => x !== option));
    } else {
      onChange?.(null);
    }
  };

  const dd = useCombobox({
    options,
    value,
    values,
    multiple,
    query,
    disabled,
    onQueryChange,
    onSelect,
    onRemove
  });

  const isSelected = (option: ListValue<T>) => multiple
    ? values.includes(option)
    : option === value;

  const hasMessage = loading || !!error || options.length === 0;

  return (
    <div {...dd.anchorProps} ref={dd.anchorProps.ref}
      class={cx('ca-combobox', rootStyle, dd.isOpen && 'focused', disabled && 'disabled', props.class)}>

      {multiple && values.map((option, index) => (
        <span key={index} class={chipStyle}>
          {render(option)}
          <button type='button' class={chipRemoveStyle} disabled={disabled}
            aria-label={`${labels.remove} ${text(option)}`}
            onClick={() => onRemove(option)}>
            <SVGIcon name='close' class={chipIconStyle} />
          </button>
        </span>
      ))}

      <input {...dd.inputProps} id={props.id} class={inputStyle}
        placeholder={placeholder} aria-label={props.ariaLabel} />

      <SVGIcon name='chevThick' class={chevStyle} />

      <Surface hook={dd} class={surfaceStyle}>
        <div role='listbox' id={dd.listId} aria-label={props.ariaLabel}
          aria-busy={loading ? 'true' : undefined}>

          {loading && <div class={messageStyle}>{labels.loading}</div>}

          {(!loading && error) && (
            <div class={errorStyle}>
              <span>{typeof error === 'string' ? error : labels.error}</span>
              {onRetry
                ? <button type='button' class={retryStyle} onClick={onRetry}>{labels.retry}</button>
                : null}
            </div>
          )}

          {(!loading && !error && options.length === 0) && (
            <div class={messageStyle}>{labels.noResults}</div>
          )}

          {!hasMessage && options.map((option, index) => (
            <ListItem key={index} id={dd.optionId(index)} role='option'
              mode={multiple ? 'multiselect' : 'single'} context={option}
              selected={isSelected(option)} disabled={option.disabled}
              focused={index === dd.focusedIndex}
              onSelect={dd.select} onRemove={dd.remove}>
              {render(option)}
            </ListItem>
          ))}
        </div>
      </Surface>
    </div>
  );
}
