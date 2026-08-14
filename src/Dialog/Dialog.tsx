import { cx, css } from '@emotion/css';
import { ComponentChildren } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { noop } from 'rxjs';

import { Button } from '../Button';
import { SVGIcon } from '../icons/SVGIcon';
import { DialogContext } from '../helper/internal';
import { Layer } from '../surface/Layer';

import { useDialog, DialogStrategy } from './dialogHook';

export interface DialogProps {
  class?: string;
  children: ComponentChildren;

  open: boolean;
  strategy?: DialogStrategy;
  onEscape?: () => void;
}


const rootStyle = css`
  position: fixed;

  background: var(--ca-surface-raised);
  color: var(--ca-text-primary);
  box-shadow: var(--ca-elevation-2);
  outline: none;

  overflow: auto;
`;

const modalStyle = css`
  max-width: 90%;
  max-height: 90%;

  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

const sidebarRightStyle = css`
  height: 100%;

  left: 100%;
  top: 0%;
`;


export function Dialog(props: DialogProps) {

  const { children, open, onEscape } = props;

  const strategy = props.strategy ?? 'modal';

  const ref = useDialog(open, strategy);

  const classes = cx(
    'dialog',
    rootStyle,
    strategy === 'modal' && modalStyle,
    strategy === 'sidebar-right' && sidebarRightStyle,
    props.class
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onEscape]);

  return (
    <DialogContext.Provider value={{ onClose: onEscape || noop}}>
      <Layer attached={open} blocking={true} class={'dialog-surface'} backdrop='dark' onBackdropClick={onEscape}>
        <div ref={ref} class={cx('dialog', classes)} tabIndex={-1}>
          {children}
        </div>
      </Layer>
    </DialogContext.Provider>
  );
}

Dialog.Header = Header;
Dialog.Section = Section;


interface HeaderProps {
  children: ComponentChildren;
}

const headerStyle = css`
  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: var(--ca-space-5) var(--ca-space-5);
`;

const headingStyle = css`
  margin: 0;

  font-size: var(--ca-font-size-xl);
`;

const buttonStyle = css`
  .svg-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

function Header(props: HeaderProps) {

  const { children } = props;

  const { onClose } = useContext(DialogContext);

  return (
    <div class={headerStyle}>
      <h2 class={headingStyle}>{children}</h2>
      <Button class={buttonStyle} variant='minimal' onClick={onClose}>
        <SVGIcon name='close' />
      </Button>
    </div>
  );
}

interface SectionProps {
  class?: string;
  children: ComponentChildren;
}

const sectionStyle = css`
  padding: 0 var(--ca-space-5) var(--ca-space-4);
`;

function Section(props: SectionProps) {

  const { children } = props;

  return (
    <div class={cx(sectionStyle, props.class)}>
      {children}
    </div>
  );
}
