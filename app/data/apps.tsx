"use client";

import { ReactNode } from "react";
import { AppsApp } from "../components/AppsApp";
import { AboutApp } from "../components/apps/AboutApp";
import { CalendarApp } from "../components/apps/CalendarApp";
import { CalculatorApp } from "../components/apps/CalculatorApp";
import { FilesApp } from "../components/apps/FilesApp";
import { MusicApp } from "../components/apps/MusicApp";
import { NotesApp } from "../components/apps/NotesApp";
import { SettingsApp } from "../components/apps/SettingsApp";
import { SynthesizerApp } from "../components/apps/SynthesizerApp";
import { WeatherApp } from "../components/apps/WeatherApp";

export type AppId =
  | "apps"
  | "notes"
  | "files"
  | "about"
  | "calculator"
  | "weather"
  | "calendar"
  | "music"
  | "settings"
  | "synthesizer";

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  color: string;
  description: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export const allApps: AppDefinition[] = [
  {
    id: "apps",
    title: "Apps",
    icon: "pixelarticons:device-laptop",
    color: "var(--pastel-pink)",
    description: "Manage your apps",
    defaultPosition: { x: 60, y: 60 },
    defaultSize: { width: 360, height: 400 },
  },
  {
    id: "notes",
    title: "Notes",
    icon: "pixelarticons:note",
    color: "var(--pastel-yellow)",
    description: "Write and save notes",
    defaultPosition: { x: 480, y: 100 },
    defaultSize: { width: 640, height: 480 },
  },
  {
    id: "files",
    title: "Files",
    icon: "pixelarticons:folder",
    color: "var(--pastel-mint)",
    description: "Browse your files",
    defaultPosition: { x: 120, y: 380 },
    defaultSize: { width: 360, height: 220 },
  },
  {
    id: "about",
    title: "About",
    icon: "pixelarticons:heart",
    color: "var(--pastel-lavender)",
    description: "About this system",
    defaultPosition: { x: 520, y: 380 },
    defaultSize: { width: 280, height: 200 },
  },
  // Store-only apps (not installed by default)
  {
    id: "calculator",
    title: "Calculator",
    icon: "pixelarticons:calculator",
    color: "var(--pastel-blue)",
    description: "Simple calculator",
    defaultPosition: { x: 200, y: 150 },
    defaultSize: { width: 240, height: 320 },
  },
  {
    id: "weather",
    title: "Weather",
    icon: "pixelarticons:cloud-sun",
    color: "var(--pastel-peach)",
    description: "Check the weather",
    defaultPosition: { x: 300, y: 200 },
    defaultSize: { width: 450, height: 600 },
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: "pixelarticons:calendar",
    color: "var(--pastel-mint)",
    description: "View your calendar",
    defaultPosition: { x: 400, y: 120 },
    defaultSize: { width: 320, height: 280 },
  },
  {
    id: "music",
    title: "Music",
    icon: "pixelarticons:music",
    color: "var(--pastel-lavender)",
    description: "Listen to music",
    defaultPosition: { x: 250, y: 180 },
    defaultSize: { width: 300, height: 200 },
  },
  {
    id: "settings",
    title: "Settings",
    icon: "pixelarticons:sliders",
    color: "var(--pastel-yellow)",
    description: "System preferences",
    defaultPosition: { x: 180, y: 140 },
    defaultSize: { width: 340, height: 280 },
  },
  {
    id: "synthesizer",
    title: "Synthesizer",
    icon: "pixelarticons:music",
    color: "var(--pastel-peach)",
    description: "Create sounds",
    defaultPosition: { x: 150, y: 100 },
    defaultSize: { width: 480, height: 400 },
  },
];

export const defaultInstalledAppIds: AppId[] = ["apps", "notes"];

export const windowContents: Record<AppId, ReactNode> = {
  apps: <AppsApp />,
  notes: <NotesApp />,
  files: <FilesApp />,
  about: <AboutApp />,
  calculator: <CalculatorApp />,
  weather: <WeatherApp />,
  calendar: <CalendarApp />,
  music: <MusicApp />,
  settings: <SettingsApp />,
  synthesizer: <SynthesizerApp />,
};
