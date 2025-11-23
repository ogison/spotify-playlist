import { NextRequest, NextResponse } from "next/server";
import {
  extractPlaylistId,
  getPlaylistById,
  isValidSpotifyPlaylistUrl,
} from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 },
      );
    }

    // Validate URL format
    if (!isValidSpotifyPlaylistUrl(url)) {
      return NextResponse.json(
        { error: "Invalid Spotify playlist URL" },
        { status: 400 },
      );
    }

    // Extract playlist ID
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      return NextResponse.json(
        { error: "Could not extract playlist ID from URL" },
        { status: 400 },
      );
    }

    // Fetch playlist from Spotify
    const playlist = await getPlaylistById(playlistId);

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);

    if (error instanceof Error) {
      if (error.message === "Playlist not found") {
        return NextResponse.json(
          { error: "Playlist not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
