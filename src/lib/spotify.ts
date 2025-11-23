import type {
  SpotifyAccessTokenResponse,
  SpotifyPlaylist,
} from "@/types/spotify";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get Spotify access token using Client Credentials Flow
 */
export async function getSpotifyAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are not configured");
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data: SpotifyAccessTokenResponse = await response.json();

  // Cache the token with expiration time (subtract 60 seconds for safety)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

/**
 * Extract playlist ID from Spotify URL
 * Supports formats:
 * - https://open.spotify.com/playlist/{id}
 * - https://open.spotify.com/playlist/{id}?si=...
 */
export function extractPlaylistId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const playlistIndex = pathParts.indexOf("playlist");

    if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
      return pathParts[playlistIndex + 1];
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate if a string is a valid Spotify playlist URL
 */
export function isValidSpotifyPlaylistUrl(url: string): boolean {
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/;
  return regex.test(url);
}

/**
 * Get playlist by ID from Spotify API
 */
export async function getPlaylistById(id: string): Promise<SpotifyPlaylist> {
  const token = await getSpotifyAccessToken();

  const response = await fetch(`${SPOTIFY_API_BASE_URL}/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Playlist not found");
    }
    throw new Error(`Failed to fetch playlist: ${response.statusText}`);
  }

  const data: SpotifyPlaylist = await response.json();
  return data;
}

/**
 * Format duration from milliseconds to MM:SS
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
