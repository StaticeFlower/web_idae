"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";
import { errorMessage } from "@/lib/format";

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
}

/** โหลดข้อมูลแบบ async พร้อมป้องกัน race condition เมื่อ deps เปลี่ยนเร็ว ๆ */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (id === requestId.current) setData(result);
      })
      .catch((e) => {
        if (id === requestId.current) setError(errorMessage(e));
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, error, loading, reload };
}
