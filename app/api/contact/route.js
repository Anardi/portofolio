export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12 * 1024;
function getAllowedTurnstileHostnames() {
  return new Set(
    (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
}

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readBodyLimited(request) {
  if (!request.body) {
    throw new Error("empty_body");
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    totalBytes += value.byteLength;

    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("body_too_large");
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(body);
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function cleanLine(value) {
  return value.replace(/[\r\n\u0000-\u001f\u007f]+/g, " ").trim();
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSameOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token, request, secret, testMode) {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP");

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) return false;

    const result = await response.json();

    if (result.success !== true) return false;

    const expectedAction = testMode ? "test" : "contact";

    if (result.action !== expectedAction) return false;

    const hostname =
      typeof result.hostname === "string" ? result.hostname.toLowerCase() : "";

    if (!testMode && !getAllowedTurnstileHostnames().has(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  // Only accept same-origin form submissions.
  if (!isSameOrigin(request)) {
    return json(
      {
        ok: false,
        code: "invalid_origin",
      },
      403,
    );
  }

  // Require JSON.
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return json(
      {
        ok: false,
        code: "invalid_content_type",
      },
      415,
    );
  }

  // Reject oversized requests.
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return json(
      {
        ok: false,
        code: "request_too_large",
      },
      413,
    );
  }

  let payload;

  try {
    const rawBody = await readBodyLimited(request);
    payload = JSON.parse(rawBody);
  } catch (error) {
    if (error.message === "body_too_large") {
      return json(
        {
          ok: false,
          code: "request_too_large",
        },
        413,
      );
    }

    return json(
      {
        ok: false,
        code: "invalid_json",
      },
      400,
    );
  }

  const name = typeof payload?.name === "string" ? cleanLine(payload.name) : "";

  const email = typeof payload?.email === "string" ? payload.email.trim() : "";

  const message =
    typeof payload?.message === "string" ? payload.message.trim() : "";

  const honeypot = typeof payload?.website === "string" ? payload.website : "";

  const turnstileToken = payload?.turnstileToken;

  // Silently ignore simple automated submissions.
  if (honeypot) {
    return json({ ok: true, ignored: true });
  }

  if (
    name.length < 2 ||
    name.length > 80 ||
    !validEmail(email) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return json(
      {
        ok: false,
        code: "invalid_fields",
      },
      400,
    );
  }

  const testMode = process.env.TURNSTILE_TEST_MODE === "true";
  const contactEnabled = process.env.CONTACT_ENABLED === "true";
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    return json(
      {
        ok: false,
        code: "turnstile_not_configured",
      },
      503,
    );
  }

  // Never allow test keys to send real email.
  const previewMode = process.env.CONTACT_PREVIEW_MODE === "true";

  if (testMode || previewMode) {
    return json({
      ok: true,
      preview: true,
    });
  }

  const captchaValid = await verifyTurnstile(
    turnstileToken,
    request,
    turnstileSecret,
    testMode,
  );

  if (!captchaValid) {
    return json(
      {
        ok: false,
        code: "turnstile_invalid",
      },
      400,
    );
  }

  // Preview validates Turnstile but never sends email.
  if (testMode) {
    return json({
      ok: true,
      preview: true,
    });
  }

  // Production remains closed until explicitly enabled.
  if (!contactEnabled) {
    return json(
      {
        ok: false,
        code: "contact_disabled",
      },
      503,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return json(
      {
        ok: false,
        code: "email_service_not_configured",
      },
      503,
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  const subjectName =
    name.replace(/[^\p{L}\p{N} ._'-]/gu, "").slice(0, 60) || "Website visitor";

  const text = [
    "Pesan baru dari website portofolio",
    "",
    `Nama: ${name}`,
    `Email: ${email}`,
    "",
    "Pesan:",
    message,
  ].join("\n");

  const html = `
    <!doctype html>
    <html>
      <body style="font-family:Arial,sans-serif;line-height:1.6;color:#17211c">
        <h2>Pesan baru dari website portofolio</h2>
        <p><strong>Nama:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <hr>
        <p>${safeMessage}</p>
      </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact: ${subjectName}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      // Do not expose provider diagnostics or secrets.
      console.error("Resend request failed:", response.status);

      return json(
        {
          ok: false,
          code: "email_provider_error",
        },
        502,
      );
    }

    return json({ ok: true });
  } catch {
    return json(
      {
        ok: false,
        code: "email_provider_unavailable",
      },
      502,
    );
  }
}
