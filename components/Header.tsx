"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { debounce } from "../lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Bell, User, Menu, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Hide header completely on movie detail pages (/movie/[id])
  if (pathname.startsWith("/movie/")) {
    return null; // ← This hides the entire header
  }

  // Rest of your header code (only runs when NOT on /movie/[id])
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isSearchOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700"
          : "bg-transparent"
      }`}
    >
      {/* Left side: Logo + Nav */}
      <div className="flex items-center space-x-4 sm:space-x-8 ">
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-red-600">
          Vidora
        </Link>

        <nav className="hidden lg:flex space-x-4 xl:space-x-6 text-sm md:text-base">
          <Link href="/" className="hover:text-red-400 transition-colors">
            Home
          </Link>
          <Link href="/" className="hover:text-red-400 transition-colors">
            Movies
          </Link>
          <Link href="/" className="hover:text-red-400 transition-colors">
            Series
          </Link>
          <Link href="/" className="hover:text-red-400 transition-colors">
            Kids
          </Link>
        </nav>
      </div>

      {/* Right side: Icons + Search */}
      <div className="flex items-center space-x-2 sm:space-x-5">
        {/* Search area - hidden on mobile when menu is open */}
        {!isMobileMenuOpen && (
          <div ref={searchRef} className="relative flex items-center">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
              >
                <Search size={20} className="sm:size-5.5" />
              </button>
            ) : (
              <div className="static flex items-center bg-slate-800 border border-slate-600 rounded-full px-3 sm:px-4 py-2 w-full sm:w-80 shadow-lg">
                <Search size={18} className="text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={onInputChange}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm sm:text-base"
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Notification - hidden on mobile */}
        <button className="hidden sm:block p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer">
          <Bell size={22} />
        </button>

        {/* User Auth Button - hidden on mobile */}
        {isLoaded && !user ? (
          <button className="hidden sm:flex p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white items-center gap-2 cursor-pointer">
            <User size={22} />
            <a href="https://flowing-cougar-99.accounts.dev/sign-up" className="hover:text-red-400">
              Sign Up
            </a>
          </button>
        ) : isLoaded && user ? (
          <div className="hidden sm:flex gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : null}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="fixed top-0 right-0 h-screen w-[70%] max-w-sm bg-slate-900/95 backdrop-blur-md border-l border-slate-700 p-4 space-y-3 lg:hidden z-40">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
          >
            <X size={24} />
          </button>
          <div className="mt-10 space-y-3">
            <Link
              href="/"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              href="/"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Series
            </Link>
            <Link
              href="/"
              className="block py-2 hover:text-red-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kids
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-700 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="text-sm">Notifications</span>
            </button>
            {isLoaded && !user ? (
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-white transition-colors">
                <User size={18} />
                <a
                  href="https://flowing-cougar-99.accounts.dev/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm"
                >
                  Sign Up
                </a>
              </button>
            ) : isLoaded && user ? (
              <div className="flex-1 flex items-center justify-center">
                <UserButton afterSignOutUrl="/" />
                <span className="ml-2 text-sm">User</span>
              </div>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}





// "use client";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { debounce } from "../lib/utils";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { Search, Bell, User, Menu, X } from "lucide-react";
// import { useUser } from "@clerk/nextjs";
// import {
//   UserButton,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignUpButton,
// } from "@clerk/nextjs";

// export default function Header() {
//   const pathname = usePathname();
//   const { user, isLoaded } = useUser();

//   // Hide header completely on movie detail pages (/movie/[id])
//   if (pathname.startsWith("/movie/")) {
//     return null; // ← This hides the entire header
//   }

//   // Rest of your header code (only runs when NOT on /movie/[id])
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Determine if we are on a page that should have solid header from top
//   const isDetailOrSearchPage =
//     pathname.startsWith("/movie/") || searchParams.has("search");

//   // Scroll detection (only matters when NOT on detail/search page)
//   useEffect(() => {
//     const handleScroll = () => {
//       if (isDetailOrSearchPage) {
//         setIsScrolled(true); // always solid
//         return;
//       }

//       const scrollThreshold = window.innerHeight * 0.8; // ~80vh
//       setIsScrolled(window.scrollY > scrollThreshold);
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll(); // initial check

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isDetailOrSearchPage]);

//   // Debounced search
//   const handleSearch = debounce((term: string) => {
//     if (term.trim()) {
//       router.push(`/?search=${encodeURIComponent(term.trim())}`);
//     } else {
//       router.push("/");
//     }
//   }, 500);

//   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     handleSearch(term);
//   };

//   // Close search on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setIsSearchOpen(false);
//         setSearchTerm(""); // optional: clear input when closing
//       }
//     };

//     if (isSearchOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isSearchOpen]);

//   // Close mobile menu when search opens
//   useEffect(() => {
//     if (isSearchOpen) {
//       setIsMobileMenuOpen(false);
//     }
//   }, [isSearchOpen]);

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
//         isScrolled
//           ? "bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700"
//           : "bg-transparent"
//       }`}
//     >
//       {/* Left side: Logo + Nav */}
//       <div className="flex items-center space-x-4 sm:space-x-8 ">
//         <Link href="/" className="text-2xl sm:text-3xl font-bold text-red-600">
//           Vidora
//         </Link>

//         <nav className="hidden lg:flex space-x-4 xl:space-x-6 text-sm md:text-base">
//           <Link href="/" className="hover:text-red-400 transition-colors">
//             Home
//           </Link>
//           <Link href="/" className="hover:text-red-400 transition-colors">
//             Movies
//           </Link>
//           <Link href="/" className="hover:text-red-400 transition-colors">
//             Series
//           </Link>
//           <Link href="/" className="hover:text-red-400 transition-colors">
//             Kids
//           </Link>
//         </nav>
//       </div>

//       {/* Right side: Icons + Search */}
//       <div className="flex items-center space-x-2 sm:space-x-5">
//         {/* Search area - hidden on mobile when menu is open */}
//         {!isMobileMenuOpen && (
//           <div ref={searchRef} className="relative flex items-center">
//             {!isSearchOpen ? (
//               <button
//                 onClick={() => setIsSearchOpen(true)}
//                 className="relative p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
//               >
//                 <Search size={20} className="sm:size-5.5" />
//               </button>
//             ) : (
//               <div className="static flex items-center bg-slate-800 border border-slate-600 rounded-full px-3 sm:px-4 py-2 w-full sm:w-80 shadow-lg">
//                 <Search size={18} className="text-gray-400 mr-3 shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={onInputChange}
//                   className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm sm:text-base"
//                   autoFocus
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Notification - hidden on mobile */}
//         <button className="hidden sm:block p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer">
//           <Bell size={22} />
//         </button>

//         {/* User Auth Button - hidden on mobile */}
//         {isLoaded && !user ? (
//           <SignedOut>
//             <div className="hidden sm:flex items-center gap-2">
//               {/* <SignInButton mode="modal">
//                 <button className="p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white items-center gap-2 cursor-pointer">
//                   <User size={22} />
//                 </button>
//               </SignInButton> */}

//               <SignUpButton mode="modal">
//                 <button className="hidden sm:flex p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white items-center gap-2 cursor-pointer">
//                   <User size={22} />
//                   <span className="hover:text-red-400">Sign Up</span>
//                 </button>
//               </SignUpButton>
//             </div>
//           </SignedOut>
//         ) : isLoaded && user ? (
//           <div className="hidden sm:flex gap-4">
//             <UserButton afterSignOutUrl="/" />
//           </div>
//         ) : null}

//         {/* Mobile Menu Toggle */}
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="lg:hidden p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <nav className="fixed top-0 right-0 h-screen w-[70%] max-w-sm bg-slate-900/95 backdrop-blur-md border-l border-slate-700 p-4 space-y-3 lg:hidden z-40">
//           <button
//             onClick={() => setIsMobileMenuOpen(false)}
//             className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/50 transition-colors text-gray-300 hover:text-white cursor-pointer"
//           >
//             <X size={24} />
//           </button>
//           <div className="mt-10 space-y-3">
//             <Link
//               href="/"
//               className="block py-2 hover:text-red-400 transition-colors"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               href="/"
//               className="block py-2 hover:text-red-400 transition-colors"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Movies
//             </Link>
//             <Link
//               href="/"
//               className="block py-2 hover:text-red-400 transition-colors"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Series
//             </Link>
//             <Link
//               href="/"
//               className="block py-2 hover:text-red-400 transition-colors"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Kids
//             </Link>
//           </div>
//           <div className="pt-2 border-t border-slate-700 flex gap-2">
//             <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-white transition-colors">
//               <Bell size={18} />
//               <span className="text-sm">Notifications</span>
//             </button>
//             {isLoaded && !user ? (
//               <SignedOut>
//                 <div className="flex-1 flex items-center justify-center gap-2">
//                   <SignInButton mode="modal">
//                     <button className="flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors">
//                       <User size={18} />
//                       <span className="text-sm">Sign In</span>
//                     </button>
//                   </SignInButton>

//                   <SignUpButton mode="modal">
//                     <button className="flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors">
//                       <User size={18} />
//                       <span className="text-sm">Sign Up</span>
//                     </button>
//                   </SignUpButton>
//                 </div>
//               </SignedOut>
//             ) : isLoaded && user ? (
//               <div className="flex-1 flex items-center justify-center">
//                 <UserButton afterSignOutUrl="/" />
//                 <span className="ml-2 text-sm">User</span>
//               </div>
//             ) : null}
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// }
