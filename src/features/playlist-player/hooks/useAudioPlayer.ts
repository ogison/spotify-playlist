import { useState, useEffect, useRef, useCallback } from "react";
import type { SpotifyTrack } from "@/types/spotify";

export function useAudioPlayer(
  tracks: SpotifyTrack[],
  playbackDuration: number = 30,
) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const currentTrack = tracks[currentTrackIndex] || null;

  // Define playNext first
  const playNext = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev >= tracks.length - 1) {
        // End of playlist
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [tracks.length]);

  const playPrevious = useCallback(() => {
    setCurrentTrackIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        const progressPercent = (audio.currentTime / playbackDuration) * 100;
        setProgress(Math.min(progressPercent, 100));

        // Auto-advance when playback duration is reached
        if (audio.currentTime >= playbackDuration) {
          playNext();
        }
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      setAudioError("Failed to load audio");
      // Skip to next track if current one fails
      setTimeout(() => {
        playNext();
      }, 500);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [playbackDuration, playNext]);

  // Load and play new track when index changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    const audio = audioRef.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAudioError(null);

    // Skip tracks without preview URL
    if (!currentTrack.preview_url) {
      setAudioError("No preview available");
      setTimeout(() => {
        playNext();
      }, 500);
      return;
    }

    audio.src = currentTrack.preview_url;
    setProgress(0);
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, currentTrack, isPlaying, playNext]);

  const play = useCallback(() => {
    if (!audioRef.current || !currentTrack?.preview_url) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Playback failed:", err);
        setAudioError("Playback failed");
      });
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const playTrackAtIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < tracks.length) {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    },
    [tracks.length],
  );

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = Math.min(time, playbackDuration);
    },
    [playbackDuration],
  );

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    progress,
    currentTime,
    audioError,
    play,
    pause,
    togglePlayPause,
    playNext,
    playPrevious,
    playTrackAtIndex,
    seek,
  };
}
