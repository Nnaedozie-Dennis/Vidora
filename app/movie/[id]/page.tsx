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
    <main className=" min-h-screen">
      {/* Hero section with backdrop */}
      <section className="relative h-screen bg-slate-950">
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
        {/* <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group"
          aria-label="Go back"
        >
          <div className="p-3 rounded-full bg-black/10 backdrop-blur-md border border-white/10 group-hover:bg-black/80">
            <ArrowLeft size={28} />
          </div>
        </Link> */}
        <ClientBackButton />

        {/* Main Content - Bottom-aligned hero style */}
        <div className="relative z-10 min-h-[90vh] max-w-[60%] flex items-end pb-2 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Title - Massive & Dramatic */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-2xl">
              {movie.title}
            </h1>

            {/* Overview */}
            <p className="text-lg md:text-xl text-gray-200 mb-10 line-clamp-4 md:line-clamp-5 drop-shadow-md">
              {movie.overview || "No overview available for this movie."}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-3 mb-2">
              {movie.genres?.slice(0, 5).map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-1.5 bg-red-600/70 backdrop-blur-sm rounded-full text-sm font-medium border border-red-500/30"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="font-bold">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">
                {movie.runtime ? `${movie.runtime} min` : "N/A"}
              </span>
            </div>

            {/* Action Buttons - Netflix-style */}
            <div className="flex flex-wrap gap-5">
              {trailerUrl ? (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-lg font-bold text-xl hover:bg-gray-200 transition shadow-2xl transform hover:scale-105"
                >
                  <Play size={32} fill="black" />
                  Play Trailer
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-3 bg-gray-700 text-gray-400 px-8 py-4 rounded-lg font-bold text-xl cursor-not-allowed"
                >
                  <Play size={32} />
                  No Trailer
                </button>
              )}

              <Link
                href="#more-details" // or add a real section below
                className="flex items-center gap-3 bg-slate-800/70 backdrop-blur-md text-white px-10 py-5 rounded-lg font-bold text-xl border border-white/20 hover:bg-slate-700/80 transition shadow-2xl hover:scale-105"
              >
                <Info size={32} />
                More Info
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modern Related Movies */}
      <section className="py-6 px-6 md:px-12 bg-slate-950 ">
        <h2 className="text-3xl font-bold mb-8 text-white">Related Movies</h2>

        {relatedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
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
