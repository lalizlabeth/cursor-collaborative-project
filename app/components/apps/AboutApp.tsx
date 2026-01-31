import { Icon } from "@iconify/react";

export function AboutApp() {
  return (
    <div style={{ textAlign: "center" }}>
      <Icon icon="pixelarticons:heart" width={48} height={48} style={{ marginBottom: 12, color: "var(--pastel-pink)" }} />
      <h3 style={{ marginBottom: 8 }}>Community garden</h3>
      <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        Version 1.0.0
      </p>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
        Built with Next.js & React
      </p>
    </div>
  );
}
