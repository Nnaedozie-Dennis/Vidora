"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "../components/Hero";
import TrendingCarousel from "../components/TrendingCarousel";
import MovieGrid from "../components/MovieGrid";

function HomeContent() {
  const searchParams = useSearchParams();
  const hasSearch =
    searchParams.has("search") && searchParams.get("search")?.trim() !== "";

  const handleSearch = (query: string) => {
    // Handle search if needed
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {!hasSearch && <Hero onSearch={handleSearch} />}{" "}
      {/* Hide Hero when searching */}
      {!hasSearch && <TrendingCarousel />} {/* Hide Trending when searching */}
      <MovieGrid />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <HomeContent />
    </Suspense>
  );
}
