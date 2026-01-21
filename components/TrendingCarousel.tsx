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
    if (searchQuery) return; 

    const loadTrending = async () => {
      try {
        const data = await fetchMovies("trending/movie/week");

        const filtered = data.filter((movie) => movie.id !== 7451);

        setMovies(filtered.slice(0, 10)); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, [searchQuery]);

  if (searchQuery || (loading && !movies.length)) return null;


  return (
    <section className="py-6 sm:py-8  px-3">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Trending Movies</h2>
      <div className="overflow-x-auto flex space-x-3 sm:space-x-4 py-4 scrollbar-hide flex-nowrap border-2 border-transparent">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
          : movies.map((movie, index) => (
              <div
                key={movie.id}
                className="shrink-0 w-36 sm:w-40 md:w-44 lg:w-48"
              >
                <MovieCard key={movie.id} movie={movie} rank={index + 1} />
              </div>
            ))}
      </div>
    </section>
  );
}
