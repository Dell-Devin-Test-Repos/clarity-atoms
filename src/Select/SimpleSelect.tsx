import { css, cx } from '@emotion/css';
import { ComponentChildren } from 'preact';

import { Button } from '../Button';
import { SVGIcon } from '../icons/SVGIcon';
import { ListItem } from '../List/ListItem';
import { Surface } from '../surface/Surface';

import { useSelect } from './useSelect';

export interface SelectListItem {
  disabled?: boolean;
}


export interface SimpleSelectProps<T> {
  class?: string;
  placeholder: string;
  options: (T & SelectListItem)[];
  value?: T & SelectListItem;

  useMode?: boolean;

  onSearch?: (search: string) => void;
  onChange?: (value: T) => void;
  onClear?: () => void;

  render: (value: T) => ComponentChildren;
  renderAnchor: (value: T) => ComponentChildren;
}

const anchorStyle = css`
  display: inline-flex;
  padding: 0.5rem 0.75rem;

  justify-content: flex-start;
  align-items: center;

  line-height: var(--ca-line-height-tight);
  border: var(--ca-border-width) solid var(--ca-border);
  outline: none;

  background: var(--ca-surface);
  color: var(--ca-text-primary);

  cursor: pointer;

  &:hover {
    border-color: var(--ca-border-strong);
  }

  &.focused,
  &:focus {
    border-color: var(--ca-interactive);
  }
`;

const contentStyle = css`
  display: inline-flex;
  min-width: 0;
  margin-right: auto;

  align-items: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


const placeholderStyle = css`
  margin-right: auto;

  color: var(--ca-text-secondary);
`;

const closeButtonStyle = css`
  margin-left: 1rem;

  border: var(--ca-border-width) solid transparent;

  outline: none;

  &:focus {
    border-color: var(--ca-interactive);
  }
`;

const closeStyle = css`
  width: 1.125rem;
  height: 1.125rem;
  min-width: 1.125rem;

  fill: var(--ca-text-primary);
`;

const chevStyle = css`
  margin-left: 1rem;
  width: 14px;
  height: 14px;
  min-width: 14px;

  transform: rotateZ(180deg);

  fill: var(--ca-text-secondary);
`;



export function SimpleSelect<T>(props: SimpleSelectProps<T>) {

  const { options, value, placeholder, onChange, onClear, render, renderAnchor, useMode = true } = props;

  const dd = useSelect({
    options,
    value,
    onSelect: onChange
  });

  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onClear?.();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault();
      e.stopPropagation();

      onClear?.();
    }
  };

  const classes = cx('simple-select', anchorStyle, dd.isOpen && 'focused', props.class);

  return (
    <div {...dd.anchorProps} ref={dd.anchorProps.ref} tabIndex={0} class={classes}>
      {value
        ? <div class={contentStyle}>{renderAnchor(value)}</div>
        : <div class={placeholderStyle}>{placeholder}</div>}
      {(onClear && value) && (
        <Button variant={'minimal'} class={closeButtonStyle}
          onClick={onClose} onKeyDown={onKeydown}>
            <SVGIcon name='close' class={closeStyle} />
        </Button>
      )}
      <SVGIcon name='chevThick' class={chevStyle} />
      <Surface hook={dd}>
        {options.map((x, index) => (
          <ListItem mode={useMode ? 'single' : undefined} context={x} selected={x === value}
            disabled={x.disabled} focused={dd.highlighted === index}
            onSelect={dd.select}>
              {render(x)}
          </ListItem>
        ))}
      </Surface>
    </div>
  );
}
