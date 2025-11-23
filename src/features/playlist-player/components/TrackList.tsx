"use client";

import type { SpotifyTrack } from "@/types/spotify";
import { formatDuration } from "@/lib/spotify";

interface TrackListProps {
  tracks: SpotifyTrack[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
}

export function TrackList({
  tracks,
  currentTrackIndex,
  onTrackSelect,
}: TrackListProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-sky-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
          </svg>
          Playlist Tracks
          <span className="ml-auto text-sm text-slate-400 font-normal">
            {tracks.length} tracks
          </span>
        </h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {tracks.map((track, index) => {
          const isCurrentTrack = index === currentTrackIndex;
          const albumImage =
            track.album.images[2]?.url || track.album.images[0]?.url;
          const hasPreview = !!track.preview_url;

          return (
            <button
              key={`${track.id}-${index}`}
              onClick={() => hasPreview && onTrackSelect(index)}
              disabled={!hasPreview}
              className={`
                w-full flex items-center gap-4 p-4 transition-all duration-300 border-b border-slate-800/50
                ${
                  isCurrentTrack
                    ? "bg-gradient-to-r from-sky-500/20 to-green-500/20 border-l-4 border-l-sky-500"
                    : hasPreview
                      ? "hover:bg-slate-800/30 cursor-pointer"
                      : "opacity-40 cursor-not-allowed"
                }
              `}
            >
              {/* Album art */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-lg overflow-hidden shadow-md ${isCurrentTrack ? "ring-2 ring-sky-400" : ""}`}
                >
                  {albumImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={albumImage}
                      alt={track.album.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${isCurrentTrack ? "scale-110" : "scale-100"}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Playing indicator */}
                {isCurrentTrack && (
                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg animate-pulse">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0 text-left">
                <p
                  className={`font-semibold text-sm truncate ${isCurrentTrack ? "text-sky-400" : "text-slate-200"}`}
                >
                  {track.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>

              {/* Duration and status */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!hasPreview && (
                  <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
                    No preview
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
