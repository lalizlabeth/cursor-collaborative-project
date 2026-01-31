"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  gradient: string;
  icon: string;
  melody: number[]; // Array of frequencies for the melody
}

const FAKE_SONGS: Song[] = [
  {
    id: 1,
    title: "Neon dreams",
    artist: "Synthwave collective",
    album: "Digital horizon",
    duration: 243,
    gradient: "linear-gradient(135deg, var(--pastel-lavender), var(--pastel-pink))",
    icon: "pixelarticons:music",
    melody: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33], // C5-D5-E5-G5-A5-G5-E5-D5
  },
  {
    id: 2,
    title: "Moonlit cafe",
    artist: "Jazz kittens",
    album: "Late night sessions",
    duration: 198,
    gradient: "linear-gradient(135deg, var(--pastel-sky), var(--pastel-mint))",
    icon: "pixelarticons:music-album",
    melody: [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 392.00], // A4-B4-C5-D5-C5-B4-A4-G4
  },
  {
    id: 3,
    title: "Electric pulse",
    artist: "Circuit breakers",
    album: "Voltage",
    duration: 276,
    gradient: "linear-gradient(135deg, var(--pastel-peach), var(--pastel-yellow))",
    icon: "pixelarticons:zap",
    melody: [329.63, 349.23, 392.00, 440.00, 493.88, 440.00, 392.00, 349.23], // E4-F4-G4-A4-B4-A4-G4-F4
  },
  {
    id: 4,
    title: "Garden party",
    artist: "The botanists",
    album: "Green thumb",
    duration: 215,
    gradient: "linear-gradient(135deg, var(--pastel-mint), var(--pastel-yellow))",
    icon: "pixelarticons:plant",
    melody: [392.00, 440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00], // G4-A4-B4-C5-D5-C5-B4-A4
  },
  {
    id: 5,
    title: "Pixel rain",
    artist: "8-bit orchestra",
    album: "Retro futures",
    duration: 189,
    gradient: "linear-gradient(135deg, var(--pastel-sky), var(--pastel-lavender))",
    icon: "pixelarticons:cloud-rain",
    melody: [659.25, 587.33, 523.25, 493.88, 440.00, 493.88, 523.25, 587.33], // E5-D5-C5-B4-A4-B4-C5-D5
  },
  {
    id: 6,
    title: "Sunset boulevard",
    artist: "Coastal drive",
    album: "Highway tunes",
    duration: 234,
    gradient: "linear-gradient(135deg, var(--pastel-peach), var(--pastel-pink))",
    icon: "pixelarticons:sun",
    melody: [523.25, 493.88, 440.00, 392.00, 349.23, 392.00, 440.00, 493.88], // C5-B4-A4-G4-F4-G4-A4-B4
  },
  {
    id: 7,
    title: "Coffee break",
    artist: "Lo-fi beats cafe",
    album: "Study session vol. 3",
    duration: 167,
    gradient: "linear-gradient(135deg, var(--pastel-yellow), var(--pastel-peach))",
    icon: "pixelarticons:coffee",
    melody: [349.23, 392.00, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63], // F4-G4-A4-G4-F4-E4-D4-C4
  },
  {
    id: 8,
    title: "Stargazer",
    artist: "Cosmic explorers",
    album: "Beyond the milky way",
    duration: 312,
    gradient: "linear-gradient(135deg, var(--pastel-lavender), var(--pastel-sky))",
    icon: "pixelarticons:moon",
    melody: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63], // C4-E4-G4-C5-E5-C5-G4-E4
  },
  {
    id: 9,
    title: "City lights",
    artist: "Urban soundscape",
    album: "Metropolitan",
    duration: 201,
    gradient: "linear-gradient(135deg, var(--pastel-pink), var(--pastel-lavender))",
    icon: "pixelarticons:building",
    melody: [587.33, 659.25, 783.99, 880.00, 987.77, 880.00, 783.99, 659.25], // D5-E5-G5-A5-B5-A5-G5-E5
  },
  {
    id: 10,
    title: "Rainy day blues",
    artist: "The weather watchers",
    album: "Seasonal moods",
    duration: 256,
    gradient: "linear-gradient(135deg, var(--pastel-sky), var(--pastel-mint))",
    icon: "pixelarticons:cloud",
    melody: [293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66, 261.63], // D4-E4-F4-G4-F4-E4-D4-C4
  },
  {
    id: 11,
    title: "Arcade nights",
    artist: "Retro gamers",
    album: "High score",
    duration: 178,
    gradient: "linear-gradient(135deg, var(--pastel-pink), var(--pastel-yellow))",
    icon: "pixelarticons:mood-happy",
    melody: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 392.00], // C5-E5-G5-C6-G5-E5-C5-G4
  },
  {
    id: 12,
    title: "Meditation flow",
    artist: "Zen masters",
    album: "Inner peace",
    duration: 423,
    gradient: "linear-gradient(135deg, var(--pastel-mint), var(--pastel-sky))",
    icon: "pixelarticons:human-handsup",
    melody: [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66], // C4-D4-E4-F4-G4-F4-E4-D4
  },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicApp() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [volume, setVolume] = useState(75);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const melodyIndexRef = useRef(0);
  const melodyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSong = FAKE_SONGS[currentSongIndex];

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Play a single note
  const playNote = (frequency: number, duration: number = 0.4) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop previous oscillator
    if (currentOscillatorRef.current) {
      currentOscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNodeRef.current);
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);
    
    currentOscillatorRef.current = oscillator;
  };

  // Start playing melody
  const startPlayback = () => {
    if (!currentSong || !audioContextRef.current) return;
    
    melodyIndexRef.current = 0;
    
    // Play melody notes in sequence
    const playMelody = () => {
      if (!isPlaying) return;
      
      const note = currentSong.melody[melodyIndexRef.current];
      playNote(note);
      
      melodyIndexRef.current = (melodyIndexRef.current + 1) % currentSong.melody.length;
    };
    
    // Play immediately
    playMelody();
    
    // Continue playing every 500ms
    melodyIntervalRef.current = setInterval(playMelody, 500);
    
    // Update progress bar
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleSongEnd();
          return 0;
        }
        return prev + (100 / (currentSong.duration * 2)); // Update twice per second
      });
    }, 500);
  };

  // Stop playback
  const stopPlayback = () => {
    if (melodyIntervalRef.current) {
      clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (currentOscillatorRef.current) {
      currentOscillatorRef.current.stop();
      currentOscillatorRef.current = null;
    }
  };

  // Handle song end
  const handleSongEnd = () => {
    if (repeatMode === "one") {
      setProgress(0);
      melodyIndexRef.current = 0;
    } else if (repeatMode === "all" || currentSongIndex < FAKE_SONGS.length - 1) {
      handleNext();
    } else {
      stopPlayback();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  // Effect to handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
    
    return () => {
      stopPlayback();
    };
  }, [isPlaying, currentSongIndex]);

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
      setProgress(0);
      melodyIndexRef.current = 0;
    }
  };

  const handleNext = () => {
    if (repeatMode === "all" && currentSongIndex === FAKE_SONGS.length - 1) {
      setCurrentSongIndex(0);
    } else if (currentSongIndex < FAKE_SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
    setProgress(0);
    melodyIndexRef.current = 0;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSongSelect = (index: number) => {
    stopPlayback();
    setCurrentSongIndex(index);
    setProgress(0);
    melodyIndexRef.current = 0;
    setIsPlaying(true);
  };

  const handleRepeatToggle = () => {
    const modes: Array<"off" | "one" | "all"> = ["off", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const getRepeatIcon = () => {
    if (repeatMode === "one") return "pixelarticons:repeat-once";
    return "pixelarticons:sync";
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Now playing section */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--overlay-border)",
          background: "var(--glass-bg)",
        }}
      >
        {/* Album artwork */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "8px",
            background: currentSong.gradient,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Icon icon={currentSong.icon} width={48} height={48} />
        </div>

        {/* Song info */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <p style={{ fontWeight: 500, fontSize: "14px", marginBottom: "4px" }}>
            {currentSong.title}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {currentSong.artist}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              height: "4px",
              background: "var(--overlay-light)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "var(--pastel-lavender)",
                transition: "width 0.1s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "var(--text-secondary)",
            }}
          >
            <span>{formatTime(Math.floor((progress / 100) * currentSong.duration))}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Main playback controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentSongIndex === 0}
            style={{
              opacity: currentSongIndex === 0 ? 0.3 : 1,
              cursor: currentSongIndex === 0 ? "not-allowed" : "pointer",
              padding: "4px",
            }}
          >
            <Icon icon="pixelarticons:prev" width={20} height={20} />
          </button>
          <button
            onClick={handlePlayPause}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--pastel-lavender)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Icon
              icon={isPlaying ? "pixelarticons:pause" : "pixelarticons:play"}
              width={20}
              height={20}
            />
          </button>
          <button
            onClick={handleNext}
            disabled={currentSongIndex === FAKE_SONGS.length - 1}
            style={{
              opacity: currentSongIndex === FAKE_SONGS.length - 1 ? 0.3 : 1,
              cursor: currentSongIndex === FAKE_SONGS.length - 1 ? "not-allowed" : "pointer",
              padding: "4px",
            }}
          >
            <Icon icon="pixelarticons:next" width={20} height={20} />
          </button>
        </div>

        {/* Secondary controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            style={{
              padding: "4px",
              opacity: isShuffle ? 1 : 0.4,
              cursor: "pointer",
            }}
          >
            <Icon icon="pixelarticons:shuffle" width={16} height={16} />
          </button>
          <button
            onClick={handleRepeatToggle}
            style={{
              padding: "4px",
              opacity: repeatMode !== "off" ? 1 : 0.4,
              cursor: "pointer",
            }}
          >
            <Icon icon={getRepeatIcon()} width={16} height={16} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "8px",
            }}
          >
            <Icon icon="pixelarticons:audio" width={16} height={16} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{
                width: "80px",
                height: "4px",
                accentColor: "var(--pastel-lavender)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Playlist section */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "8px",
        }}
      >
        {FAKE_SONGS.map((song, index) => (
          <div
            key={song.id}
            onClick={() => handleSongSelect(index)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
              borderRadius: "4px",
              cursor: "pointer",
              background: index === currentSongIndex ? "var(--overlay-light)" : "transparent",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (index !== currentSongIndex) {
                e.currentTarget.style.background = "var(--overlay-light)";
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSongIndex) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {/* Mini album art */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                background: song.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon icon={song.icon} width={20} height={20} />
            </div>

            {/* Song info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: index === currentSongIndex ? 500 : 400,
                  marginBottom: "2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {song.title}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {song.artist}
              </p>
            </div>

            {/* Duration */}
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                flexShrink: 0,
              }}
            >
              {formatTime(song.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
