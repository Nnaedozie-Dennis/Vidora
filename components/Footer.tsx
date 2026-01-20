export default function Footer() {
  return (
    <footer className="py-8 bg-slate-800 text-center text-gray-400">
      <p>Vidora © 2026</p>
      <p className="mt-2">
        Powered by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:underline"
        >
          TMDB
        </a>
      </p>
    </footer>
  );
}
