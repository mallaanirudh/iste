"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TerminalToggle() {
  const pathname = usePathname();
  const isTerminal = pathname === "/terminal";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      <Link
        href={isTerminal ? "/" : "/terminal"}
        className={`group relative flex items-center justify-center px-4 py-2.5 rounded-lg border font-mono text-sm font-semibold tracking-wider uppercase transition-all duration-305 focus:outline-none select-none
          ${
            isTerminal
              ? "bg-rose-950/80 hover:bg-rose-900 border-rose-500/50 hover:border-rose-400 text-rose-350 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.45)]"
              : "bg-teal-980/80 hover:bg-teal-900 border-teal-500/40 hover:border-teal-400 text-teal-350 shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]"
          }
        `}
      >
        {/* Subtle sliding light reflection effect */}
        <span className="absolute inset-0 w-full h-full overflow-hidden rounded-lg">
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </span>

        {/* Small indicator dot */}
        <span className="mr-1.5 flex h-2 w-2 relative">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
              ${isTerminal ? "bg-rose-450" : "bg-teal-450"}
            `}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2
              ${isTerminal ? "bg-rose-500" : "bg-teal-500"}
            `}
          />
        </span>

        <span className="relative">
          {isTerminal ? "[GUI Mode]" : "[CLI Mode]"}
        </span>
      </Link>
    </div>
  );
}
