"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ClientBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group"
      aria-label="Go back"
    >
      <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 group-hover:bg-black/60">
        <ArrowLeft size={28} />
      </div>
    </button>
  );
}
