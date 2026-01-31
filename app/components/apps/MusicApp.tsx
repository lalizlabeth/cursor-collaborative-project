import { Icon } from "@iconify/react";

export function MusicApp() {
  return (
    <div style={{ textAlign: "center", padding: 16 }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          background: "linear-gradient(135deg, var(--pastel-lavender), var(--pastel-pink))",
          margin: "0 auto 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon icon="pixelarticons:music" width={32} height={32} />
      </div>
      <p style={{ fontWeight: 500, fontSize: 13 }}>Chill vibes</p>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 12 }}>Lo-fi beats</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
        <Icon icon="pixelarticons:prev" width={20} height={20} style={{ cursor: "pointer" }} />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--pastel-lavender)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Icon icon="pixelarticons:play" width={20} height={20} />
        </div>
        <Icon icon="pixelarticons:next" width={20} height={20} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
}
