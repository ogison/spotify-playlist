"use client";

interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

export function ProgressBar({
  progress,
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div
        className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-green-500/20 opacity-50"></div>

        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-green-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-transform"
            style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
          ></div>
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
