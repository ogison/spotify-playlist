"use client";

import { useState } from "react";
import { useSpotifyPlaylist } from "./hooks/useSpotifyPlaylist";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { PlaylistInput } from "./components/PlaylistInput";
import { CurrentTrack } from "./components/CurrentTrack";
import { PlayerControls } from "./components/PlayerControls";
import { ProgressBar } from "./components/ProgressBar";
import { PlaybackSettings } from "./components/PlaybackSettings";
import { TrackList } from "./components/TrackList";

export function PlaylistPlayer() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playbackDuration, setPlaybackDuration] = useState(30);

  const { playlist, loading, error } = useSpotifyPlaylist(playlistUrl);

  const tracks = playlist?.tracks.items.map((item) => item.track) || [];

  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    progress,
    currentTime,
    audioError,
    togglePlayPause,
    playNext,
    playPrevious,
    playTrackAtIndex,
    seek,
  } = useAudioPlayer(tracks, playbackDuration);

  const handlePlaylistSubmit = (url: string) => {
    setPlaylistUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-green-400 mb-3 animate-gradient">
              Spotify Playlist Player
            </h1>
            <p className="text-slate-400 text-lg">
              Experience your playlists in a whole new way
            </p>
          </div>
        </header>

        {/* Playlist Input */}
        <div className="mb-12 animate-slide-up">
          <PlaylistInput
            onSubmit={handlePlaylistSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {/* Main Player */}
        {playlist && tracks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left Column: Player */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Track Display */}
              {currentTrack && (
                <div className="animate-slide-up">
                  <CurrentTrack track={currentTrack} isPlaying={isPlaying} />
                </div>
              )}

              {/* Player Controls */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl animate-slide-up animation-delay-100">
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <ProgressBar
                    progress={progress}
                    currentTime={currentTime}
                    duration={playbackDuration}
                    onSeek={seek}
                  />

                  {/* Controls */}
                  <PlayerControls
                    isPlaying={isPlaying}
                    onPlayPause={togglePlayPause}
                    onNext={playNext}
                    onPrevious={playPrevious}
                    canGoNext={currentTrackIndex < tracks.length - 1}
                    canGoPrevious={currentTrackIndex > 0}
                  />

                  {/* Audio Error Display */}
                  {audioError && (
                    <div className="text-center">
                      <p className="text-sm text-yellow-400 bg-yellow-500/10 px-4 py-2 rounded-lg inline-block">
                        {audioError}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Playback Settings */}
              <div className="animate-slide-up animation-delay-200">
                <PlaybackSettings
                  duration={playbackDuration}
                  onDurationChange={setPlaybackDuration}
                />
              </div>
            </div>

            {/* Right Column: Track List */}
            <div className="lg:col-span-1 animate-slide-up animation-delay-300">
              <TrackList
                tracks={tracks}
                currentTrackIndex={currentTrackIndex}
                onTrackSelect={playTrackAtIndex}
              />
            </div>
          </div>
        )}

        {/* Playlist Info */}
        {playlist && (
          <div className="mt-8 text-center animate-fade-in animation-delay-400">
            <div className="inline-block bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl px-6 py-3">
              <p className="text-slate-300">
                <span className="font-semibold text-sky-400">
                  {playlist.name}
                </span>
                {playlist.description && (
                  <>
                    {" • "}
                    <span className="text-slate-400">
                      {playlist.description}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!playlist && !loading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block p-8 bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl">
              <svg
                className="w-24 h-24 text-slate-600 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <p className="text-xl text-slate-400">
                Enter a Spotify playlist URL to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
