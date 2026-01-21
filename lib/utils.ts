export const TMDB_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
  runtime?: number;
  credits?: { cast: { name: string }[] };
  videos?: { results: { key: string; site: string; type: string }[] };
  similar?: { results: Movie[] };
}

export const GENRE_MAP: Record<string, number> = {
  "All Popular": 0, // No filter
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Horror: 27,
  Romance: 10749,
  Kids: 10751, // Family
};

export async function fetchMovies(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<Movie[]> {
  const url = new URL(`${TMDB_BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );

  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: TMDB_ACCESS_TOKEN,
    },
  });
  if (!res.ok) throw new Error("API fetch failed");
  const data = await res.json();
  return data.results || [];
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?append_to_response=credits,videos,similar`,
    {
      headers: {
        accept: "application/json",
        Authorization: TMDB_ACCESS_TOKEN,
      },
    },
  );
  if (!res.ok) throw new Error("Details fetch failed");
  return res.json();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}


export async function fetchModernRecommendations(
  movie: Movie,
  minYear: number = 2010,
  limit: number = 10,
): Promise<Movie[]> {
  const genreIds = movie.genres?.map((g) => g.id).join(",") || "";

  if (!genreIds) return [];

  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  const params: Record<string, string> = {
    with_genres: genreIds,
    "primary_release_date.gte": `${minYear}-01-01`,
    sort_by: "popularity.desc",
    "vote_average.gte": "6.0",
    "vote_count.gte": "100",
    page: "1",
  };

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );

  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: TMDB_ACCESS_TOKEN,
    },
  });

  if (!res.ok) {
    console.error("Recommendations fetch failed:", await res.text());
    return [];
  }

  const data = await res.json();
  return (data.results || []).slice(0, limit);
}
