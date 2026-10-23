# Linux Lab Portfolio — Next.js

Portofolio IT Support / Linux System Administration dengan modul hands-on, halaman skenario, dan terminal Ubuntu simulasi di browser.

## Jalankan secara lokal

Pastikan Node.js versi yang didukung Next.js tersedia, lalu jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Untuk build produksi:

```bash
npm run build
npm start
```

## Resume dan profil profesional

- Halaman resume visual tersedia pada `/resume` dan mengikuti identitas visual terminal hijau-hitam situs.
- Tombol **Download CV PDF** mengunduh berkas `public/resume.pdf` yang digunakan pada tautan resume.
- Konten resume dan About dikelola melalui `data/resume.js`; data profil, kontak, keterampilan lab, dan skenario modul berada di `data/lab.js`.
- Informasi kontak dan tautan profil berasal dari CV yang disertakan. Perbarui `data/lab.js` jika informasi tersebut berubah.

## Terminal simulasi

- Klik **Bash Ubuntu** di header, atau klik **Praktikkan di Bash Ubuntu** pada halaman modul.
- Terminal memakai `@xterm/xterm` untuk tampilan terminal browser dan `@xterm/addon-fit` untuk menyesuaikan ukuran terminal.
- Parser perintah terletak di `lib/terminal-simulator.js`. Respons perintah, file, permission, service, firewall, dan sebagian status jaringan adalah data mock di memori browser.
- Pilih modul dari panel **Konteks modul**. Terminal memuat kondisi awal dan command latihan yang sesuai.
- Klik **Reset lab** untuk mengembalikan filesystem dan service tiruan ke kondisi awal.

**Batasan keamanan:** terminal ini bukan Bash sungguhan dan tidak terhubung ke server, sistem operasi, disk, atau VM. Perintah tidak dieksekusi di server; simulator hanya memproses perintah yang terdaftar dan mengubah state tiruan. Untuk memvalidasi perintah Linux secara nyata, jalankan pada Ubuntu Server VM yang Anda kendalikan.

## Personalisasi

- Profil: `data/lab.js` → objek `profile`.
- Kompetensi, metrik, sertifikasi, rekomendasi, dan resume: `data/portfolio.js`.
- Modul dan perintah langkah: `data/lab.js`.
- Tampilan dan perilaku terminal: `app/components/TerminalWorkbench.jsx` serta `lib/terminal-simulator.js`.
- Resume: letakkan PDF di `public/resume.pdf`.

Sertifikasi dan rekomendasi sengaja dikosongkan sampai ada data asli yang bisa diverifikasi.

## Contact form email delivery

The contact form sends messages through the server-side `/api/contact` route using the Resend REST API. The recipient defaults to the email in `data/lab.js` (`bagasaanardi@gmail.com` at the time this README was written); `CONTACT_TO_EMAIL` can override it. The Resend secret is only read on the server and must never use a `NEXT_PUBLIC_` prefix.

1. Create a Resend account and an API key.
2. Verify the sender domain/address in Resend. Set `CONTACT_FROM_EMAIL` to that verified sender.
3. Copy `.env.example` to `.env.local` for local development, then fill in the real values.
4. In Vercel, open **Project → Settings → Environment Variables** and add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and optionally `CONTACT_TO_EMAIL`. Enable the variables for Production (and Preview if needed), then redeploy.
5. Submit a test message from the deployed site and confirm it arrives at the recipient inbox. Also check spam and Resend email logs if it does not arrive.

Example values (replace placeholders; do not commit secrets):

```dotenv
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Bagas Portfolio <portfolio@your-verified-domain.com>
CONTACT_TO_EMAIL=bagasaanardi@gmail.com
```

Until `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are configured, the API deliberately reports that email delivery is not enabled and the form provides a direct `mailto:` fallback. The endpoint validates submissions, limits repeated requests per runtime instance, and uses a hidden honeypot field; this in-memory limit is a lightweight safeguard, not a substitute for a dedicated rate-limiting service.

## Blog

The `/blog` page contains practical lab notes on Linux service troubleshooting, file permissions, and layered network diagnostics. The posts are written as learning material from lab scenarios and should not be read as claims of production incident experience.
