"use client";

import { ReactNode, useEffect, useMemo, useState, type CSSProperties } from "react";
import { Icon } from "@iconify/react";
import { useWindowManager, WindowConfig, MenuItem } from "../hooks/useWindowManager";
import { Window } from "./Window";
import { DesktopProvider } from "../contexts/DesktopContext";
import { AppDefinition, AppId } from "../data/apps";
import styles from "./Desktop.module.css";

interface WindowDefinition extends WindowConfig {
  content: ReactNode;
}

interface DesktopProps {
  initialWindows?: WindowDefinition[];
  allApps?: AppDefinition[];
  defaultInstalledAppIds?: AppId[];
  windowContents?: Partial<Record<AppId, ReactNode>>;
}

export function Desktop({
  initialWindows = [],
  allApps = [],
  defaultInstalledAppIds = [],
  windowContents = {},
}: DesktopProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuTime, setMenuTime] = useState("");
  const {
    windows,
    focusedWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    clearFocus,
    moveWindow,
    resizeWindow,
    getFocusedWindow,
  } = useWindowManager(initialWindows);

  // Store window content - merge initial windows with provided windowContents
  const windowContentMap = useMemo(() => {
    const map = new Map<string, ReactNode>(
      initialWindows.map((w) => [w.id, w.content])
    );
    Object.entries(windowContents).forEach(([id, content]) => {
      if (content && !map.has(id)) {
        map.set(id, content);
      }
    });
    return map;
  }, [initialWindows, windowContents]);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setMenuTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = window.setInterval(updateTime, 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    if (activeMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeMenu]);

  const visibleWindows = windows.filter((w) => !w.isMinimized);
  const focusedWindow = getFocusedWindow();

  // Default menu items for all apps
  const defaultMenuItems: MenuItem[] = [
    {
      label: "File",
      items: [
        { label: "New" },
        { label: "Open..." },
        { divider: true },
        { label: "Close", action: () => focusedWindowId && closeWindow(focusedWindowId) },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo" },
        { label: "Redo" },
        { divider: true },
        { label: "Cut" },
        { label: "Copy" },
        { label: "Paste" },
      ],
    },
    {
      label: "Window",
      items: [
        { label: "Minimize", action: () => focusedWindowId && minimizeWindow(focusedWindowId) },
        { label: "Zoom", action: () => focusedWindowId && maximizeWindow(focusedWindowId) },
      ],
    },
  ];

  const handleMenuClick = (menuLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleDesktopClick = () => {
    clearFocus();
    setActiveMenu(null);
  };

  return (
    <DesktopProvider
      allApps={allApps}
      defaultInstalledAppIds={defaultInstalledAppIds}
      openWindow={openWindow}
    >
      <div className={styles.desktop} onClick={handleDesktopClick}>
        {/* Menu bar */}
        <div className={styles.menuBar} onClick={(e) => e.stopPropagation()}>
          <div className={styles.menuLeft}>
            {/* Apple-style logo/icon */}
            <button className={styles.menuItem}>
              <Icon icon="pixelarticons:mood-happy" width={16} height={16} />
            </button>

            {/* App name */}
            {focusedWindow && (
              <>
                <span className={styles.appName}>{focusedWindow.title}</span>
                {/* Menu items */}
                {(focusedWindow.menuItems || defaultMenuItems).map((menu) => (
                  <div key={menu.label} className={styles.menuDropdown}>
                    <button
                      className={`${styles.menuItem} ${activeMenu === menu.label ? styles.menuItemActive : ""}`}
                      onClick={(e) => handleMenuClick(menu.label, e)}
                    >
                      {menu.label}
                    </button>
                    {activeMenu === menu.label && menu.items && (
                      <div className={styles.menuDropdownContent}>
                        {menu.items.map((item, index) =>
                          item.divider ? (
                            <div key={index} className={styles.menuDivider} />
                          ) : (
                            <button
                              key={item.label}
                              className={styles.menuDropdownItem}
                              onClick={() => {
                                item.action?.();
                                setActiveMenu(null);
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className={styles.menuRight}>
            <span className={styles.menuTime}>
              {menuTime}
            </span>
          </div>
        </div>

        {/* Windows container */}
        <div className={styles.windowsContainer}>
          {isMobile ? (
            // Mobile: stack windows vertically
            <div className={styles.mobileStack}>
              {visibleWindows.map((windowState) => (
                <Window
                  key={windowState.id}
                  id={windowState.id}
                  title={windowState.title}
                  color={windowState.color}
                  position={windowState.position}
                  size={windowState.size}
                  minSize={windowState.minSize}
                  zIndex={windowState.zIndex}
                  isMaximized={windowState.isMaximized}
                  onMove={(pos) => moveWindow(windowState.id, pos)}
                  onResize={(size) => resizeWindow(windowState.id, size)}
                  onClose={() => closeWindow(windowState.id)}
                  onMinimize={() => minimizeWindow(windowState.id)}
                  onMaximize={() => maximizeWindow(windowState.id)}
                  onFocus={() => focusWindow(windowState.id)}
                >
                  {windowContentMap.get(windowState.id)}
                </Window>
              ))}
            </div>
          ) : (
            // Desktop: absolute positioning
            visibleWindows.map((windowState) => (
              <Window
                key={windowState.id}
                id={windowState.id}
                title={windowState.title}
                color={windowState.color}
                position={windowState.position}
                size={windowState.size}
                minSize={windowState.minSize}
                zIndex={windowState.zIndex}
                isMaximized={windowState.isMaximized}
                onMove={(pos) => moveWindow(windowState.id, pos)}
                onResize={(size) => resizeWindow(windowState.id, size)}
                onClose={() => closeWindow(windowState.id)}
                onMinimize={() => minimizeWindow(windowState.id)}
                onMaximize={() => maximizeWindow(windowState.id)}
                onFocus={() => focusWindow(windowState.id)}
              >
                {windowContentMap.get(windowState.id)}
              </Window>
            ))
          )}
        </div>

        {/* Dock showing pinned and open apps */}
        <div className={styles.dock}>
          {/* Apps is always pinned to the dock */}
          {(() => {
            const appsApp = allApps.find((app) => app.id === "apps");
            const appsWindow = windows.find((w) => w.id === "apps");
            const isOpen = !!appsWindow;
            
            if (!appsApp) return null;
            
            return (
              <button
                key="apps"
                className={`${styles.dockItem} ${focusedWindowId === "apps" ? styles.dockItemActive : ""} ${appsWindow?.isMinimized ? styles.dockItemMinimized : ""}`}
                style={{ "--dock-item-color": appsApp.color } as CSSProperties}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpen) {
                    openWindow({
                      id: appsApp.id,
                      title: appsApp.title,
                      icon: appsApp.icon,
                      color: appsApp.color,
                      position: appsApp.defaultPosition,
                      size: appsApp.defaultSize,
                      minSize: appsApp.minSize,
                    });
                  } else if (appsWindow?.isMinimized) {
                    restoreWindow("apps");
                  } else {
                    focusWindow("apps");
                  }
                }}
                title={appsApp.title}
              >
                <Icon icon={appsApp.icon} width={24} height={24} />
                <span className={styles.dockItemTitle}>{appsApp.title}</span>
                {/* Active indicator dot - show when open */}
                {isOpen && <span className={styles.dockItemIndicator} />}
              </button>
            );
          })()}
          
          {/* Other open windows (excluding apps which is always shown) */}
          {windows
            .filter((w) => w.id !== "apps")
            .map((windowState) => (
              <button
                key={windowState.id}
                className={`${styles.dockItem} ${focusedWindowId === windowState.id ? styles.dockItemActive : ""} ${windowState.isMinimized ? styles.dockItemMinimized : ""}`}
                style={
                  windowState.color
                    ? ({ "--dock-item-color": windowState.color } as CSSProperties)
                    : undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (windowState.isMinimized) {
                    restoreWindow(windowState.id);
                  } else {
                    focusWindow(windowState.id);
                  }
                }}
                title={windowState.title}
              >
                <Icon icon={windowState.icon} width={24} height={24} />
                <span className={styles.dockItemTitle}>{windowState.title}</span>
                {/* Active indicator dot */}
                {focusedWindowId === windowState.id && (
                  <span className={styles.dockItemIndicator} />
                )}
              </button>
            ))}
        </div>
      </div>
    </DesktopProvider>
  );
}
