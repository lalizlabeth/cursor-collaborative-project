"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useDesktop } from "../contexts/DesktopContext";
import { AppId } from "../data/apps";

type Tab = "apps" | "store";

interface ContextMenu {
  appId: AppId;
  x: number;
  y: number;
}

export function AppsApp() {
  const [activeTab, setActiveTab] = useState<Tab>("apps");
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { allApps, installedAppIds, installApp, uninstallApp, openWindow } = useDesktop();

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    // Don't show context menu for the Apps app itself
    if (appId === "apps") return;
    setContextMenu({ appId, x: e.clientX, y: e.clientY });
  };

  const handleUninstall = () => {
    if (contextMenu) {
      uninstallApp(contextMenu.appId);
      setContextMenu(null);
    }
  };

  const installedApps = allApps.filter((app) => installedAppIds.includes(app.id));
  const availableApps = allApps.filter((app) => !installedAppIds.includes(app.id));

  const handleOpenApp = (appId: AppId) => {
    const app = allApps.find((a) => a.id === appId);
    if (app && openWindow) {
      openWindow({
        id: app.id,
        title: app.title,
        icon: app.icon,
        color: app.color,
        defaultPosition: app.defaultPosition,
        defaultSize: app.defaultSize,
        minSize: app.minSize,
      });
    }
  };

  const tabStyle = (isActive: boolean) => ({
    flex: 1,
    padding: "8px 12px",
    border: "none",
    background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    borderRadius: 6,
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "rgba(0,0,0,0.03)",
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <button style={tabStyle(activeTab === "apps")} onClick={() => setActiveTab("apps")}>
          <Icon icon="pixelarticons:device-laptop" width={14} height={14} />
          Apps
        </button>
        <button style={tabStyle(activeTab === "store")} onClick={() => setActiveTab("store")}>
          <Icon icon="pixelarticons:cart" width={14} height={14} />
          Store
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeTab === "apps" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 16,
              justifyItems: "center",
            }}
          >
            {installedApps.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
                <Icon icon="pixelarticons:folder" width={32} height={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>No apps installed</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>Visit the store to download apps</p>
              </div>
            ) : (
              installedApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleOpenApp(app.id)}
                  onContextMenu={(e) => handleContextMenu(e, app.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: 120,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: app.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={app.icon} width={26} height={26} style={{ color: "rgba(0, 0, 0, 0.5)" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{app.title}</div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {app.description}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 16,
              justifyItems: "center",
            }}
          >
            {availableApps.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
                <Icon icon="pixelarticons:check" width={32} height={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>All apps installed</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>You have all available apps</p>
              </div>
            ) : (
              availableApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => installApp(app.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: 120,
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: app.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <Icon icon={app.icon} width={26} height={26} style={{ color: "rgba(0, 0, 0, 0.5)" }} />
                    <div
                      style={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon icon="pixelarticons:download" width={10} height={10} style={{ color: "white" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 500, fontSize: 12 }}>{app.title}</div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {app.description}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            position: "fixed",
            left: contextMenu.x,
            top: contextMenu.y,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            border: "1px solid rgba(0,0,0,0.1)",
            padding: 4,
            zIndex: 1000,
            minWidth: 120,
          }}
        >
          <button
            onClick={handleUninstall}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "8px 12px",
              border: "none",
              background: "transparent",
              borderRadius: 6,
              fontFamily: "inherit",
              fontSize: 12,
              cursor: "pointer",
              color: "#dc3545",
              textAlign: "left",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220, 53, 69, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Icon icon="pixelarticons:trash" width={14} height={14} />
            Uninstall
          </button>
        </div>
      )}
    </div>
  );
}
