"use client";

interface PlaybackSettingsProps {
  duration: number;
  onDurationChange: (duration: number) => void;
}

const DURATION_OPTIONS = [
  { value: 10, label: "10s" },
  { value: 15, label: "15s" },
  { value: 20, label: "20s" },
  { value: 30, label: "30s" },
];

export function PlaybackSettings({
  duration,
  onDurationChange,
}: PlaybackSettingsProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-sky-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Playback Duration
      </h3>

      <div className="grid grid-cols-4 gap-2">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onDurationChange(option.value)}
            className={`
              px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95
              ${
                duration === option.value
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/50 ring-2 ring-sky-400/50"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/50"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
