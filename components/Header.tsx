"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { debounce } from "../lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Bell, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  // Hide header completely on movie detail pages (/movie/[id])
  if (pathname.startsWith("/movie/")) {
    return null; // ← This hides the entire header
  }

  // Rest of your header code (only runs when NOT on /movie/[id])
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine if we are on a page that should have solid header from top
  const isDetailOrSearchPage =
    pathname.startsWith("/movie/") || searchParams.has("search");

  // Scroll detection (only matters when NOT on detail/search page)
  useEffect(() => {
    const handleScroll = () => {
      if (isDetailOrSearchPage) {
        setIsScrolled(true); // always solid
        return;
      }

      const scrollThreshold = window.innerHeight * 0.8; // ~80vh
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDetailOrSearchPage]);

  // Debounced search
  const handleSearch = debounce((term: string) => {
    if (term.trim()) {
      router.push(`/?search=${encodeURIComponent(term.trim())}`);
    } else {
      router.push("/");
    }
  }, 500);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchTerm(""); // optional: clear input when closing
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700"
          : "bg-transparent"
      }`}
    >
      {/* Left side: Logo + Nav */}
      <div className="flex items-center space-x-8 ">
        <Link href="/" className="text-3xl font-bold text-red-600 mr-12">
          Vidora
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-red-400 transition-colors">
            Home
          </Link>
          <Link href="/movies" className="hover:text-red-400 transition-colors">
            Movies
          </Link>
          <Link href="/series" className="hover:text-red-400 transition-colors">
            Series
          </Link>
          <Link href="/kids" className="hover:text-red-400 transition-colors">
            Kids
          </Link>
        </nav>
      </div>

      {/* Right side: Icons + Search */}
      <div className="flex items-center space-x-5">
        {/* Search area */}
        <div ref={searchRef} className="relative flex items-center">
          {!isSearchOpen ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white"
              aria-label="Open search"
            >
              <Search size={22} />
            </button>
          ) : (
            <div className="flex items-center bg-slate-800 border border-slate-600 rounded-full px-4 py-2 w-80 shadow-lg">
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchTerm}
                onChange={onInputChange}
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Notification */}
        <button
          className="p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={22} />
        </button>

        {/* Sign In */}
        <button
          className="p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white flex items-center gap-2"
          aria-label="Sign In"
        >
          <User size={22} />
          <span className="hidden sm:inline text-sm font-medium">Sign In</span>
        </button>
      </div>
    </header>
  );
}