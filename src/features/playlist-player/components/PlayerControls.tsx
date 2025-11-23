"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="group relative p-4 rounded-full bg-slate-800/50 hover:bg-slate-700/50 disabled:bg-slate-900/50 border border-slate-700/50 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
        aria-label="Previous track"
      >
        <svg
          className="w-6 h-6 text-slate-300 group-hover:text-white group-disabled:text-slate-600 transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        className="relative group p-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isPlaying ? (
          <svg
            className="w-8 h-8 text-white relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-white relative z-10 ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="group relative p-4 rounded-full bg-slate-800/50 hover:bg-slate-700/50 disabled:bg-slate-900/50 border border-slate-700/50 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed"
        aria-label="Next track"
      >
        <svg
          className="w-6 h-6 text-slate-300 group-hover:text-white group-disabled:text-slate-600 transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z" />
        </svg>
      </button>
    </div>
  );
}
