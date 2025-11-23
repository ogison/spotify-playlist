import { useState, useEffect } from "react";
import type { SpotifyPlaylist } from "@/types/spotify";

export function useSpotifyPlaylist(playlistUrl: string) {
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playlistUrl) {
      setPlaylist(null);
      setError(null);
      return;
    }

    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/spotify/playlist?url=${encodeURIComponent(playlistUrl)}`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch playlist");
        }

        const data = await response.json();
        setPlaylist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistUrl]);

  return { playlist, loading, error };
}
