"use client";

import { useState } from "react";

type WaveformType = "sine" | "square" | "sawtooth" | "triangle";

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: string;
  min?: number;
  max?: number;
}

function Knob({ value, onChange, label, color, min = 0, max = 100 }: KnobProps) {
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startValue = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY;
      const newValue = Math.min(max, Math.max(min, startValue + delta * 0.5));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `linear-gradient(145deg, ${color}, ${color}dd)`,
          border: "3px solid rgba(0,0,0,0.1)",
          cursor: "grab",
          position: "relative",
          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Indicator line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 3,
            height: 18,
            background: "rgba(0,0,0,0.6)",
            borderRadius: 2,
            transformOrigin: "center bottom",
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  color: string;
}

function VerticalSlider({ value, onChange, label, color }: SliderProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const updateValue = (clientY: number) => {
      const percent = 1 - (clientY - rect.top) / rect.height;
      onChange(Math.min(100, Math.max(0, percent * 100)));
    };

    updateValue(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: 8,
          height: 60,
          background: "rgba(0,0,0,0.08)",
          borderRadius: 4,
          position: "relative",
          cursor: "pointer",
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${value}%`,
            background: color,
            borderRadius: 4,
          }}
        />
        {/* Handle */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: `${value}%`,
            transform: "translate(-50%, 50%)",
            width: 16,
            height: 8,
            background: "#fff",
            border: `2px solid ${color}`,
            borderRadius: 2,
          }}
        />
      </div>
      <span style={{ fontSize: 8, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
    </div>
  );
}

const waveforms: { type: WaveformType; symbol: string }[] = [
  { type: "sine", symbol: "~" },
  { type: "square", symbol: "⊓" },
  { type: "sawtooth", symbol: "/" },
  { type: "triangle", symbol: "△" },
];

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B", "C2"];
const blackKeys = [
  { note: "C#", position: 0 },  // Between C and D
  { note: "D#", position: 1 },  // Between D and E
  { note: "F#", position: 3 },  // Between F and G
  { note: "G#", position: 4 },  // Between G and A
  { note: "A#", position: 5 },  // Between A and B
];

export function SynthesizerApp() {
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [frequency, setFrequency] = useState(50);
  const [cutoff, setCutoff] = useState(75);
  const [resonance, setResonance] = useState(30);
  const [attack, setAttack] = useState(20);
  const [decay, setDecay] = useState(40);
  const [sustain, setSustain] = useState(70);
  const [release, setRelease] = useState(50);
  const [volume, setVolume] = useState(80);
  const [power, setPower] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <div
      style={{
        height: "100%",
        background: "#f5f5f5",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
          SYNTHESIZER
        </span>
        <button
          onClick={() => setPower(!power)}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: power ? "#4ade80" : "#666",
            border: "2px solid rgba(0,0,0,0.1)",
            cursor: "pointer",
            boxShadow: power ? "0 0 8px #4ade80" : "none",
          }}
        />
      </div>

      {/* Main controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: 12, opacity: power ? 1 : 0.4 }}>
        {/* Oscillator section */}
        <div
          style={{
            background: "rgba(255, 131, 230, 0.1)",
            borderRadius: 8,
            padding: 12,
            border: "1px solid rgba(255, 131, 230, 0.2)",
          }}
        >
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pastel-pink)", marginBottom: 10 }}>
            OSC
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {waveforms.map(({ type, symbol }) => (
              <button
                key={type}
                onClick={() => setWaveform(type)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  border: waveform === type ? "2px solid var(--pastel-pink)" : "1px solid rgba(0,0,0,0.1)",
                  background: waveform === type ? "var(--pastel-pink)" : "white",
                  color: waveform === type ? "white" : "var(--text-primary)",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
          <Knob value={frequency} onChange={setFrequency} label="FREQ" color="var(--pastel-pink)" />
        </div>

        {/* Filter section */}
        <div
          style={{
            background: "rgba(156, 239, 209, 0.15)",
            borderRadius: 8,
            padding: 12,
            border: "1px solid rgba(156, 239, 209, 0.3)",
          }}
        >
          <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "#2dd4a0", marginBottom: 10 }}>
            FILTER
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <Knob value={cutoff} onChange={setCutoff} label="CUTOFF" color="var(--pastel-mint)" />
            <Knob value={resonance} onChange={setResonance} label="RESO" color="var(--pastel-mint)" />
          </div>
        </div>

        {/* Envelope + Output section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Envelope */}
          <div
            style={{
              background: "rgba(181, 156, 255, 0.1)",
              borderRadius: 8,
              padding: 12,
              border: "1px solid rgba(181, 156, 255, 0.2)",
              flex: 1,
            }}
          >
            <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "var(--pastel-lavender)", marginBottom: 8 }}>
              ENVELOPE
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <VerticalSlider value={attack} onChange={setAttack} label="A" color="var(--pastel-lavender)" />
              <VerticalSlider value={decay} onChange={setDecay} label="D" color="var(--pastel-lavender)" />
              <VerticalSlider value={sustain} onChange={setSustain} label="S" color="var(--pastel-lavender)" />
              <VerticalSlider value={release} onChange={setRelease} label="R" color="var(--pastel-lavender)" />
            </div>
          </div>

          {/* Output */}
          <div
            style={{
              background: "rgba(238, 218, 106, 0.15)",
              borderRadius: 8,
              padding: 10,
              border: "1px solid rgba(238, 218, 106, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "#c9a800" }}>
              OUT
            </div>
            <Knob value={volume} onChange={setVolume} label="VOL" color="var(--pastel-yellow)" />
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div
        style={{
          background: "rgba(0,0,0,0.03)",
          borderRadius: 8,
          padding: 8,
          opacity: power ? 1 : 0.4,
        }}
      >
        <div style={{ display: "flex", position: "relative", height: 64 }}>
          {/* White keys */}
          {whiteKeys.map((key) => (
            <button
              key={key}
              onMouseDown={() => setActiveKey(key)}
              onMouseUp={() => setActiveKey(null)}
              onMouseLeave={() => activeKey === key && setActiveKey(null)}
              style={{
                flex: 1,
                height: "100%",
                background: activeKey === key ? "var(--pastel-sky)" : "white",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: "0 0 4px 4px",
                cursor: "pointer",
                marginRight: 1,
              }}
            />
          ))}
          {/* Black keys - positioned absolutely */}
          {blackKeys.map(({ note, position }) => (
            <button
              key={note}
              onMouseDown={() => setActiveKey(note)}
              onMouseUp={() => setActiveKey(null)}
              onMouseLeave={() => activeKey === note && setActiveKey(null)}
              style={{
                position: "absolute",
                left: `calc(${(position + 1) * (100 / 8)}% - 10px)`,
                top: 0,
                width: 20,
                height: 40,
                background: activeKey === note ? "var(--pastel-lavender)" : "#333",
                border: "none",
                borderRadius: "0 0 3px 3px",
                cursor: "pointer",
                zIndex: 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
