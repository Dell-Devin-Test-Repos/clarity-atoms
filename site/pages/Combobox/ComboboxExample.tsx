import { useMemo, useState } from 'preact/hooks';

import { Combobox } from '../../../src/Combobox/Combobox';


interface Region {
  id: string;
  name: string;
}

const regions: Region[] = [
  { id: 'amer', name: 'Americas' },
  { id: 'apj', name: 'Asia Pacific & Japan' },
  { id: 'emea', name: 'Europe, Middle East & Africa' },
  { id: 'in', name: 'India' },
  { id: 'latam', name: 'Latin America' }
];


export function ComboboxExample() {

  const [query, setQuery] = useState('');
  const [value, setValue] = useState<Region | null>(null);

  const options = useMemo(() => regions
    .filter((x) => x.name.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <Combobox options={options} value={value} query={query} ariaLabel='Region'
      placeholder='Search regions' render={(x) => x.name}
      onQueryChange={setQuery} onChange={setValue} />
  );
}
