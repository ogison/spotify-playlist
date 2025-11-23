import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";

export async function GET() {
  try {
    const token = await getSpotifyAccessToken();
    return NextResponse.json({ access_token: token });
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 },
    );
  }
}
