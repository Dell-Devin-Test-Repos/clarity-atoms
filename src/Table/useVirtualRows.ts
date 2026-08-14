import { Ref } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';


export interface UseVirtualRowsProps {
  /** Total number of rows in the dataset. */
  count: number;
  /** Fixed height of a single row, in pixels. */
  rowHeight: number;
  /** Extra rows rendered above and below the viewport. */
  overscan?: number;

  enabled?: boolean;
}

export interface UseVirtualRows {
  /** Index of the first rendered row. */
  start: number;
  /** Index after the last rendered row. */
  end: number;

  /** Height of the spacer standing in for the rows above the window. */
  paddingTop: number;
  /** Height of the spacer standing in for the rows below the window. */
  paddingBottom: number;

  scrollProps: {
    ref: Ref<any>;
    onScroll: (e: Event) => void;
  };
}


/**
 * Windowing for a fixed row height list. The scroll container reports its own
 * size so the window adapts to the container instead of a hard-coded height.
 */
export function useVirtualRows(props: UseVirtualRowsProps): UseVirtualRows {

  const { count, rowHeight, overscan = 8, enabled = true } = props;

  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  // Keep the measured height in sync with the container.
  useLayoutEffect(() => {

    if (!enabled || !viewport) {
      return;
    }

    const measure = () => setHeight(viewport.clientHeight);

    measure();

    // ResizeObserver is not available in every runtime targeted by the library.
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);

    observer.observe(viewport);

    return () => observer.disconnect();
  }, [enabled, viewport]);

  const onScroll = (e: Event) => setScrollTop((e.currentTarget as HTMLElement).scrollTop);

  const scrollProps = {
    ref: setViewport,
    onScroll
  };

  if (!enabled || rowHeight <= 0) {
    return { start: 0, end: count, paddingTop: 0, paddingBottom: 0, scrollProps };
  }

  // Until the container is measured, render the overscan window so that the
  // first paint is never empty.
  const visible = height > 0 ? Math.ceil(height / rowHeight) : overscan;

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(count, start + visible + (2 * overscan));

  return {
    start,
    end,
    paddingTop: start * rowHeight,
    paddingBottom: Math.max(0, (count - end) * rowHeight),
    scrollProps
  };
}
