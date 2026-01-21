import Link from "next/link";
import { Twitter, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-gray-400 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top section: Links + Logo */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 pt-6">
          {/* Brand / About */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-red-600 mb-2 sm:mb-4  block"
            >
              Vidora
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed">
              Your destination for discovering movies, series, and stories that
              matter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-2 sm:mb-4  text-sm sm:text-base">
              Explore
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Series
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div>
            <h3 className="text-white font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
              Support
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2 sm:mb-4 text-sm sm:text-base">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg sm:text-2xl"
              >
                <Twitter size={20} className="sm:size-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg sm:text-2xl"
              >
                <Instagram size={20} className="sm:size-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg sm:text-2xl"
              >
                <Facebook size={20} className="sm:size-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg sm:text-2xl"
              >
                <Youtube size={20} className="sm:size-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg sm:text-2xl"
              >
                <Linkedin size={20} className="sm:size-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section: Copyright + TMDB attribution */}
        <div className="pt-5 border-t border-slate-800 text-center text-xs sm:text-sm">
          <p className="mb-3">
            Vidora &copy; {new Date().getFullYear()} . All rights reserved.
          </p>
          <p className="text-gray-500">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-400 transition-colors"
            >
              TMDB API
            </a>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
