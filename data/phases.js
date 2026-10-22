// Pengelompokan modul per fase. Ubah id di sini jika urutan modul berubah.
export const phases = [
  {
    name: "Pendahuluan",
    note: "VM, akses user, dan jaringan",
    ids: ["persiapan", "user", "jaringan"],
  },
  {
    name: "Layanan dan keamanan",
    note: "Service, log, dan firewall",
    ids: ["systemctl", "journalctl", "ufw"],
  },
  {
    name: "Operasional harian",
    note: "Disk, proses, paket, dan backup",
    ids: ["storage", "proses", "paket", "backup"],
  },
  {
    name: "Penanganan insiden",
    note: "Diagnosis dan pelaporan",
    ids: ["troubleshooting", "capstone"],
  },
];
