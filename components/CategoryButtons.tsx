"use client";

import { GENRE_MAP } from "../lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre") || "All Popular";

  const handleClick = (genre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("genre", genre);

    // The magic line ↓
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="py-3 sm:py-4 px-2 sm:px-3 overflow-x-auto scrollbar-hide sticky top-16 z-40 bg-slate-950 sm:-ml-1.75">
      <div className="flex space-x-2">
        {Object.keys(GENRE_MAP).map((genre) => (
          <button
            key={genre}
            onClick={() => handleClick(genre)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap cursor-pointer text-xs sm:text-sm font-medium ${
              currentGenre === genre
                ? "bg-red-600 text-white"
                : "bg-slate-900 text-gray-200 hover:bg-slate-800 "
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}