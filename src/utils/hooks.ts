import { computed } from "onek";
import { useEffect, useMemo, useRef } from "react";

export function useClickOutside(
  element: HTMLElement,
  handler,
  disabled = false
) {
  useEffect(() => {
    if (disabled) {
      return;
    }

    // Function to handle the click event
    const handleClickOutside = (event) => {
      if (!element.contains(event.target)) {
        handler(event);
      }
    };

    // Attach the click event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [element, handler, disabled]);
}

export function useComputed<T>(fn: () => T, equals: boolean, deps: readonly any[] = []) {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  return useMemo(() => {
      return computed(() => fnRef.current(), equals);
  }, deps);
}