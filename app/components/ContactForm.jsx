"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { btnPri, field } from "../ui";

export default function ContactForm({ to, siteKey }) {
  const [state, setState] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  const renderTurnstile = useCallback(() => {
    if (
      !siteKey ||
      !window.turnstile ||
      !widgetRef.current ||
      widgetIdRef.current !== null
    )
      return;

    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      action: "contact",
      theme: "auto",

      callback: (token) => {
        setTurnstileToken(token);
        setState("idle");
      },

      "expired-callback": () => {
        setTurnstileToken("");
        setState("captchaExpired");
      },

      "error-callback": () => {
        setTurnstileToken("");
        setState("captchaUnavailable");
      },
    });
  }, [siteKey]);

  useEffect(() => {
    return () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  function resetTurnstile() {
    setTurnstileToken("");

    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (!turnstileToken) {
      setState("captchaRequired");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || ""),
      turnstileToken,
    };

    setState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      resetTurnstile();

      if (response.ok && result.ok && result.preview) {
        form.reset();
        setState("preview");
      } else if (response.ok && result.ok) {
        form.reset();
        setState("sent");
      } else if (result.code === "contact_disabled") {
        setState("contactDisabled");
      } else if (result.code === "email_service_not_configured") {
        setState("emailNotConfigured");
      } else if (result.code === "turnstile_not_configured") {
        setState("turnstileNotConfigured");
      } else if (result.code === "invalid_environment_configuration") {
        setState("environmentError");
      } else if (response.status === 429) {
        setState("rateLimited");
      } else if (
        result.code === "turnstile_invalid" ||
        result.code === "turnstile_unavailable"
      ) {
        setState("captchaFailed");
      } else {
        setState("error");
      }
    } catch {
      resetTurnstile();
      setState("error");
    }
  }

  const messages = {
    contactDisabled: {
      tone: "warn",
      text: "Form kontak sedang dinonaktifkan sementara. Silakan coba kembali nanti.",
    },

    emailNotConfigured: {
      tone: "warn",
      text: "Layanan pengiriman email belum dikonfigurasi. Pesan belum dapat dikirim.",
    },

    turnstileNotConfigured: {
      tone: "warn",
      text: "Konfigurasi verifikasi keamanan belum tersedia. Silakan coba kembali nanti.",
    },

    environmentError: {
      tone: "error",
      text: "Terjadi kesalahan konfigurasi pada layanan kontak. Silakan coba kembali nanti.",
    },
  };

  const message = messages[state];

  const noticeStyle =
    message?.tone === "ok"
      ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
      : message?.tone === "warn"
        ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200"
        : "border-red-500 bg-red-500/10 text-red-800 dark:text-red-200";

  const lbl = "mb-1.5 block text-sm font-medium";

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
          onError={() => setState("captchaUnavailable")}
        />
      )}

      <form
        onSubmit={onSubmit}
        className="relative space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[6px_6px_18px_#dfe5ec,-6px_-6px_18px_#ffffff] backdrop-blur-md dark:border-white/10 dark:bg-[#0B120F]/80 dark:shadow-[6px_6px_18px_rgba(0,0,0,.4)]"
      >
        <div>
          <label htmlFor="name" className={lbl}>
            Nama
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className={field}
            placeholder="Nama Anda"
          />
        </div>

        <div>
          <label htmlFor="email" className={lbl}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={field}
            placeholder="nama@contoh.com"
          />
        </div>

        <div>
          <label htmlFor="message" className={lbl}>
            Pesan
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={5000}
            className={`${field} resize-y`}
            placeholder="Ceritakan hal yang ingin Anda diskusikan…"
          />
          <p className="mt-1 text-xs text-slate-500">
            Maksimal 5.000 karakter.
          </p>
        </div>

        {/* Honeypot anti-spam */}
        <div
          aria-hidden="true"
          className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Biarkan kosong</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-2">
          {siteKey ? (
            <div ref={widgetRef} />
          ) : (
            <p className="text-sm text-amber-600">
              Verifikasi keamanan belum dikonfigurasi.
            </p>
          )}
        </div>

        <button
          type="submit"
          className={btnPri}
          disabled={state === "sending" || !siteKey}
        >
          {state === "sending" ? "Mengirim pesan…" : "Kirim pesan"}
        </button>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-r-lg border-l-4 px-3 py-3 text-sm ${noticeStyle}`}
          >
            <p>{message.text}</p>

            {(state === "error" || state === "notConfigured") && to && (
              <p className="mt-2">
                Alternatif:{" "}
                <a
                  className="font-semibold underline underline-offset-2"
                  href={`mailto:${to}`}
                >
                  kirim langsung ke {to}
                </a>
                .
              </p>
            )}
          </div>
        )}
      </form>
    </>
  );
}
