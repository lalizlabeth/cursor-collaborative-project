"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useDesktop } from "../contexts/DesktopContext";
import { AppId } from "../data/apps";

type Tab = "apps" | "store";

export function AppsApp() {
  const [activeTab, setActiveTab] = useState<Tab>("apps");
  const { allApps, installedAppIds, installApp, uninstallApp, openWindow } = useDesktop();

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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {installedApps.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
                <Icon icon="pixelarticons:folder" width={32} height={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>No apps installed</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>Visit the store to download apps</p>
              </div>
            ) : (
              installedApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: app.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={app.icon} width={22} height={22} style={{ color: "rgba(0, 0, 0, 0.5)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{app.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{app.description}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApp(app.id);
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        background: "rgba(0,0,0,0.06)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        fontFamily: "inherit",
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "opacity 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Open
                    </button>
                    {app.id !== "apps" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          uninstallApp(app.id);
                        }}
                        style={{
                          padding: "2px 4px",
                          background: "transparent",
                          border: "none",
                          fontFamily: "inherit",
                          fontSize: 10,
                          cursor: "pointer",
                          transition: "color 0.15s ease",
                          color: "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#dc3545";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                      >
                        Uninstall
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {availableApps.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "var(--text-secondary)" }}>
                <Icon icon="pixelarticons:check" width={32} height={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <p style={{ fontSize: 13 }}>All apps installed</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>You have all available apps</p>
              </div>
            ) : (
              availableApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: app.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={app.icon} width={22} height={22} style={{ color: "rgba(0, 0, 0, 0.5)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{app.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{app.description}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      installApp(app.id);
                    }}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.06)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      fontFamily: "inherit",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "opacity 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <Icon icon="pixelarticons:download" width={12} height={12} />
                    Install
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
