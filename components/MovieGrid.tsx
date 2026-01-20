'use client';

import { useState, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard';
import CategoryButtons from './CategoryButtons';
import SkeletonLoader from './SkeletonLoader';
import { fetchMovies, Movie, GENRE_MAP } from '../lib/utils';
import { useSearchParams } from 'next/navigation';

export default function MovieGrid() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const genre = searchParams.get('genre') || 'All Popular';
  const genreId = GENRE_MAP[genre];

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // How many pages to load per "Load More" click (40 movies = 2 pages × 20)
  const PAGES_PER_LOAD = 1;
  const MOVIES_PER_LOAD = 20;

  const loadMovies = useCallback(async (reset = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      let loaded = 0;
      let newMovies: Movie[] = [];

      for (let i = 0; i < PAGES_PER_LOAD; i++) {
        const currentPage = reset ? 1 : page + i;

        let endpoint = searchQuery ? 'search/movie' : 'discover/movie';
        let params: Record<string, string> = { page: currentPage.toString() };

        if (searchQuery) params.query = searchQuery;
        if (genreId && genreId !== 0) params.with_genres = genreId.toString();

        const data = await fetchMovies(endpoint, params);

        if (data.length === 0) {
          setHasMore(false);
          break;
        }

        newMovies = [...newMovies, ...data];
        loaded += data.length;
      }

      setMovies((prev) => (reset ? newMovies : [...prev, ...newMovies]));

      setPage((prev) => (reset ? PAGES_PER_LOAD + 1 : prev + PAGES_PER_LOAD));

      if (loaded < MOVIES_PER_LOAD) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, genreId, loading, hasMore]);

  // Reset when search or genre changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    loadMovies(true);
  }, [searchQuery, genre]);

  const handleLoadMore = () => {
    loadMovies();
  };

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold  px-4">
        {searchQuery
          ? "Search Results"
          : genre === "All Popular"
            ? "Popular Movies"
            : `${genre} Movies`}
      </h2>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {/* <CategoryButtons /> */}
      {!searchQuery && <CategoryButtons />}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Loading skeletons during fetch */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-4 mt-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && movies.length > 0 && (
        <div className="text-center mt-12 mb-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More Movies"}
          </button>
        </div>
      )}

      {/* No more results */}
      {!hasMore && movies.length > 0 && !loading && (
        <p className="text-center text-gray-400 py-12">
          You've reached the end — no more movies to load.
        </p>
      )}

      {/* No results at all */}
      {!loading && movies.length === 0 && !error && (
        <p className="text-center text-gray-400 py-20 text-xl">
          No movies found for this category/search.
        </p>
      )}
    </section>
  );
}