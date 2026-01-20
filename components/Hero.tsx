// "use client";

// import { useState } from "react";
// import { debounce } from "../lib/utils";
// import { Search } from "lucide-react";

// interface HeroProps {
//   onSearch: (query: string) => void;
// }

// export default function Hero({ onSearch }: HeroProps) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = debounce((term: string) => {
//     onSearch(term);
//   }, 300);

//   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     handleSearch(term);
//   };

//   return (
//     <section
//       className="relative h-screen flex flex-col items-center justify-center text-white"
//       style={{
//         backgroundImage:
//           "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('hero1.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "top",
//       }}
//     >
//       <div className="relative z-10 text-center px-6 max-w-4xl">
//         <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 drop-shadow-2xl animate-fade-in">
//           Vidora
//         </h1>

//         <p className="text-xl sm:text-2xl md:text-3xl font-light mb-10 max-w-3xl mx-auto opacity-90 drop-shadow-lg animate-fade-in delay-200">
//           Discover your next obsession. <br /> Thousands of movies and series
//           waiting.
//         </p>

//         {/* Modern search bar with icon inside */}
//         <div className="relative max-w-2xl mx-auto">
//           <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-red-500/50 ">
//             <Search size={22} className="text-gray-300 mr-4 flex-shrink-0" />
//             <input
//               type="text"
//               placeholder="Search movies, series, actors..."
//               value={searchTerm}
//               onChange={onInputChange}
//               className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
//               autoFocus={false}
//             />
//           </div>
//         </div>
//       </div>
//       {/* Subtle scroll indicator */}
//       <div className="absolute bottom-5 animate-bounce">
//         <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
//         </div>
//       </div>

//     </section>
//   );
// }

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
      className="relative h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('hero1.png')",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 drop-shadow-2xl animate-fade-in">
          Vidora
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-light mb-10 max-w-3xl mx-auto opacity-90 drop-shadow-lg animate-fade-in delay-200">
          Discover your next obsession. <br /> Thousands of movies and series
          waiting.
        </p>

        {/* Modern search bar with icon inside — now fully functional */}
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-red-500/50 ">
            <Search size={22} className="text-gray-300 mr-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search movies, series, actors..."
              value={searchTerm}
              onChange={onInputChange}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
              autoFocus={false}
            />
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-5 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}