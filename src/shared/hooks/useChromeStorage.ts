import { useCallback, useEffect, useState } from "react";

export function useChromeStorage<T>(
  key: string,
  defaultValue: T,
  area: "sync" | "local" = "sync",
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storage = area === "sync" ? chrome.storage.sync : chrome.storage.local;

    storage.get(key).then((result) => {
      if (result[key] !== undefined) {
        setValue(result[key] as T);
      }
      setLoading(false);
    });

    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === area && changes[key]) {
        setValue(changes[key].newValue as T);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [key, area]);

  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        const storage =
          area === "sync" ? chrome.storage.sync : chrome.storage.local;
        storage.set({ [key]: resolved });
        return resolved;
      });
    },
    [key, area],
  );

  return [value, updateValue, loading];
}
