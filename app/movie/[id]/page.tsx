import Image from 'next/image';
import { fetchMovieDetails, fetchModernRecommendations, Movie } from '../../../lib/utils'; 
import MovieCard from '../../../components/MovieCard'; 
import Link from 'next/link';
import { ArrowLeft, Play, Info } from 'lucide-react';
import ClientBackButton from '../../../components/ClientBackButton';

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await the dynamic route params (required in Next.js 15+)
  const { id } = await params;

  // 2. Fetch the current movie details
  const movie = await fetchMovieDetails(Number(id));

  // 3. Get modern related movies (2010 and newer)
  const relatedMovies = await fetchModernRecommendations(movie, 2000, 12);

  // 4. Prepare backdrop and trailer
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '/placeholder.jpg';

  const trailer = movie.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero section with backdrop */}
      <section className="relative min-h-screen sm:h-screen bg-slate-950">
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover brightness-[0.35] scale-100 transition-all duration-2000"
          />

          {/* Layered Gradients for cinematic depth */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Back Button - Floating top-left */}
        <ClientBackButton />

        {/* Main Content - Bottom-aligned hero style */}
        <div className="relative z-10 min-h-[80vh] sm:min-h-[90vh] w-full sm:max-w-[60%] flex items-end pb-4 sm:pb-2 px-4 sm:px-6 ">
          <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Title - Massive & Dramatic */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl  font-black mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
              {movie.title}
            </h1>

            {/* Overview */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 line-clamp-3 sm:line-clamp-4 md:line-clamp-5 drop-shadow-md">
              {movie.overview || "No overview available for this movie."}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
              {movie.genres?.slice(0, 5).map((genre) => (
                <span
                  key={genre.id}
                  className="px-2 sm:px-4 py-1 sm:py-1.5 bg-red-600/70 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-red-500/30"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-lg font-bold">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg sm:text-2xl">★</span>
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span className="text-gray-300">•</span>
              {/* <span>{movie.runtime ?? "N/A"} min</span> */}
              {movie.runtime ? `${movie.runtime} min` : "N/A"}
            </div>

            {/* Action Buttons - Netflix-style */}
            <div className="flex flex-wrap gap-3 sm:gap-5">
              {trailerUrl ? (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 bg-white text-black px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-xl hover:bg-gray-200 transition shadow-2xl transform hover:scale-105"
                >
                  <Play size={24} className="sm:size-8" fill="black" />
                  <span className="hidden sm:inline">Play Trailer</span>
                  <span className="sm:hidden">Play</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 sm:gap-3 bg-gray-700 text-gray-400 px-4 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-xl cursor-not-allowed"
                >
                  <Play size={24} className="sm:size-8" />
                  <span className="hidden sm:inline">No Trailer</span>
                </button>
              )}

              <Link
                href="#more-details"
                className="flex items-center gap-2 sm:gap-3 bg-slate-800/70 backdrop-blur-md text-white px-4 sm:px-10 py-3 sm:py-5 rounded-lg font-bold text-sm sm:text-xl border border-white/20 hover:bg-slate-700/80 transition shadow-2xl hover:scale-105"
              >
                <Info size={24} className="sm:size-8" />
                <span className="hidden sm:inline">More Info</span>
                <span className="sm:hidden">Info</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-auto animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modern Related Movies */}
      <section className="py-6 sm:py-12 px-4 sm:px-6   bg-slate-950 ">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">
          Related Movies
        </h2>

        {relatedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
            {relatedMovies.map((related) => (
              <MovieCard key={related.id} movie={related} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-10">
            No recent related movies found.
          </p>
        )}
      </section>
    </main>
  );
}
