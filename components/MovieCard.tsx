


import Image from "next/image";
import Link from "next/link";
import { Movie } from "../lib/utils";

interface MovieCardProps {
  movie: Movie;
  rank?: number;
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.jpg";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <div className="relative">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={300}
          height={450}
          className="object-cover w-full"
        />
        {rank && (
          <span className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded">
            #{rank}
          </span>
        )}
      </div>
      <div className="p-2 bg-slate-900">
        <h3 className="font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400">
          {movie.release_date.slice(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
