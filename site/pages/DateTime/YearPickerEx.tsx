import { css } from '@emotion/css';
import { useMemo, useState } from 'preact/hooks';

import { YearPicker } from 'clarity-atoms/DateTime/YearPicker';


const rootStyle = css`
  display: flex;
  justify-content: center;
`;

const style = css`
  border: var(--ca-border-width) solid var(--ca-border-subtle);
`;

const MAX_YEARS = 20;

// Minimum and maximum year that can be selected
const FLOOR = 2008;
const CEILING = 2053;


export default function YearPickerEx() {

  const current = useMemo(() => new Date(), []);

  const [year, setYear] = useState(() => current.getFullYear());

  const min = year - 10;
  const max = year + 9;

  const years = new Array(MAX_YEARS).fill(min)
    .map((x, i) => x + i)
    .filter((x) => x >= FLOOR && x <= CEILING);

  const onPrev = years[0] > FLOOR ? () => setYear(year - MAX_YEARS) : undefined;
  const onNext = years[years.length - 1] < CEILING ? () => setYear(year + MAX_YEARS) : undefined;

  return (
    <div class={rootStyle}>
      <YearPicker class={style}
        years={years} currentYear={year}
        onPrev={onPrev} onNext={onNext} />
    </div>
  );
}
