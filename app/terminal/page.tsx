import React from "react";
import Terminal from "@/app/components/Terminal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal | ISTE NITK",
  description: "Experience ISTE NITK via our interactive command-line interface. Browse core members, check SIGs directories, and navigate with simple terminal commands.",
};

export default function TerminalPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 select-none">
      <div className="w-full max-w-5xl mb-3 flex items-center justify-between font-mono text-xs">
        <div className="text-slate-500 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal-400/70" />
          <span>secure_shell_session: active</span>
        </div>
        <div className="text-slate-500">
          host: <span className="text-teal-400">iste.nitk.edu.in</span>
        </div>
      </div>
      
      <Terminal />
    </main>
  );
}
