"use client";

import { Desktop } from "./components/Desktop";
import { allApps, defaultInstalledAppIds, windowContents } from "./data/apps";

// Only open the Apps window at startup
const initialWindows = [
  {
    id: "apps",
    title: "Apps",
    icon: "pixelarticons:device-laptop",
    defaultPosition: { x: 60, y: 60 },
    defaultSize: { width: 360, height: 400 },
    color: "var(--pastel-pink)",
    content: windowContents.apps,
  },
];

export default function Home() {
  return (
    <Desktop
      initialWindows={initialWindows}
      allApps={allApps}
      defaultInstalledAppIds={defaultInstalledAppIds}
      windowContents={windowContents}
    />
  );
}
