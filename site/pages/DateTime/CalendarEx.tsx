import { css } from '@emotion/css';
import { Calendar } from 'clarity-atoms/DateTime/Calendar';


const rootStyle = css`
  display: flex;
  justify-content: center;
`;

const style = css`
  border: var(--ca-border-width) solid var(--ca-border-subtle);
`;

export default function CalendarEx() {

  return (
    <div class={rootStyle}>
      <Calendar class={style} />
    </div>
  );
}
