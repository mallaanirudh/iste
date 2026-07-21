"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminCore, executiveCore, auxCore, sigs } from "@/components/data";

interface LogEntry {
  id: string;
  type: "input" | "output" | "error" | "system";
  text?: string;
  elements?: React.ReactNode;
}

export default function Terminal() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setLogs([
      {
        id: "welcome-1",
        type: "system",
        text: "=========================================================",
      },
      {
        id: "welcome-2",
        type: "system",
        text: "      Welcome to ISTE NITK Command Line Interface         ",
      },
      {
        id: "welcome-3",
        type: "system",
        text: "=========================================================",
      },
      {
        id: "welcome-4",
        type: "system",
        text: "Type 'help' to see the list of available commands.",
      },
      {
        id: "welcome-5",
        type: "system",
        text: "Tip: Press 'Tab' to autocomplete or use Up/Down arrows for history.",
      },
      {
        id: "welcome-6",
        type: "system",
        text: " ",
      },
    ]);
    
    // Auto focus on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Click handler to re-focus input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Autocomplete functionality (Tab key)
  const handleAutocomplete = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    if (parts.length === 0) return;

    const command = parts[0]?.toLowerCase() || "";
    
    // Only autocomplete args for 'cd'
    if (command === "cd" && parts.length >= 2) {
      // Reconstruct the argument typed so far (removing quotes if present)
      let argSoFar = parts.slice(1).join(" ");
      if (
        (argSoFar.startsWith('"') && argSoFar.endsWith('"')) ||
        (argSoFar.startsWith("'") && argSoFar.endsWith("'"))
      ) {
        argSoFar = argSoFar.slice(1, -1);
      }
      
      const searchStr = argSoFar.toLowerCase();

      // Look in SIGs first
      const matchedSig = sigs.find(
        (s) =>
          s.slug.toLowerCase().startsWith(searchStr) ||
          s.title.toLowerCase().startsWith(searchStr)
      );

      if (matchedSig) {
        setInputValue(`cd "${matchedSig.title}"`);
        return;
      }

      // Look in Members
      const allMembers = [...adminCore, ...executiveCore, ...auxCore];
      const matchedMember = allMembers.find((m) =>
        m.name.toLowerCase().startsWith(searchStr)
      );

      if (matchedMember) {
        setInputValue(`cd "${matchedMember.name}"`);
        return;
      }
    } else if (parts.length === 1) {
      // Suggest/autocomplete command itself
      const cmdText = parts[0]?.toLowerCase() || "";
      const allCommands = ["ls", "cd", "clear", "exit", "help"];
      const matchedCmd = allCommands.find((c) => c.startsWith(cmdText));
      if (matchedCmd) {
        setInputValue(matchedCmd + " ");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        // history is newer to older, so reverse order
        setInputValue(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commandLine = inputValue.trim();
    if (!commandLine) return;

    // Add to logs
    const newLogId = Date.now().toString();
    const userPromptLog: LogEntry = {
      id: `prompt-${newLogId}`,
      type: "input",
      text: commandLine,
    };
    
    // Add to history
    setHistory((prev) => [...prev, commandLine]);
    setHistoryIndex(-1);
    
    // Process command
    const parts = commandLine.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const command = parts[0]?.toLowerCase() || "";
    const args = parts.slice(1).map((arg) => {
      if (
        (arg.startsWith('"') && arg.endsWith('"')) ||
        (arg.startsWith("'") && arg.endsWith("'"))
      ) {
        return arg.slice(1, -1);
      }
      return arg;
    });

    let resultLogs: LogEntry[] = [];

    switch (command) {
      case "help":
        resultLogs = [
          {
            id: `help-${newLogId}`,
            type: "output",
            elements: (
              <div className="grid grid-cols-[100px_1fr] gap-y-1 text-teal-300 font-mono text-sm max-w-lg mt-1">
                <span className="font-bold text-teal-400">ls</span>
                <span className="text-slate-300">Formatted list of club members and SIGs</span>
                <span className="font-bold text-teal-400">cd [target]</span>
                <span className="text-slate-300">Navigate to a member page (/team) or SIG page (/sigs/[slug])</span>
                <span className="font-bold text-teal-400">clear</span>
                <span className="text-slate-300">Reset the terminal log output</span>
                <span className="font-bold text-teal-400">exit</span>
                <span className="text-slate-300">Exit the terminal and return to standard GUI home</span>
                <span className="font-bold text-teal-400">help</span>
                <span className="text-slate-300">Show this help dashboard</span>
              </div>
            ),
          },
        ];
        break;

      case "clear":
        setLogs([]);
        setInputValue("");
        return;

      case "exit":
        resultLogs = [
          {
            id: `exit-${newLogId}`,
            type: "system",
            text: "Closing terminal session... Redirecting in progress...",
          },
        ];
        setTimeout(() => {
          router.push("/");
        }, 800);
        break;

      case "ls":
        // Output beautiful formatted layout of core members & SIGs
        resultLogs = [
          {
            id: `ls-header-${newLogId}`,
            type: "output",
            elements: (
              <div className="space-y-4 font-mono text-sm mt-1 sm:text-base leading-relaxed">
                <div>
                  <h3 className="text-teal-450 border-b border-teal-500/20 pb-0.5 text-semibold uppercase select-none">
                    ■ Admin Core
                  </h3>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 pl-2 text-slate-300">
                    {adminCore.map((m) => (
                      <div key={m.name} className="flex justify-between border-b border-slate-800/20 py-0.5">
                        <span className="text-white hover:text-teal-305 transition-colors">{m.name}</span>
                        <span className="text-teal-400/80 italic text-xs">{m.post}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-orange-400 border-b border-orange-500/20 pb-0.5 text-semibold uppercase select-none">
                    ■ SIGs (Special Interest Groups)
                  </h3>
                  <div className="mt-1 grid grid-cols-1 gap-y-1.5 pl-2 text-slate-300">
                    {sigs.map((s) => (
                      <div key={s.slug} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                        <span className="text-white font-bold min-w-[120px]">{s.title}</span>
                        <span className="text-slate-400 text-xs shrink-0 select-all">/{s.slug}</span>
                        <span className="text-slate-500 text-xs sm:pl-2 italic hidden md:inline">
                          — {s.description.substring(0, 75)}...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-purple-400 border-b border-purple-500/20 pb-0.5 text-semibold uppercase select-none">
                    ■ Executive & Aux Core Teams
                  </h3>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0.5 pl-2 text-slate-400 text-xs">
                    {[...executiveCore, ...auxCore].map((m) => (
                      <div key={m.name} className="flex flex-col border-b border-slate-900/40 py-0.5">
                        <span className="text-slate-205">{m.name}</span>
                        <span className="text-slate-520 italic text-[10px]">{m.post}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          },
        ];
        break;

      case "cd":
        const target = args.join(" ").trim().toLowerCase();
        if (!target) {
          resultLogs = [
            {
              id: `cd-empty-${newLogId}`,
              type: "system",
              text: "Directory syntax: cd [NAME/SIG]. Going back to root system (Home)...",
            },
          ];
          setTimeout(() => {
            router.push("/");
          }, 800);
          break;
        }

        if (target === "team") {
          resultLogs = [
            {
              id: `cd-team-${newLogId}`,
              type: "system",
              text: "Redirecting to /team ...",
            },
          ];
          setTimeout(() => {
            router.push("/team");
          }, 500);
          break;
        }

        if (target === "sigs" || target === "sig") {
          // No dedicated SIG list page exists, they are on root home Page
          resultLogs = [
            {
              id: `cd-sigs-${newLogId}`,
              type: "system",
              text: "Navigating to SIGs catalog on Home page...",
            },
          ];
          setTimeout(() => {
            router.push("/#sigs");
          }, 500);
          break;
        }

        // Try matching a SIG slug or title
        const matchSig = sigs.find(
          (s) =>
            s.slug.toLowerCase() === target || s.title.toLowerCase() === target
        );
        if (matchSig) {
          resultLogs = [
            {
              id: `cd-sig-found-${newLogId}`,
              type: "system",
              text: `Navigating to ${matchSig.title} SIG page (/sigs/${matchSig.slug})...`,
            },
          ];
          setTimeout(() => {
            router.push(`/sigs/${matchSig.slug}`);
          }, 500);
          break;
        }

        // Try matching a Member name
        const allMembers = [...adminCore, ...executiveCore, ...auxCore];
        const matchMember = allMembers.find(
          (m) =>
            m.name.toLowerCase() === target ||
            m.name.toLowerCase().includes(target)
        );
        if (matchMember) {
          resultLogs = [
            {
              id: `cd-member-found-${newLogId}`,
              type: "system",
              text: `Found member: ${matchMember.name} (${matchMember.post}). Routing to /team catalog...`,
            },
          ];
          setTimeout(() => {
            router.push("/team");
          }, 500);
          break;
        }

        // Error if target not resolved
        resultLogs = [
          {
            id: `cd-error-${newLogId}`,
            type: "error",
            text: `cd: '${target}': Member/SIG not found. Try 'ls' to see the exact names of directories and entities.`,
          },
        ];
        break;

      default:
        resultLogs = [
          {
            id: `unknown-${newLogId}`,
            type: "error",
            text: `bash: command not found: '${command}'. Type 'help' for support.`,
          },
        ];
    }

    setLogs((prev) => [...prev, userPromptLog, ...resultLogs]);
    setInputValue("");
  };

  return (
    <div
      onClick={handleTerminalClick}
      className="mx-auto flex h-[80vh] min-h-[500px] w-full max-w-5xl flex-col rounded-xl border border-teal-500/25 bg-neutral-950/80 text-slate-100 shadow-[0_0_35px_rgba(20,184,166,0.15)] backdrop-blur-md overflow-hidden font-mono antialiased cursor-text"
    >
      {/* Terminal Title Bar */}
      <div className="flex h-11 items-center justify-between border-b border-white/5 bg-neutral-900/50 px-4 select-none">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80 transition-colors hover:bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80 transition-colors hover:bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500/80 transition-colors hover:bg-green-500" />
        </div>
        <div className="text-xs font-semibold tracking-wide text-slate-400">
          guest@iste-nitk: ~
        </div>
        <div className="w-12 text-right text-[10px] text-teal-400/60 font-bold tracking-wider">
          CLI v1.0
        </div>
      </div>

      {/* Terminal Logs Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-2 scrollbar-thin scrollbar-thumb-teal-500/20 scrollbar-track-transparent"
      >
        {logs.map((log) => {
          if (log.type === "input") {
            return (
              <div key={log.id} className="flex items-baseline space-x-2">
                <span className="text-teal-400 font-bold">guest@iste-nitk:~$</span>
                <span className="text-white font-medium select-text">{log.text}</span>
              </div>
            );
          }
          if (log.type === "error") {
            return (
              <div key={log.id} className="text-rose-450 pl-2 border-l-2 border-rose-500 select-text">
                {log.text}
              </div>
            );
          }
          if (log.type === "system") {
            return (
              <div key={log.id} className="text-yellow-400/90 italic pl-2 border-l-2 border-yellow-400/40 select-text">
                {log.text}
              </div>
            );
          }
          // Log output HTML/React Elements
          return (
            <div key={log.id} className="text-slate-300 py-1 pl-2 select-text">
              {log.text && <div>{log.text}</div>}
              {log.elements}
            </div>
          );
        })}

        {/* Action input line */}
        <form onSubmit={handleCommandSubmit} className="flex items-center space-x-2 pt-1">
          <span className="text-teal-400 font-bold shrink-0">guest@iste-nitk:~$</span>
          
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white outline-none border-none p-0 m-0 caret-transparent font-mono"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            {/* Custom blinking caret positioned at the end of input text */}
            <span
              className="absolute pointer-events-none text-white left-0 flex items-center"
              style={{
                transform: `translateX(${inputValue.length * 8.4}px)`,
                transition: "transform 0.05s ease-out",
              }}
            >
              <span className="w-2 h-4.5 bg-teal-400 animate-[pulse_1s_infinite] shadow-[0_0_8px_#14b8a6]" />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
