import { useCallback, useState } from 'preact/hooks';

import { Combobox } from '../../../src/Combobox/Combobox';
import { useAsyncOptions } from '../../../src/Combobox/useAsyncOptions';


interface User {
  id: number;
  name: string;
}

const directory: User[] = [
  'Aarav Mehta', 'Beatrix Lang', 'Chen Wei', 'Diana Prasad', 'Eero Virtanen',
  'Fatima Noor', 'Gustavo Silva', 'Hana Sato', 'Ivan Petrov', 'Julia Novak'
].map((name, index) => ({ id: index + 1, name }));


/** Stands in for a directory service - resolves after a short delay. */
function search(query: string): Promise<User[]> {

  const q = query.trim().toLowerCase();

  return new Promise((resolve) => setTimeout(() => resolve(
    directory.filter((x) => x.name.toLowerCase().includes(q))), 600));
}


export function AsyncComboboxExample() {

  const [values, setValues] = useState<User[]>([]);

  const load = useCallback(search, []);
  const { options, loading, error, query, setQuery, reload } = useAsyncOptions({ load, debounce: 300 });

  return (
    <Combobox multiple options={options} values={values} query={query}
      loading={loading} error={error} onRetry={reload}
      ariaLabel='Reviewers' placeholder='Search people'
      render={(x) => x.name}
      onQueryChange={setQuery} onValuesChange={setValues} />
  );
}
