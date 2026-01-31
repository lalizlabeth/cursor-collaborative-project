"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { WindowConfig } from "../hooks/useWindowManager";
import { AppDefinition, AppId } from "../data/apps";

interface DesktopContextValue {
  // App management
  allApps: AppDefinition[];
  installedAppIds: AppId[];
  installApp: (appId: AppId) => void;
  uninstallApp: (appId: AppId) => void;
  // Window management
  openWindow: ((config: WindowConfig) => void) | null;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

interface DesktopProviderProps {
  children: ReactNode;
  allApps: AppDefinition[];
  defaultInstalledAppIds: AppId[];
  openWindow?: (config: WindowConfig) => void;
}

const INSTALLED_APPS_STORAGE_KEY = "community-garden.installed-apps.v1";
const REQUIRED_APPS: AppId[] = ["apps"];

export function DesktopProvider({
  children,
  allApps,
  defaultInstalledAppIds,
  openWindow,
}: DesktopProviderProps) {
  const [installedAppIds, setInstalledAppIds] = useState<AppId[]>(defaultInstalledAppIds);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(INSTALLED_APPS_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      const validIds = parsed.filter((id): id is AppId => allApps.some((app) => app.id === id));
      const merged = Array.from(new Set([...REQUIRED_APPS, ...validIds]));
      setInstalledAppIds(merged);
    } catch {
      // Ignore storage errors and stick with defaults.
    }
  }, [allApps]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(INSTALLED_APPS_STORAGE_KEY, JSON.stringify(installedAppIds));
    } catch {
      // Ignore storage errors.
    }
  }, [installedAppIds]);

  const installApp = (appId: AppId) => {
    setInstalledAppIds((prev) => {
      if (prev.includes(appId)) return prev;
      return [...prev, appId];
    });
  };

  const uninstallApp = (appId: AppId) => {
    // Don't allow uninstalling the Apps app itself
    if (appId === "apps") return;
    setInstalledAppIds((prev) => prev.filter((id) => id !== appId));
  };

  return (
    <DesktopContext.Provider
      value={{
        allApps,
        installedAppIds,
        installApp,
        uninstallApp,
        openWindow: openWindow || null,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
}
