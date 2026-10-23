// Isi bagian ini dengan data Anda. Dipakai oleh halaman /about dan /resume.
export const about = {
  headline: 'IT Support yang belajar administrasi Linux dengan mempraktikkannya.',
  paragraphs: [
    'Saya membangun server Ubuntu di VirtualBox untuk melatih pekerjaan harian seorang administrator: mengatur user dan permission, menjaga service tetap berjalan, membaca log, mengamankan akses, sampai menulis laporan insiden.',
    'Setiap modul di portofolio ini berisi perintah yang saya jalankan, hasil yang diharapkan, dan peringatan yang saya temui saat mengerjakannya, supaya orang lain bisa mengulang dan memeriksanya.',
  ],
  principles: [
    ['Snapshot dulu', 'Setiap eksperimen yang bisa merusak konfigurasi dimulai dari snapshot VM.'],
    ['Catat hasilnya', 'Perintah tanpa keluaran yang diharapkan sulit diverifikasi, jadi keduanya ditulis bersama.'],
    ['Laporkan masalah', 'Diagnosis belum selesai sebelum ada laporan yang bisa dibaca orang lain.'],
  ],
}

export const resume = {
  summary: 'IT Support level intermediate dengan pengalaman lab administrasi Linux: Ubuntu Server, jaringan dasar, firewall, service management, backup, dan penanganan insiden.',
  experience: [
    {
      role: 'Linux System Administration Lab',
      org: 'Proyek mandiri · Ubuntu Server di VirtualBox',
      period: 'Proyek portofolio',
      points: [
        'Membangun VM Ubuntu Server dengan akses SSH dan jaringan host-only.',
        'Mengerjakan 12 modul: user dan permission, jaringan, systemd, journalctl, UFW, storage, proses, paket, backup, dan troubleshooting.',
        'Menyelesaikan skenario capstone berisi tiga masalah sekaligus, lalu menulis laporan insiden.',
      ],
    },
    {
      role: 'Posisi / jabatan Anda',
      org: 'Nama perusahaan · isi di data/resume.js',
      period: 'Tahun – Tahun',
      points: ['Tuliskan tanggung jawab atau hasil kerja yang bisa diukur.'],
    },
  ],
  education: [
    { title: 'Pendidikan terakhir', org: 'Nama institusi · isi di data/resume.js', period: 'Tahun – Tahun' },
  ],
  certifications: [],
}
