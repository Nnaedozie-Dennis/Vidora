import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Missing endpoint parameter" },
      { status: 400 },
    );
  }

  if (!TMDB_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "TMDB token not configured" },
      { status: 500 },
    );
  }

  // Build the URL with all query parameters except 'endpoint'
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      params.append(key, value);
    }
  });

  const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(tmdbUrl, {
      headers: {
        accept: "application/json",
        Authorization: TMDB_ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMDB API error" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Add caching headers
    const responseWithCache = new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });

    return responseWithCache;
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
