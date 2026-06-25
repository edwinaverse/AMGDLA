"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { DashboardData } from "@/lib/types";
import { createDefaultData } from "@/lib/defaultData";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface DashboardContextValue {
  data: DashboardData;
  loading: boolean;
  saveStatus: SaveStatus;
  update: (updater: (draft: DashboardData) => DashboardData) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const AUTOSAVE_THROTTLE_MS = 1500;

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData>(createDefaultData());
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const dataRef = useRef(data);
  dataRef.current = data;
  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveAtRef = useRef(0);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((loaded: DashboardData) => setData(loaded))
      .catch((err) => console.error("Failed to load dashboard data", err))
      .finally(() => setLoading(false));
  }, []);

  const flush = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    lastSaveAtRef.current = Date.now();
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRef.current),
      });
      if (!res.ok) throw new Error("save failed");
      setSaveStatus("saved");
    } catch (err) {
      console.error("Autosave failed", err);
      setSaveStatus("error");
    }
  }, []);

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true;
    if (timerRef.current) return;
    const elapsed = Date.now() - lastSaveAtRef.current;
    const delay = Math.max(0, AUTOSAVE_THROTTLE_MS - elapsed);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      flush();
    }, delay);
  }, [flush]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", flush);
    };
  }, [flush]);

  const update = useCallback(
    (updater: (draft: DashboardData) => DashboardData) => {
      setData((prev) => updater(prev));
      scheduleSave();
    },
    [scheduleSave]
  );

  return (
    <DashboardContext.Provider value={{ data, loading, saveStatus, update }}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
