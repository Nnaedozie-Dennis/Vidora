'use client';

import { useSearchParams } from 'next/navigation';
import Hero from '../components/Hero';
import TrendingCarousel from '../components/TrendingCarousel';
// import CategoryButtons from '../components/CategoryButtons';
import MovieGrid from '../components/MovieGrid';

export default function Home() {
  const searchParams = useSearchParams();
  const hasSearch = searchParams.has('search') && searchParams.get('search')?.trim() !== '';

  return (
    <main className="min-h-screen bg-slate-950">
      {!hasSearch && <Hero />} {/* Hide Hero when searching */}
      {!hasSearch && <TrendingCarousel />} {/* Hide Trending when searching */}
      {/* {!hasSearch && <CategoryButtons />}  */}
      <MovieGrid />
    </main>
  );
}