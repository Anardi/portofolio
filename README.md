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
