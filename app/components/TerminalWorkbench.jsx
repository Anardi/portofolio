"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import {
  createSimulator,
  getModuleScenario,
} from "../../lib/terminal-simulator";
import { modules } from "../../data/lab";

const QUICK_COMMANDS = [
  "help",
  "pwd",
  "ls -la",
  "whoami",
  "ip a",
  "systemctl status nginx",
];
const GREEN = "\x1b[38;2;0;214;143m";
const BLUE = "\x1b[38;2;92;166;255m";
const MUTED = "\x1b[38;2;126;145;138m";
const RESET = "\x1b[0m";

function promptFor(simulator) {
  const path =
    simulator.state.cwd === "/home/student"
      ? "~"
      : simulator.state.cwd.replace("/home/student", "~");
  return `${GREEN}student@ubuntu-lab${RESET}:${BLUE}${path}${RESET}$ `;
}

function writeOutput(term, output) {
  if (output === "__CLEAR__") {
    term.clear();
    return;
  }
  if (output) term.write(`${String(output).replace(/\n/g, "\r\n")}\r\n`);
}

export default function TerminalWorkbench({ initialModuleId = "" }) {
  const hostRef = useRef(null);
  const terminalRef = useRef(null);
  const fitRef = useRef(null);
  const shellRef = useRef(null);
  const inputRef = useRef("");
  const historyRef = useRef([]);
  const historyIndexRef = useRef(0);
  const [moduleId, setModuleId] = useState(initialModuleId);
  const initialPropRef = useRef(initialModuleId);
  const [ready, setReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const writePrompt = useCallback(() => {
    const term = terminalRef.current;
    const shell = shellRef.current;
    if (term && shell) term.write(promptFor(shell));
  }, []);

  const runCommand = useCallback(
    (raw, echo = false) => {
      const term = terminalRef.current;
      const shell = shellRef.current;
      if (!term || !shell) return;
      const command = String(raw || "").trim();
      if (echo) {
        if (inputRef.current)
          term.write("\b \b".repeat(inputRef.current.length));
        inputRef.current = "";
        if (command) term.write(command);
      }
      term.write("\r\n");
      if (!command) {
        writePrompt();
        return;
      }
      historyRef.current.push(command);
      historyIndexRef.current = historyRef.current.length;
      const output = shell.execute(command);
      writeOutput(term, output);
      writePrompt();
    },
    [writePrompt],
  );

  const resetLab = useCallback(
    (nextModuleId = moduleId) => {
      const term = terminalRef.current;
      if (!term) return;
      shellRef.current = createSimulator(nextModuleId);
      inputRef.current = "";
      historyRef.current = [];
      historyIndexRef.current = 0;
      term.clear();
      const scenario = getModuleScenario(nextModuleId);
      term.writeln(`${GREEN}Ubuntu Lab · Bash Simulator${RESET}`);
      term.writeln(
        `${MUTED}Client-side mock shell — tidak terhubung ke server atau VM sungguhan.${RESET}`,
      );
      term.writeln(`Modul aktif: ${BLUE}${scenario.title}${RESET}`);
      term.writeln(scenario.intro);
      term.writeln(
        `Ketik ${GREEN}help${RESET} untuk daftar perintah atau ${GREEN}module${RESET} untuk panduan latihan.`,
      );
      term.writeln("");
      writePrompt();
    },
    [moduleId, writePrompt],
  );

  useEffect(() => {
    if (!hostRef.current || terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      convertEol: false,
      fontFamily:
        'var(--font-jetbrains), "SFMono-Regular", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.35,
      scrollback: 1200,
      allowProposedApi: false,
      theme: {
        background: "#050807",
        foreground: "#d8e6e0",
        cursor: "#00d68f",
        cursorAccent: "#050807",
        selectionBackground: "#00d68f44",
        black: "#050807",
        red: "#ff647c",
        green: "#00d68f",
        yellow: "#f0c674",
        blue: "#5ca6ff",
        magenta: "#c792ea",
        cyan: "#69d7d0",
        white: "#d8e6e0",
        brightBlack: "#667770",
        brightRed: "#ff8495",
        brightGreen: "#60f4bd",
        brightYellow: "#f7d995",
        brightBlue: "#87bdff",
        brightMagenta: "#d8a8ff",
        brightCyan: "#85e8e2",
        brightWhite: "#ffffff",
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(hostRef.current);
    terminalRef.current = term;
    fitRef.current = fit;
    shellRef.current = createSimulator(initialModuleId);

    const resize = () => {
      try {
        fit.fit();
      } catch {
        /* container may be hidden during a route transition */
      }
    };
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (observer && hostRef.current) observer.observe(hostRef.current);
    window.addEventListener("resize", resize);

    const scenario = getModuleScenario(initialModuleId);
    term.writeln(`${GREEN}Ubuntu Lab · Bash Simulator${RESET}`);
    term.writeln(
      `${MUTED}Client-side mock shell — tidak terhubung ke server atau VM sungguhan.${RESET}`,
    );
    term.writeln(`Modul aktif: ${BLUE}${scenario.title}${RESET}`);
    term.writeln(scenario.intro);
    term.writeln(
      `Ketik ${GREEN}help${RESET} untuk daftar perintah atau ${GREEN}module${RESET} untuk panduan latihan.`,
    );
    term.writeln("");
    term.write(promptFor(shellRef.current));
    resize();
    setReady(true);

    const onData = term.onData((data) => {
      for (let i = 0; i < data.length; i += 1) {
        const char = data[i];
        if (char === "\r") {
          const command = inputRef.current;
          inputRef.current = "";
          runCommand(command);
        } else if (char === "\u0003") {
          term.write("^C\r\n");
          inputRef.current = "";
          writePrompt();
        } else if (char === "\u000c") {
          term.clear();
          inputRef.current = "";
          writePrompt();
        } else if (data.startsWith("\u001b[A", i)) {
          i += 2;
          if (historyRef.current.length) {
            historyIndexRef.current = Math.max(0, historyIndexRef.current - 1);
            const nextValue = historyRef.current[historyIndexRef.current] || "";
            term.write("\b \b".repeat(inputRef.current.length));
            inputRef.current = nextValue;
            term.write(nextValue);
          }
        } else if (data.startsWith("\u001b[B", i)) {
          i += 2;
          historyIndexRef.current = Math.min(
            historyRef.current.length,
            historyIndexRef.current + 1,
          );
          const nextValue = historyRef.current[historyIndexRef.current] || "";
          term.write("\b \b".repeat(inputRef.current.length));
          inputRef.current = nextValue;
          term.write(nextValue);
        } else if (char === "\u007f" || char === "\b") {
          if (inputRef.current.length) {
            inputRef.current = inputRef.current.slice(0, -1);
            term.write("\b \b");
          }
        } else if (char >= " " && char !== "\u007f") {
          inputRef.current += char;
          term.write(char);
        }
      }
    });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      onData.dispose();
      term.dispose();
      terminalRef.current = null;
      fitRef.current = null;
      shellRef.current = null;
    };
    // This terminal is created once per page mount; changing modules resets the current in-memory lab.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialPropRef.current !== initialModuleId) {
      initialPropRef.current = initialModuleId;
      setModuleId(initialModuleId);
      resetLab(initialModuleId);
      return;
    }
    if (ready && shellRef.current?.state.moduleId !== moduleId)
      resetLab(moduleId);
  }, [initialModuleId, moduleId, ready, resetLab]);

  const chooseModule = (event) => {
    const next = event.target.value;
    setModuleId(next);
    resetLab(next);
  };

  const scenario = getModuleScenario(moduleId);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-slate-400 transition hover:text-[#00d68f]"
          >
            <span aria-hidden="true">←</span> kembali ke portofolio
          </Link>
          <p className="mb-3 font-mono text-xs uppercase tracking-[.22em] text-[#00d68f]">
            Interactive learning environment
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bash Ubuntu <span className="text-[#00d68f]">/</span> Lab
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Latihan command-line Linux langsung di browser. Perintah yang
            didukung memakai filesystem, service, jaringan, dan log tiruan yang
            bisa berubah selama sesi ini.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00d68f]/25 bg-[#00d68f]/[.08] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#5af0bc]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d68f]" />
            client-side active
          </span>
          <button
            type="button"
            onClick={() => resetLab(moduleId)}
            className="rounded-lg border border-white/15 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-[#00d68f]/60 hover:text-[#72f5c5]"
          >
            Reset lab
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <section
          className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#080c0a] shadow-[0_24px_90px_-32px_rgba(0,214,143,.17)]"
          aria-label="Ubuntu terminal simulasi"
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#101512] px-4 py-3">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-2 flex-1 font-mono text-xs text-slate-400">
              student@ubuntu-lab:~ — bash
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#00d68f]">
              mock shell
            </span>
          </div>
          <div
            ref={hostRef}
            className="xterm-host h-[390px] w-full px-3 py-3 sm:h-[470px]"
            aria-label="Terminal input dan output"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
            <span className="font-mono text-[11px] text-slate-500">
              Enter jalankan · ↑/↓ riwayat · Ctrl+L bersihkan
            </span>
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="font-mono text-xs text-[#5af0bc] hover:underline"
            >
              {showHelp ? "Sembunyikan bantuan" : "Lihat command dasar"}
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
            <label
              htmlFor="module-select"
              className="mb-2 block font-mono text-[11px] uppercase tracking-[.18em] text-slate-400"
            >
              Konteks modul
            </label>
            <select
              id="module-select"
              value={moduleId}
              onChange={chooseModule}
              className="w-full rounded-lg border border-white/15 bg-[#101512] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#00d68f]"
            >
              <option value="">Bash Ubuntu dasar</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
            <h2 className="mt-4 text-lg font-semibold text-white">
              {scenario.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {scenario.intro}
            </p>
            <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">
              Semua perubahan bersifat sementara dan hilang saat lab di-reset
              atau halaman ditutup.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-white">Perintah cepat</h2>
              <span className="font-mono text-[10px] text-slate-500">RUN</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_COMMANDS.map((command) => (
                <button
                  key={command}
                  type="button"
                  onClick={() => runCommand(command, true)}
                  className="rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 font-mono text-[11px] text-slate-300 transition hover:border-[#00d68f]/50 hover:text-[#72f5c5]"
                >
                  {command}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#00d68f]/20 bg-[#00d68f]/[.04] p-5">
            <h2 className="font-semibold text-[#72f5c5]">Tantangan modul</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Jalankan langkah secara berurutan. Anda dapat mengubah state
              simulasi, menguji output, lalu reset untuk mengulangi latihan.
            </p>
            <ol className="mt-4 space-y-2">
              {scenario.commands.map((command, index) => (
                <li key={`${command}-${index}`}>
                  <button
                    type="button"
                    onClick={() => runCommand(command, true)}
                    className="group flex w-full items-start gap-2 text-left font-mono text-[11px] leading-5 text-slate-300 hover:text-[#72f5c5]"
                  >
                    <span className="text-[#00d68f]">$</span>
                    <span>{command}</span>
                  </button>
                </li>
              ))}
            </ol>
            <Link
              href={`/modul/${moduleId || "persiapan"}`}
              className="mt-4 inline-flex text-xs text-[#72f5c5] underline decoration-[#00d68f]/30 underline-offset-4 hover:decoration-[#00d68f]"
            >
              Buka instruksi modul ↗
            </Link>
          </section>
        </aside>
      </div>

      {showHelp && (
        <section
          className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-white/[.025] p-5 md:grid-cols-3"
          aria-label="Bantuan perintah"
        >
          <div>
            <h3 className="font-mono text-sm text-[#72f5c5]">Filesystem</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              `pwd`, `ls -la`, `cd`, `mkdir`, `touch`, `cat`, `echo "teks" &gt;
              file`, `chmod`, `rm`.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-sm text-[#72f5c5]">
              System & network
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              `ip a`, `ip route`, `ping`, `ss -tulpn`, `df -h`, `free -h`, `ps`,
              `systemctl`, `journalctl`.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-sm text-[#72f5c5]">
              Pipa & troubleshooting
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              `cat /etc/passwd | grep student`, `journalctl -u nginx | tail -n
              10`, `sudo nginx -t`, `sudo ufw status`.
            </p>
          </div>
        </section>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[.04] p-4 text-xs leading-5 text-amber-100/70">
        <span aria-hidden="true" className="mt-0.5">
          ⓘ
        </span>
        <p>
          <strong className="text-amber-100">Batasan simulasi:</strong> ini
          bukan Bash Linux asli dan tidak memiliki akses ke VM, jaringan, disk,
          maupun OS perangkat Anda. Beberapa perintah hanya memiliki output
          tiruan; gunakan Ubuntu Server di VirtualBox untuk memvalidasi hasil
          yang sesungguhnya.
        </p>
      </div>
    </main>
  );
}
