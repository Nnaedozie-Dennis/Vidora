"use client";

import { useState } from "react";
import { debounce } from "../lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";


interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();


  const handleSearch = debounce((term: string) => {
    const trimmed = term.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
      onSearch("");
    }
  }, 10000); 

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  return (
    <section
      className="relative min-h-screen sm:h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('hero1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >

      {/* Your content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-5 drop-shadow-2xl animate-fade-in">
          Vidora
        </h1>

        <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-10 max-w-3xl mx-auto opacity-90 drop-shadow-lg animate-fade-in delay-200">
          Discover your next obsession. <br /> Thousands of movies and series
          waiting.
        </p>

        {/* Modern search bar with icon inside — now fully functional */}
        <div className="relative max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
          <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 sm:px-6 py-3 sm:py-4 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-red-500/50 ">
            <Search
              size={20}
              className="sm:size-5.5 text-gray-300 mr-3 sm:mr-4 shrink-0"
            />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={onInputChange}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm sm:text-lg"
              autoFocus={false}
            />
          </div>
        </div>
      </div>
      {/* Subtle scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-5 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}