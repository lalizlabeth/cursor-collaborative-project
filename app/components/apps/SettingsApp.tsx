import { Icon } from "@iconify/react";

const settings = [
  { icon: "pixelarticons:user", label: "Account", value: "user@example.com" },
  { icon: "pixelarticons:sun", label: "Appearance", value: "Light" },
  { icon: "pixelarticons:volume-3", label: "Sound", value: "On" },
  { icon: "pixelarticons:shield", label: "Privacy", value: "Manage" },
];

export function SettingsApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {settings.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 10,
            borderRadius: 8,
            background: "rgba(0,0,0,0.02)",
            cursor: "pointer",
          }}
        >
          <Icon icon={item.icon} width={20} height={20} />
          <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.value}</span>
          <Icon icon="pixelarticons:chevron-right" width={16} height={16} style={{ opacity: 0.5 }} />
        </div>
      ))}
    </div>
  );
}
