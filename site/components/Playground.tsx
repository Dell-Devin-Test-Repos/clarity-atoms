import { css, cx } from '@emotion/css';
import { JSX } from 'preact';


export interface PlaygroundProps {

  // Component to render
  Component: () => JSX.Element;

  // Code snippet to render
  code?: string;
}

const rootStyle = css`
  border: var(--ca-border-width) solid var(--ca-border-subtle);
  padding: 1rem;

  background: var(--ca-surface);

  overflow-x: auto;
`;

export function Playground(props: PlaygroundProps) {

  const { Component } = props;

  return (
    <div class={cx('playground', rootStyle)}>
      <Component />
      {/* <CodeBlock class='language-ts'>{code}</CodeBlock> */}
    </div>
  );
}
