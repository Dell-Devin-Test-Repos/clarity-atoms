import { useEffect, useState } from 'preact/hooks';
import { from, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';


export interface AsyncOptionsState<T> {
  options: T[];
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptionsProps<T> {
  /** Resolves the options for a query. Rejections surface as the error state. */
  load: (query: string) => Promise<T[]>;

  /** Milliseconds to wait before a query is issued. */
  debounce?: number;
  /** Run `load('')` once on mount to prefill the list. */
  loadOnMount?: boolean;
}

export interface UseAsyncOptions<T> extends AsyncOptionsState<T> {
  query: string;
  setQuery: (query: string) => void;
  reload: () => void;
}


/**
 * Debounced option loading. Only the response of the latest query is applied,
 * so out of order responses cannot overwrite fresher results.
 */
export function useAsyncOptions<T>(props: UseAsyncOptionsProps<T>): UseAsyncOptions<T> {

  const { load, debounce = 250, loadOnMount = true } = props;

  const [query, setQuery] = useState('');
  const [state, setState] = useState<AsyncOptionsState<T>>({
    options: [],
    loading: loadOnMount,
    error: null
  });

  const [query$] = useState(() => new Subject<string>());

  useEffect(() => {

    const sub = query$.pipe(
      debounceTime(debounce),
      distinctUntilChanged(),
      tap(() => setState((x) => ({ ...x, loading: true, error: null }))),
      switchMap((q) => from(load(q)).pipe(
        map((options) => ({ options, loading: false, error: null })),
        catchError((error: Error) => of({ options: [], loading: false, error })))))
      .subscribe(setState);

    return () => sub.unsubscribe();
  }, [query$, load, debounce]);

  // Prefill the list so the first open is not empty.
  useEffect(() => {
    if (loadOnMount) {
      query$.next('');
    }
  }, [query$, loadOnMount]);

  const update = (next: string) => {
    setQuery(next);
    query$.next(next);
  };

  return {
    ...state,
    query,
    setQuery: update,
    reload: () => {
      setState((x) => ({ ...x, loading: true, error: null }));

      from(load(query)).pipe(
        map((options): AsyncOptionsState<T> => ({ options, loading: false, error: null })),
        catchError((error: Error) => of<AsyncOptionsState<T>>({ options: [], loading: false, error })))
        .subscribe(setState);
    }
  };
}
