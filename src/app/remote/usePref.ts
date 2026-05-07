import { useMemo } from "react";
import { useScada } from "./ScadaProvider";

export function usePref<T>(key: string, fallback?: T): T | undefined {
  const { config } = useScada();
  return useMemo(() => {
    const v = (config.prefs ?? {})[key];
    return (v === undefined ? fallback : (v as T)) as T | undefined;
  }, [config.prefs, fallback, key]);
}

