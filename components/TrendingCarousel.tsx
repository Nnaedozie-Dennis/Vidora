"use client";

import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import SkeletonLoader from "./SkeletonLoader";
import { fetchMovies, Movie } from "../lib/utils";
import { useSearchParams } from "next/navigation";

export default function TrendingCarousel() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) return; // Hide if searching
    const loadTrending = async () => {
      try {
        const data = await fetchMovies("trending/movie/week");
        setMovies(data.slice(0, 6));
      } catch {}
      setLoading(false);
    };
    loadTrending();
  }, [searchQuery]);

  if (searchQuery || (loading && !movies.length)) return null;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 px-4">Top 10 Trending</h2>
      <div className="overflow-x-auto flex space-x-4 px-4 scrollbar-hide">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
          : movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} rank={index + 1} />
            ))}
      </div>
    </section>
  );
}
