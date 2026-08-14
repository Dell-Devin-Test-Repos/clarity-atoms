import { css, cx } from '@emotion/css';
import { ComponentChildren } from 'preact';
import { Link } from 'preact-router/match';


export interface AppNavProps {
  class?: string;
}


const rootStyle = css`
  background-color: var(--ca-surface-sunken);

  z-index: 1;
`;

const listStyle = css`
  display: flex;
  margin: 2rem 0 0;
  padding: 0 0 2rem;

  flex-direction: column;

  list-style: none;
`;


export function AppNav(props: AppNavProps) {

  return (
    <nav class={cx(rootStyle, props.class)}>
      <ul class={listStyle}>
        <NavItem href='/button'>Button</NavItem>
        <NavItem href='/calendar'>Calendar</NavItem>
        <NavItem href='/checkbox'>Checkbox</NavItem>
        <NavItem href='/datepicker'>Date Picker</NavItem>
        <NavItem href='/dialog'>Dialog</NavItem>
        <NavItem href='/dropdown'>Dropdown</NavItem>
        <NavItem href='/radio'>Radio</NavItem>
        <NavItem href='/simple-select'>Simple Select</NavItem>
        <NavItem href='/tokens'>Design Tokens</NavItem>
      </ul>
    </nav>
  );
}


const listItemStyle = css`
  margin: 1.5rem 1rem 0;
  font-weight: 500;

  font-size: 0.875rem;
`;


const linkStyle = css`
  display: flex;

  padding: 0.6rem 0.75rem;
  text-decoration: none;

  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-bottom: var(--ca-border-width) solid var(--ca-border-subtle);

  transition: all var(--ca-duration-fast) var(--ca-easing-standard);

  color: var(--ca-text-primary);

  &:hover {
    background: var(--ca-state-hover);

    border-color: var(--ca-border);
    color: var(--ca-text-secondary);
  }
`;

const activeLinkStyle = css`
  color: var(--ca-interactive-text);

  border-color: var(--ca-interactive);
`;


function NavItem(props: { children: ComponentChildren; href: string; }) {
  return (
    <li class={listItemStyle}>
      <Link activeClassName={activeLinkStyle} class={linkStyle} href={props.href}>
        {props.children}
      </Link>
    </li>
  );
}
