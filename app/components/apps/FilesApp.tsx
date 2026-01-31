import { Icon } from "@iconify/react";

const items = [
  { icon: "pixelarticons:folder", name: "Documents" },
  { icon: "pixelarticons:folder", name: "Pictures" },
  { icon: "pixelarticons:folder", name: "Music" },
  { icon: "pixelarticons:file", name: "readme.txt" },
  { icon: "pixelarticons:image", name: "photo.jpg" },
  { icon: "pixelarticons:code", name: "script.js" },
];

export function FilesApp() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 16 }}>
      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 8,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          <Icon icon={item.icon} width={32} height={32} />
          <span style={{ fontSize: 11, textAlign: "center", wordBreak: "break-word" }}>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
