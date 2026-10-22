// Ganti IP 192.168.56.101 dengan IP VM Anda (lihat: ip -br a)
export const modules = [
  {
    id: "persiapan",
    title: "Persiapan VM",
    goal: "Memasang Ubuntu Server di VirtualBox dan menyiapkan akses SSH dari komputer host.",
    steps: [
      {
        t: "Buat VM baru",
        d: "Di VirtualBox, klik New. Nama ubuntu-lab, tipe Linux, versi Ubuntu (64-bit). Alokasi 2048 MB RAM, 2 CPU, dan disk 20 GB, lalu pilih ISO Ubuntu Server.",
      },
      {
        t: "Atur jaringan VM",
        d: "Buka Settings > Network. Adapter 1 diatur ke NAT untuk akses internet. Adapter 2 diatur ke Host-only Adapter agar komputer host bisa masuk ke VM lewat SSH.",
      },
      {
        t: "Instal Ubuntu Server",
        d: "Ikuti installer, buat user pertama, dan centang Install OpenSSH server.",
        warn: "Catat username dan password. Keduanya dipakai di semua modul berikutnya.",
      },
      {
        t: "Login dan update paket",
        d: "Setelah reboot, login lewat console VM lalu perbarui sistem.",
        cmd: "sudo apt update\nsudo apt upgrade -y",
      },
      {
        t: "Cek alamat IP",
        d: "Cari IP pada adapter host-only, biasanya di rentang 192.168.56.x.",
        cmd: "ip -br a",
        out: "Contoh: enp0s8  UP  192.168.56.101/24",
      },
      {
        t: "Buat snapshot",
        d: "Pilih Machine > Take Snapshot dan beri nama clean-install. Snapshot ini dipakai untuk mengembalikan VM jika lab rusak.",
      },
    ],
  },
  {
    id: "user",
    title: "User, group, dan permission",
    goal: "Membuat user dan group, lalu mengatur akses baca dan tulis pada direktori bersama.",
    steps: [
      {
        t: "Buat group",
        d: "Group dipakai untuk memberi hak akses ke beberapa user sekaligus.",
        cmd: "sudo groupadd devops",
      },
      {
        t: "Buat user",
        d: "adduser akan meminta password dan beberapa data opsional.",
        cmd: "sudo adduser budi\nsudo adduser tamu",
      },
      {
        t: "Tambahkan user ke group",
        d: "Opsi -aG menambah group tanpa melepas group lain.",
        cmd: "sudo usermod -aG devops budi\nid budi\ngetent group devops",
        out: "id budi harus menampilkan devops di daftar groups.",
        warn: "Jangan lupa opsi -a. Tanpa opsi itu, user dikeluarkan dari semua group tambahan yang dimilikinya.",
      },
      {
        t: "Buat direktori bersama",
        d: "Mode 2770 memakai setgid, sehingga file baru otomatis dimiliki group devops. User di luar group tidak punya akses.",
        cmd: "sudo mkdir /srv/proyek\nsudo chown root:devops /srv/proyek\nsudo chmod 2770 /srv/proyek\nls -ld /srv/proyek",
        out: "drwxrws--- 2 root devops ... /srv/proyek",
      },
      {
        t: "Uji akses",
        d: "budi (anggota devops) harus bisa menulis, sedangkan tamu harus ditolak.",
        cmd: "sudo -u budi touch /srv/proyek/tes.txt\nsudo -u tamu ls /srv/proyek",
        out: "Perintah kedua: Permission denied.",
      },
      {
        t: "Membaca mode permission",
        d: "Nilai rwx dihitung 4+2+1. Mode 750 berarti owner rwx, group r-x, dan other tanpa akses.",
        cmd: "touch skrip.sh\nchmod 750 skrip.sh\nls -l skrip.sh",
      },
    ],
  },
  {
    id: "jaringan",
    title: "IP, DNS, routing, dan SSH",
    goal: "Memeriksa konfigurasi jaringan, membedakan masalah routing dari masalah DNS, dan mengamankan SSH dengan key.",
    steps: [
      {
        t: "Cek IP dan route",
        d: "Baris default via menunjukkan gateway untuk keluar dari jaringan lokal.",
        cmd: "ip -br a\nip route",
        out: "Cari baris: default via 10.0.2.2 dev enp0s3",
      },
      {
        t: "Cek DNS",
        d: "systemd-resolved menyimpan daftar DNS server yang dipakai VM.",
        cmd: "resolvectl status\nresolvectl query ubuntu.com",
      },
      {
        t: "Bedakan masalah routing dan DNS",
        d: "Jika ping ke IP berhasil tetapi ping ke nama gagal, masalahnya di DNS. Jika keduanya gagal, cek routing atau adapter.",
        cmd: "ping -c 3 8.8.8.8\nping -c 3 ubuntu.com",
      },
      {
        t: "Telusuri jalur paket",
        d: "tracepath menampilkan setiap hop menuju tujuan.",
        cmd: "tracepath ubuntu.com",
      },
      {
        t: "Cek service SSH",
        d: "Statusnya harus active (running).",
        cmd: "systemctl status ssh",
      },
      {
        t: "Login dari komputer host",
        d: "Jalankan di terminal host, bukan di VM.",
        cmd: "ssh budi@192.168.56.101",
      },
      {
        t: "Buat dan kirim SSH key",
        d: "Jalankan di host. Setelah key terpasang, login tidak lagi meminta password.",
        cmd: "ssh-keygen -t ed25519\nssh-copy-id budi@192.168.56.101",
      },
      {
        t: "Matikan login password",
        d: "Di /etc/ssh/sshd_config, ubah PasswordAuthentication menjadi no. Validasi konfigurasi sebelum reload.",
        cmd: "sudo nano /etc/ssh/sshd_config\nsudo sshd -t\nsudo systemctl reload ssh",
        warn: "Pastikan login dengan key sudah berhasil di terminal lain sebelum langkah ini. Jika belum, akses SSH akan terkunci (console VirtualBox tetap bisa dipakai).",
      },
    ],
  },
  {
    id: "systemctl",
    title: "Service dengan systemctl",
    goal: "Menjalankan, menghentikan, dan mengatur service agar aktif otomatis saat boot.",
    steps: [
      {
        t: "Instal nginx",
        d: "nginx dipakai sebagai service contoh di modul log, firewall, dan troubleshooting.",
        cmd: "sudo apt install -y nginx",
      },
      {
        t: "Cek status",
        d: "Baca baris Active, Loaded (enabled atau disabled), dan Main PID.",
        cmd: "systemctl status nginx\nsystemctl is-active nginx\nsystemctl is-enabled nginx",
      },
      {
        t: "Start, stop, restart, dan reload",
        d: "Gunakan reload jika hanya konfigurasi yang berubah, karena koneksi yang sedang berjalan tidak terputus.",
        cmd: "sudo systemctl stop nginx\nsudo systemctl start nginx\nsudo systemctl restart nginx\nsudo systemctl reload nginx",
      },
      {
        t: "Atur autostart",
        d: "enable mengaktifkan service saat boot, disable menonaktifkannya.",
        cmd: "sudo systemctl disable nginx\nsudo systemctl enable nginx",
      },
      {
        t: "Tes respons web",
        d: "nginx harus membalas dengan status 200 dan menyajikan halaman Welcome to nginx.",
        cmd: "curl -I http://localhost",
        out: "HTTP/1.1 200 OK",
      },
      {
        t: "Lihat unit file dan service yang gagal",
        d: "Unit file berisi cara systemd menjalankan service.",
        cmd: "systemctl cat nginx\nsystemctl list-units --type=service --state=failed",
      },
    ],
  },
  {
    id: "journalctl",
    title: "Analisis log dengan journalctl",
    goal: "Membaca, menyaring, dan mengikuti log sistem untuk mencari penyebab masalah.",
    steps: [
      {
        t: "Log satu service",
        d: "Opsi -u memfilter berdasarkan unit, -n membatasi jumlah baris.",
        cmd: "journalctl -u nginx -n 20 --no-pager",
      },
      {
        t: "Filter berdasarkan waktu",
        d: "Waktu bisa berupa jam, tanggal, atau ekspresi relatif.",
        cmd: 'journalctl -u ssh --since "30 min ago"\njournalctl --since today --until "1 hour ago"',
      },
      {
        t: "Tampilkan error saja",
        d: "Opsi -p err menampilkan level error ke atas, -b membatasi pada boot saat ini.",
        cmd: "journalctl -p err -b",
      },
      {
        t: "Ikuti log secara langsung",
        d: "Jalankan curl di terminal lain untuk memicu entri baru. Keluar dengan Ctrl+C.",
        cmd: "journalctl -u nginx -f",
      },
      {
        t: "Cari login SSH yang gagal",
        d: "Dipakai untuk mendeteksi percobaan login yang mencurigakan.",
        cmd: 'journalctl -u ssh | grep "Failed password"',
      },
      {
        t: "Cek ukuran log",
        d: "Journal dapat memenuhi disk jika tidak dibatasi. Gunakan vacuum untuk memangkasnya.",
        cmd: "journalctl --disk-usage\nsudo journalctl --vacuum-size=200M",
      },
    ],
  },
  {
    id: "ufw",
    title: "Firewall dengan UFW",
    goal: "Menutup semua port masuk kecuali yang dibutuhkan, tanpa memutus sesi SSH.",
    steps: [
      {
        t: "Cek status awal",
        d: "UFW sudah terpasang di Ubuntu tetapi belum aktif.",
        cmd: "sudo ufw status verbose",
        out: "Status: inactive",
      },
      {
        t: "Atur kebijakan default",
        d: "Tolak semua koneksi masuk dan izinkan semua koneksi keluar.",
        cmd: "sudo ufw default deny incoming\nsudo ufw default allow outgoing",
      },
      {
        t: "Izinkan SSH",
        d: "Langkah ini harus dilakukan sebelum UFW diaktifkan.",
        cmd: "sudo ufw allow OpenSSH",
        warn: "Mengaktifkan UFW tanpa aturan SSH akan memutus sesi SSH yang sedang berjalan.",
      },
      {
        t: "Izinkan HTTP",
        d: "Buka port 80 untuk nginx.",
        cmd: "sudo ufw allow 80/tcp",
      },
      {
        t: "Aktifkan UFW",
        d: "Jawab y pada konfirmasi.",
        cmd: "sudo ufw enable\nsudo ufw status numbered",
      },
      {
        t: "Batasi sumber akses",
        d: "Contoh: SSH hanya diizinkan dari jaringan host-only. Cek nomor aturan SSH yang lama dengan ufw status numbered, lalu hapus.",
        cmd: "sudo ufw allow from 192.168.56.0/24 to any port 22 proto tcp\nsudo ufw delete 1",
      },
      {
        t: "Tes dari komputer host",
        d: "Port 80 harus terbuka dan port lain ditolak. Jalankan di terminal host.",
        cmd: "curl -I http://192.168.56.101",
      },
      {
        t: "Aktifkan logging",
        d: "Paket yang diblokir tercatat dan bisa dibaca lewat journalctl.",
        cmd: 'sudo ufw logging on\njournalctl -k | grep "UFW BLOCK"',
      },
    ],
  },
  {
    id: "storage",
    title: "Disk dan storage",
    goal: "Menangani keluhan disk penuh, lalu menambah disk baru dan me-mount-nya secara permanen.",
    steps: [
      {
        t: "Cek pemakaian disk dan inode",
        d: "Lihat kolom Use%. Disk bisa penuh karena inode habis, walau kapasitas masih tersisa.",
        cmd: "df -h\ndf -i",
      },
      {
        t: "Cari direktori terbesar",
        d: "Opsi -x menjaga pencarian di satu filesystem. Ulangi ke dalam direktori yang paling besar.",
        cmd: "sudo du -xh /var --max-depth=1 | sort -rh | head",
      },
      {
        t: "Cari file besar",
        d: "Cari file di atas 100 MB.",
        cmd: "sudo find / -xdev -type f -size +100M -exec ls -lh {} + 2>/dev/null",
      },
      {
        t: "Tambah disk virtual",
        d: "Matikan VM, lalu di VirtualBox buka Settings > Storage dan tambahkan hard disk baru 5 GB. Nyalakan kembali VM.",
        cmd: "lsblk",
        out: "Disk baru muncul sebagai sdb tanpa partisi.",
      },
      {
        t: "Partisi, format, dan mount",
        d: "Buat partisi GPT, format ke ext4, lalu mount ke /mnt/data.",
        cmd: "sudo parted /dev/sdb --script mklabel gpt mkpart data ext4 0% 100%\nsudo mkfs.ext4 /dev/sdb1\nsudo mkdir /mnt/data\nsudo mount /dev/sdb1 /mnt/data\ndf -h /mnt/data",
        warn: "Pastikan /dev/sdb memang disk baru lewat lsblk. mkfs menghapus seluruh isi partisi.",
      },
      {
        t: "Mount permanen lewat fstab",
        d: "Ambil UUID dengan blkid dan ganti GANTI_UUID pada perintah. Uji dengan mount -a sebelum reboot.",
        cmd: 'sudo blkid /dev/sdb1\necho "UUID=GANTI_UUID /mnt/data ext4 defaults 0 2" | sudo tee -a /etc/fstab\nsudo mount -a',
        warn: "Baris fstab yang salah bisa membuat boot gagal. Jika mount -a menampilkan error, perbaiki dulu.",
      },
    ],
  },
  {
    id: "proses",
    title: "Proses dan resource",
    goal: "Menemukan proses yang membuat server lambat dan menghentikannya dengan aman.",
    steps: [
      {
        t: "Cek ringkasan resource",
        d: "Jika load average lebih tinggi dari jumlah CPU, proses mulai mengantre.",
        cmd: "uptime\nfree -h\nnproc",
      },
      {
        t: "Pantau secara langsung",
        d: "Di dalam top: P mengurutkan berdasarkan CPU, M berdasarkan memori, q untuk keluar.",
        cmd: "top",
      },
      {
        t: "Daftar proses terbesar",
        d: "ps cocok untuk cuplikan sesaat yang bisa disalin ke laporan.",
        cmd: "ps aux --sort=-%mem | head -5\nps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu | head -5",
      },
      {
        t: "Simulasi beban CPU",
        d: "Perintah yes di background menghabiskan satu core.",
        cmd: "yes > /dev/null &\ntop -bn1 | head -12",
        out: "Proses yes memakai sekitar 100% CPU.",
      },
      {
        t: "Hentikan proses",
        d: "kill mengirim SIGTERM sehingga proses sempat berhenti dengan rapi. Pakai kill -9 hanya jika proses tidak merespons.",
        cmd: 'pgrep -a yes\nkill $(pgrep yes)\npgrep yes || echo "sudah berhenti"',
      },
      {
        t: "Cek tekanan memori",
        d: "Kernel mencatat kejadian OOM saat memori habis dan proses dimatikan paksa.",
        cmd: 'journalctl -k | grep -i "out of memory"\nvmstat 1 5',
      },
    ],
  },
  {
    id: "paket",
    title: "Manajemen paket",
    goal: "Memasang, mengunci versi, dan memperbarui paket dengan aman, termasuk memperbaiki paket yang rusak.",
    steps: [
      {
        t: "Cari dan lihat info paket",
        d: "Cek deskripsi dan ukuran paket sebelum memasangnya.",
        cmd: "apt search htop\napt show htop",
      },
      {
        t: "Instal dan hapus",
        d: "autoremove membersihkan dependensi yang tidak lagi dipakai.",
        cmd: "sudo apt install -y htop\nsudo apt remove htop\nsudo apt autoremove -y",
      },
      {
        t: "Cek versi dan isi paket",
        d: "apt policy menampilkan versi terpasang beserta repository asalnya.",
        cmd: "apt policy nginx\ndpkg -l | grep nginx\ndpkg -L nginx | head",
      },
      {
        t: "Kunci versi paket",
        d: "Dipakai saat versi baru diketahui bermasalah dengan aplikasi.",
        cmd: "sudo apt-mark hold nginx\napt-mark showhold\nsudo apt-mark unhold nginx",
      },
      {
        t: "Aktifkan update keamanan otomatis",
        d: "Pilih Yes pada dialog yang muncul.",
        cmd: "sudo apt install -y unattended-upgrades\nsudo dpkg-reconfigure -plow unattended-upgrades\nsystemctl status unattended-upgrades",
      },
      {
        t: "Perbaiki paket rusak",
        d: "Jalankan saat instalasi terputus atau dpkg melaporkan error.",
        cmd: "sudo dpkg --configure -a\nsudo apt --fix-broken install",
      },
    ],
  },
  {
    id: "backup",
    title: "Cron dan backup",
    goal: "Membuat backup terjadwal dan membuktikan hasilnya bisa dipulihkan.",
    steps: [
      {
        t: "Buat data contoh",
        d: "Buat direktori sumber dan tujuan, lalu isi sumber dengan satu file.",
        cmd: 'mkdir -p ~/data-uji ~/backup\necho "dokumen penting" > ~/data-uji/catatan.txt',
      },
      {
        t: "Backup dengan tar",
        d: "Nama arsip memuat tanggal supaya mudah dibedakan. Opsi -tzf menampilkan isi arsip.",
        cmd: "tar -czf ~/backup/data-$(date +%F).tar.gz -C ~ data-uji\ntar -tzf ~/backup/data-$(date +%F).tar.gz",
      },
      {
        t: "Sinkronisasi dengan rsync",
        d: "Garis miring di akhir path sumber berarti isi direktori yang disalin, bukan direktorinya.",
        cmd: "rsync -av --delete ~/data-uji/ ~/backup/mirror/",
        warn: "Opsi --delete menghapus file di tujuan yang tidak ada di sumber. Periksa dulu arah sumber dan tujuan.",
      },
      {
        t: "Jadwalkan dengan cron",
        d: "Buka crontab dan tambahkan baris berikut. Backup berjalan setiap hari pukul 02:00. Di crontab, karakter % harus diberi garis miring terbalik (\\%).",
        cmd: "crontab -e\ncrontab -l",
        tpl: "0 2 * * * tar -czf $HOME/backup/data-$(date +\\%F).tar.gz -C $HOME data-uji",
      },
      {
        t: "Uji restore",
        d: "Backup baru bisa dianggap valid setelah proses restore-nya berhasil diuji.",
        cmd: 'mkdir ~/restore\ntar -xzf ~/backup/data-$(date +%F).tar.gz -C ~/restore\ndiff -r ~/data-uji ~/restore/data-uji && echo "Restore OK"',
        out: "Restore OK",
      },
      {
        t: "Pastikan cron berjalan",
        d: "Cek log eksekusi dan daftar timer systemd.",
        cmd: "journalctl -u cron --since today\nsystemctl list-timers",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting service gagal",
    goal: "Merusak nginx dengan sengaja, lalu mendiagnosis dan memperbaikinya secara berurutan.",
    steps: [
      {
        t: "Buat kerusakan: konfigurasi salah",
        d: "Tambahkan file konfigurasi yang tidak valid, lalu restart nginx.",
        cmd: 'echo "baris_salah;" | sudo tee /etc/nginx/conf.d/rusak.conf\nsudo systemctl restart nginx',
        out: "Job for nginx.service failed ...",
      },
      {
        t: "Langkah 1: cek status",
        d: "Lihat baris Active, kode exit, dan log terakhir.",
        cmd: "systemctl status nginx",
      },
      {
        t: "Langkah 2: baca log lengkap",
        d: "Opsi -x menambahkan penjelasan, -e langsung menuju akhir log.",
        cmd: "journalctl -xeu nginx",
      },
      {
        t: "Langkah 3: uji konfigurasi",
        d: "nginx -t menunjukkan file dan nomor baris yang salah.",
        cmd: "sudo nginx -t",
        out: 'unknown directive "baris_salah" in /etc/nginx/conf.d/rusak.conf:1',
      },
      {
        t: "Langkah 4: perbaiki dan verifikasi",
        d: "Hapus file bermasalah, uji ulang konfigurasi, lalu jalankan service.",
        cmd: "sudo rm /etc/nginx/conf.d/rusak.conf\nsudo nginx -t\nsudo systemctl restart nginx\ncurl -I http://localhost",
      },
      {
        t: "Skenario 2: port bentrok",
        d: "Jalankan server lain di port 80, lalu start nginx. Cari proses yang memakai port itu.",
        cmd: "sudo systemctl stop nginx\nsudo python3 -m http.server 80 &\nsudo systemctl start nginx\nsudo ss -tlnp | grep :80",
        out: "Log nginx menyebut: bind() to 0.0.0.0:80 failed (98: Address already in use)",
      },
      {
        t: "Bersihkan skenario 2",
        d: "Hentikan proses penyebab bentrok, lalu jalankan nginx kembali.",
        cmd: 'sudo pkill -f "http.server 80"\nsudo systemctl restart nginx\nsystemctl is-active nginx',
        out: "active",
      },
      {
        t: "Checklist umum",
        d: "Urutan yang bisa dipakai untuk masalah service apa pun: status, journalctl -u, uji konfigurasi, cek port (ss -tlnp), permission file, firewall (ufw status), dan disk (df -h).",
        cmd: "df -h\nss -tlnp\nsudo ufw status",
      },
    ],
  },
  {
    id: "capstone",
    title: "Capstone: server warisan",
    goal: "Skenario gabungan seperti tiket nyata: tiga masalah muncul bersamaan. Diagnosis, perbaiki, lalu tulis laporan insiden.",
    steps: [
      {
        t: "Siapkan skenario",
        d: "Jalankan hanya di VM lab. Skrip ini merusak konfigurasi nginx, memblokir port 80, dan membuat file besar. Setelah selesai, anggap isinya tidak diketahui.",
        cmd: 'sudo apt install -y nginx\necho "baris_salah;" | sudo tee /etc/nginx/conf.d/rusak.conf\nsudo fallocate -l 1G /var/tmp/log-lama.bin\nsudo ufw allow OpenSSH\nsudo ufw --force enable\nsudo systemctl restart nginx',
        warn: "Kembalikan VM ke snapshot clean-install setelah selesai.",
      },
      {
        t: "Baca tiket dan tentukan prioritas",
        d: "Tiket 101: Website perusahaan tidak bisa diakses sejak pagi. Catat gejala, waktu mulai, dan dampaknya. Prioritas ditentukan dari jumlah pengguna yang terdampak dan ada tidaknya solusi sementara.",
      },
      {
        t: "Diagnosis dari lapisan bawah",
        d: "Periksa service, konfigurasi, firewall, lalu disk. Catat setiap temuan beserta perintahnya.",
        cmd: "systemctl is-active nginx\nsudo nginx -t\nsudo ufw status\ndf -h\njournalctl -u nginx -n 20 --no-pager",
      },
      {
        t: "Perbaiki satu per satu",
        d: "Ubah satu hal dalam satu waktu dan uji setelah tiap perubahan. Verifikasi akhir dilakukan dari komputer host.",
        cmd: "sudo rm /etc/nginx/conf.d/rusak.conf\nsudo nginx -t && sudo systemctl restart nginx\nsudo ufw allow 80/tcp\nsudo rm /var/tmp/log-lama.bin\ncurl -I http://192.168.56.101",
        out: "HTTP/1.1 200 OK",
      },
      {
        t: "Tulis laporan insiden",
        d: "Gunakan format berikut dan isi dengan data dari log serta perintah yang dijalankan.",
        tpl: "Insiden      : Website tidak dapat diakses (Tiket 101)\nDampak       : siapa yang terdampak dan sejak kapan\nLinimasa     : jam tiket masuk, jam diagnosis, jam perbaikan, jam verifikasi\nAkar masalah : 1) konfigurasi nginx tidak valid\n               2) port 80 diblokir UFW\n               3) file besar tidak terpakai di /var/tmp\nPerbaikan    : perintah dan hasil tiap langkah\nPencegahan   : jalankan nginx -t sebelum restart, tinjau aturan UFW, pasang alert disk",
      },
      {
        t: "Simpan sebagai bukti kerja",
        d: "Ambil screenshot output tiap langkah dan simpan laporan insiden di repo GitHub. Cantumkan tautan repo di CV dan profil LinkedIn.",
      },
    ],
  },
];

export const profile = {
  name: "Bagas Anardi",
  role: "IT Support",
  github: "https://github.com/anardi",
  linkedin: "https://www.linkedin.com/in/bagas-anardi/",
  email: "bagasadriant@gmail.com",
  phone: "+62 812-3456-7890",
};
export const skills = {
  persiapan: ["VirtualBox", "Instalasi Ubuntu Server", "Snapshot"],
  user: ["User dan group", "chmod dan chown", "setgid"],
  jaringan: ["TCP/IP", "DNS", "Routing", "SSH key"],
  systemctl: ["systemd", "Manajemen service"],
  journalctl: ["Analisis log", "journalctl"],
  ufw: ["Firewall", "UFW"],
  storage: ["df dan du", "Partisi dan mount", "fstab"],
  proses: ["top dan ps", "Monitoring resource", "kill"],
  paket: ["apt dan dpkg", "Patch management"],
  backup: ["cron", "tar dan rsync", "Uji restore"],
  troubleshooting: ["Root cause analysis", "nginx"],
  capstone: ["Penanganan insiden", "Laporan insiden", "Prioritas tiket"],
};
