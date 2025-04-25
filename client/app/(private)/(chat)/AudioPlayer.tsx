import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import useEventListener from "@/app/hooks/dom/useEventListener";

// Component Props: Takes an audio source URL
interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  useEffect(() => {
    // Debug: Logs when the source changes
    console.log("AudioPlayer src:", src);
  }, [src]);

  // Refs for DOM elements
  const audioRef = useRef<HTMLAudioElement>(null); // Ref to the audio element
  const containerRef = useRef<HTMLDivElement>(null); // Ref to the container (not used directly here)

  // Player state
  const [isPlaying, setIsPlaying] = useState(false); // Whether audio is playing
  const [duration, setDuration] = useState(0); // Total audio duration in seconds
  const [currentTime, setCurrentTime] = useState(0); // Current playback time in seconds
  const [isLoaded, setIsLoaded] = useState(false); // Whether metadata (like duration) has loaded

  // Generate random heights for 40 waveform bars
  // These don't represent the actual audio waveform — it's a visual placeholder
  const waveformBars = Array.from(
    { length: 40 },
    () => Math.floor(Math.random() * 100) + 10 // Heights between 10% and 110%
  );

  /**
   * EVENT LISTENERS using `useEventListener` custom hook
   * These update the player state based on events triggered by the audio element.
   */

  // Fired when audio metadata (like duration) is loaded
  useEventListener(
    "loadedmetadata",
    () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
        setIsLoaded(true);
      }
    },
    audioRef.current as unknown as HTMLElement
  );

  // Fired whenever the audio playback time updates (e.g., while playing)
  useEventListener(
    "timeupdate",
    () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    },
    audioRef.current as unknown as HTMLElement
  );

  // Fired when audio ends
  useEventListener(
    "ended",
    () => {
      setIsPlaying(false);
      setCurrentTime(0); // Reset to beginning
    },
    audioRef.current as unknown as HTMLElement
  );

  /**
   * Fallback to manually attach event listeners in useEffect
   * This is useful if `useEventListener` doesn't reliably attach to `audioRef` (which may initially be null)
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Cleanup listeners on unmount
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  /**
   * Toggle audio playback state
   */
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /**
   * Format time in mm:ss format
   */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /**
   * Handle user clicking on the waveform to seek to a position
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect(); // Get the dimensions of the container
    const clickX = e.clientX - rect.left; // Get the click position relative to the container
    const width = rect.width; // Get the width of the container
    const duration = audioRef.current?.duration;

    if (!duration || isNaN(duration)) return;

    // Calculate clicked position as a percentage of total width
    const percent = clickX / width;
    const newTime = percent * duration;

    // Seek to the new time
    if (isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div
      className="bg-gray-100 rounded-lg p-4 w-full max-w-md"
      ref={containerRef}
    >
      <div className="flex items-center space-x-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          {/* Waveform Visualization */}
          <div
            className="relative h-12 w-full cursor-pointer"
            onClick={handleSeek}
          >
            <div className="absolute inset-0 flex items-center justify-between space-x-0.5">
              {waveformBars.map((height, index) => {
                // Calculate position of the bar as a percentage
                const barPosition = (index / waveformBars.length) * 100;
                const isPlayed = (barPosition / 100) * duration <= currentTime;

                return (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className={`w-1 rounded-full ${
                      isPlayed ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                );
              })}
            </div>

            {/* Current Time Progress Bar */}
            <div
              className="absolute bottom-0 left-0 h-1 bg-blue-600 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Timestamps */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <div>{formatTime(currentTime)}</div>
            <div>{isLoaded ? formatTime(duration) : "--:--"}</div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} />
    </div>
  );
};

export default AudioPlayer;
