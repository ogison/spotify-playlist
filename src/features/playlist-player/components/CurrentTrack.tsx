"use client";

import type { SpotifyTrack } from "@/types/spotify";
import { formatDuration } from "@/lib/spotify";

interface CurrentTrackProps {
  track: SpotifyTrack;
  isPlaying: boolean;
}

export function CurrentTrack({ track, isPlaying }: CurrentTrackProps) {
  const albumImage = track.album.images[0]?.url || "/placeholder-album.png";

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-green-500/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        {/* Album Art Container */}
        <div className="relative mx-auto w-64 h-64 mb-6">
          {/* Vinyl record effect behind */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full ${isPlaying ? "animate-spin-slow" : ""}`}
          >
            <div className="absolute inset-4 bg-slate-950 rounded-full"></div>
            <div className="absolute inset-8 bg-slate-900 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800 rounded-full border-4 border-slate-700"></div>
          </div>

          {/* Album cover */}
          <div className="absolute inset-2 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-slate-700/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumImage}
              alt={track.album.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? "scale-105" : "scale-100"}`}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          </div>

          {/* Playing animation */}
          {isPlaying && (
            <div className="absolute -right-2 -top-2 bg-green-500 rounded-full p-3 shadow-lg shadow-green-500/50 animate-pulse">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 animate-fade-in line-clamp-2">
            {track.name}
          </h2>
          <p className="text-lg text-slate-400 animate-fade-in animation-delay-100">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className="text-sm text-slate-500 animate-fade-in animation-delay-200">
            {track.album.name} • {formatDuration(track.duration_ms)}
          </p>
        </div>

        {/* Audio visualizer bars */}
        {isPlaying && (
          <div className="flex justify-center items-end gap-1 h-12 mt-6">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-sky-500 to-green-400 rounded-full animate-audio-wave"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: "100%",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
