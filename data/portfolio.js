// Konten landing page. Edit di sini, tidak perlu menyentuh komponen.
export const resume = '/resume.pdf' // simpan file PDF Anda di public/resume.pdf

export const metrics = [
  { value: '12+', label: 'Hands-on Modules', note: 'Dari persiapan VM sampai troubleshooting insiden' },
  { value: '4', label: 'Core Areas', note: 'Linux, networking, security, dan troubleshooting' },
  { value: '2', label: 'Practice Modes', note: 'Walkthrough modul dan terminal simulasi browser' },
]

export const competencies = [
  { n: '01', id: 'user', title: 'Linux Administration', hl: true, tags: ['systemd', 'chmod', 'apt', 'cron'],
    desc: 'User, group, permission, service systemd, manajemen paket, dan backup terjadwal di Ubuntu Server.' },
  { n: '02', id: 'jaringan', title: 'Networking & Security', tags: ['SSH key', 'UFW', 'DNS'],
    desc: 'IP, DNS, routing, SSH berbasis key, dan firewall UFW dengan pembatasan sumber akses.' },
  { n: '03', id: 'persiapan', title: 'Cloud & Virtualization', tags: ['VirtualBox', 'Snapshot'],
    desc: 'VM di VirtualBox dengan NAT dan host-only, snapshot, serta penambahan disk virtual.' },
  { n: '04', id: 'troubleshooting', title: 'Troubleshooting Log', log: true, tags: ['journalctl', 'nginx', 'RCA'],
    desc: 'Diagnosis berurutan lewat status, log, dan uji konfigurasi, ditutup dengan laporan insiden.' },
]

export const workflow = [
  { t: 'Problem', d: 'Catat gejala, waktu mulai, dan dampak. Cek status service sebelum mengubah apa pun.', cmd: 'systemctl status nginx' },
  { t: 'Root Cause', d: 'Baca log dan uji konfigurasi sampai ketemu file dan baris yang salah.', cmd: 'journalctl -xeu nginx\nsudo nginx -t' },
  { t: 'Fix', d: 'Ubah satu hal, uji ulang, lalu verifikasi dari sisi pengguna.', cmd: 'sudo nginx -t && sudo systemctl restart nginx\ncurl -I http://localhost' },
]

// Isi hanya jika benar-benar memiliki sertifikat yang dapat diverifikasi.
export const certs = []

// Isi hanya dengan rekomendasi asli yang telah mendapat izin untuk dipublikasikan.
export const testimonials = []

// re = pola (regex) yang dicocokkan ke isi modul untuk filter tag
export const filters = [
  { label: 'UFW', re: 'ufw' },
  { label: 'Nginx', re: 'nginx' },
  { label: 'Bash', re: '\\b(bash|grep|rsync|tar|crontab)\\b' },
  { label: 'SSH', re: 'ssh' },
  { label: 'systemd', re: 'systemctl|journalctl|systemd' },
]
