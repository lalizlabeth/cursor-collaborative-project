import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { DesktopProvider, useDesktop } from "../DesktopContext";
import { allApps, defaultInstalledAppIds } from "../../data/apps";
import type { ReactNode } from "react";

const STORAGE_KEY = "community-garden.installed-apps.v1";

const wrapper = ({ children }: { children: ReactNode }) => (
  <DesktopProvider allApps={allApps} defaultInstalledAppIds={defaultInstalledAppIds}>
    {children}
  </DesktopProvider>
);

beforeEach(() => {
  localStorage.clear();
});

describe("DesktopContext", () => {
  it("installs and uninstalls apps", () => {
    const { result } = renderHook(() => useDesktop(), { wrapper });

    act(() => {
      result.current.installApp("files");
    });

    expect(result.current.installedAppIds).toContain("files");

    act(() => {
      result.current.uninstallApp("notes");
    });

    expect(result.current.installedAppIds).not.toContain("notes");
  });

  it("prevents uninstalling the Apps app", () => {
    const { result } = renderHook(() => useDesktop(), { wrapper });

    act(() => {
      result.current.uninstallApp("apps");
    });

    expect(result.current.installedAppIds).toContain("apps");
  });

  it("hydrates installed apps from localStorage", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["apps", "files"]));

    const { result } = renderHook(() => useDesktop(), { wrapper });

    await waitFor(() => {
      expect(result.current.installedAppIds).toEqual(expect.arrayContaining(["apps", "files"]));
    });
  });

  it("persists installed apps to localStorage", async () => {
    const { result } = renderHook(() => useDesktop(), { wrapper });

    act(() => {
      result.current.installApp("files");
    });

    await waitFor(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toContain("files");
    });
  });
});
