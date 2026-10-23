// Sesuaikan alamat IP contoh dengan alamat VM Anda; gunakan `ip -br a` untuk memeriksanya.
export const modules = [
  {
    id: "persiapan",
    title: "Persiapan Lingkungan Virtual",
    goal: "Menyiapkan Ubuntu Server pada VirtualBox serta mengonfigurasi koneksi jaringan dan akses SSH dari komputer host.",
    steps: [
      {
        t: "Buat mesin virtual baru",
        d: "Pada VirtualBox, pilih New dan beri nama `ubuntu-lab`. Pilih tipe Linux dengan versi Ubuntu (64-bit), alokasikan RAM 2 GB, 2 CPU, dan disk virtual 20 GB, lalu pilih berkas ISO Ubuntu Server.",
      },
      {
        t: "Konfigurasikan adapter jaringan",
        d: "Pada Settings > Network, gunakan Adapter 1 (NAT) untuk akses internet dan Adapter 2 (Host-only Adapter) agar komputer host dapat terhubung ke mesin virtual melalui SSH.",
      },
      {
        t: "Instal Ubuntu Server",
        d: "Selesaikan proses instalasi, buat akun pengguna awal, dan aktifkan opsi Install OpenSSH server untuk menyediakan akses jarak jauh.",
        warn: "Simpan nama pengguna dan kata sandi dengan aman. Kredensial tersebut diperlukan untuk latihan berikutnya.",
      },
      {
        t: "Masuk ke sistem dan perbarui paket",
        d: "Setelah mesin virtual melakukan reboot, masuk melalui konsol VM lalu jalankan pembaruan indeks paket dan paket sistem.",
        cmd: "sudo apt update\nsudo apt upgrade -y",
      },
      {
        t: "Identifikasi alamat IP",
        d: "Temukan alamat IP pada adapter host-only. Pada konfigurasi VirtualBox yang umum, alamatnya berada pada rentang `192.168.56.x`.",
        cmd: "ip -br a",
        out: "Contoh: enp0s8  UP  192.168.56.101/24",
      },
      {
        t: "Simpan snapshot kondisi awal",
        d: "Pilih Machine > Take Snapshot dan gunakan nama `clean-install`. Snapshot ini menjadi titik pemulihan apabila konfigurasi latihan mengalami masalah.",
      },
    ],
  },
  {
    id: "user",
    title: "Manajemen Pengguna, Grup, dan Izin Akses",
    goal: "Membuat akun dan grup pengguna, lalu menerapkan izin baca, tulis, dan eksekusi pada direktori bersama sesuai kebutuhan akses.",
    steps: [
      {
        t: "Buat grup pengguna",
        d: "Grup memudahkan administrator menerapkan kebijakan akses yang sama kepada beberapa pengguna.",
        cmd: "sudo groupadd devops",
      },
      {
        t: "Buat akun pengguna",
        d: "Perintah `adduser` akan meminta kata sandi dan, secara opsional, beberapa informasi tambahan untuk setiap akun.",
        cmd: "sudo adduser budi\nsudo adduser tamu",
      },
      {
        t: "Tambahkan pengguna ke grup",
        d: "Opsi `-aG` menambahkan grup sekunder tanpa menghapus keanggotaan grup lain.",
        cmd: "sudo usermod -aG devops budi\nid budi\ngetent group devops",
        out: "Output `id budi` seharusnya mencantumkan grup `devops`.",
        warn: "Pertahankan opsi `-a`. Tanpa opsi tersebut, keanggotaan grup sekunder yang sudah ada dapat tergantikan.",
      },
      {
        t: "Konfigurasikan direktori bersama",
        d: "Mode `2770` menerapkan bit setgid agar berkas baru mewarisi grup `devops`. Pengguna di luar grup tidak memperoleh akses ke direktori tersebut.",
        cmd: "sudo mkdir /srv/proyek\nsudo chown root:devops /srv/proyek\nsudo chmod 2770 /srv/proyek\nls -ld /srv/proyek",
        out: "drwxrws--- 2 root devops ... /srv/proyek",
      },
      {
        t: "Validasi izin akses",
        d: "Pastikan `budi` sebagai anggota `devops` dapat membuat berkas, sedangkan akun `tamu` tidak dapat membaca isi direktori.",
        cmd: "sudo -u budi touch /srv/proyek/tes.txt\nsudo -u tamu ls /srv/proyek",
        out: "Perintah kedua menghasilkan `Permission denied`.",
      },
      {
        t: "Interpretasikan mode izin",
        d: "Nilai `rwx` menggunakan bobot 4+2+1. Mode `750` memberikan akses penuh kepada pemilik, baca dan eksekusi kepada grup, serta tidak memberikan akses kepada pengguna lain.",
        cmd: "touch skrip.sh\nchmod 750 skrip.sh\nls -l skrip.sh",
      },
    ],
  },
  {
    id: "jaringan",
    title: "Diagnostik Jaringan dan Akses SSH",
    goal: "Memvalidasi alamat IP, resolusi DNS, rute jaringan, dan layanan SSH; membedakan sumber gangguan konektivitas serta mengamankan akses jarak jauh dengan kunci SSH.",
    steps: [
      {
        t: "Periksa alamat IP dan rute",
        d: "Pada tabel rute, entri `default via` menunjukkan gateway yang digunakan untuk mengakses jaringan di luar subnet lokal.",
        cmd: "ip -br a\nip route",
        out: "Contoh entri: default via 10.0.2.2 dev enp0s3",
      },
      {
        t: "Periksa konfigurasi DNS",
        d: "Gunakan `systemd-resolved` untuk memeriksa server DNS aktif dan menguji resolusi nama domain.",
        cmd: "resolvectl status\nresolvectl query ubuntu.com",
      },
      {
        t: "Isolasi gangguan routing dan DNS",
        d: "Jika konektivitas ke alamat IP berhasil tetapi akses berbasis nama domain gagal, periksa resolusi DNS. Jika keduanya gagal, lanjutkan pemeriksaan rute, gateway, dan adapter jaringan.",
        cmd: "ping -c 3 8.8.8.8\nping -c 3 ubuntu.com",
      },
      {
        t: "Telusuri jalur jaringan",
        d: "Perintah `tracepath` menampilkan lompatan jaringan (hop) menuju host tujuan untuk membantu mengidentifikasi titik gangguan.",
        cmd: "tracepath ubuntu.com",
      },
      {
        t: "Validasi layanan SSH",
        d: "Pastikan layanan SSH berstatus `active (running)` sebelum melakukan koneksi jarak jauh.",
        cmd: "systemctl status ssh",
      },
      {
        t: "Uji koneksi dari komputer host",
        d: "Jalankan perintah dari terminal sistem host, bukan dari konsol mesin virtual.",
        cmd: "ssh budi@192.168.56.101",
      },
      {
        t: "Buat dan pasang kunci SSH",
        d: "Jalankan perintah pada komputer host. Setelah kunci publik terpasang di server, autentikasi berbasis kunci dapat digunakan untuk mengurangi ketergantungan pada kata sandi.",
        cmd: "ssh-keygen -t ed25519\nssh-copy-id budi@192.168.56.101",
      },
      {
        t: "Nonaktifkan autentikasi kata sandi",
        d: "Pada `/etc/ssh/sshd_config`, atur `PasswordAuthentication` menjadi `no`. Validasi sintaks konfigurasi sebelum memuat ulang layanan.",
        cmd: "sudo nano /etc/ssh/sshd_config\nsudo sshd -t\nsudo systemctl reload ssh",
        warn: "Pastikan autentikasi menggunakan kunci SSH sudah berhasil pada sesi terminal lain sebelum menonaktifkan kata sandi. Kesalahan konfigurasi dapat mengunci akses SSH; konsol VirtualBox tetap menjadi jalur pemulihan.",
      },
    ],
  },
  {
    id: "systemctl",
    title: "Manajemen Layanan dengan systemd",
    goal: "Memeriksa status layanan, mengendalikan siklus hidupnya, dan menetapkan perilaku aktivasi otomatis saat proses boot.",
    steps: [
      {
        t: "Instal layanan Nginx",
        d: "Nginx digunakan sebagai layanan contoh pada latihan analisis log, konfigurasi firewall, dan pemecahan masalah.",
        cmd: "sudo apt install -y nginx",
      },
      {
        t: "Periksa status layanan",
        d: "Tinjau status `Active`, konfigurasi `Loaded`, status aktivasi saat boot, dan `Main PID` untuk memahami kondisi layanan.",
        cmd: "systemctl status nginx\nsystemctl is-active nginx\nsystemctl is-enabled nginx",
      },
      {
        t: "Kendalikan siklus hidup layanan",
        d: "Latih operasi `start`, `stop`, `restart`, dan `reload`. Gunakan `reload` ketika layanan mendukung pemuatan ulang konfigurasi tanpa menghentikan seluruh proses.",
        cmd: "sudo systemctl stop nginx\nsudo systemctl start nginx\nsudo systemctl restart nginx\nsudo systemctl reload nginx",
      },
      {
        t: "Atur aktivasi saat boot",
        d: "Perintah `enable` mengonfigurasi layanan agar aktif saat boot, sedangkan `disable` menonaktifkan perilaku tersebut.",
        cmd: "sudo systemctl disable nginx\nsudo systemctl enable nginx",
      },
      {
        t: "Verifikasi respons HTTP",
        d: "Pastikan Nginx memberikan respons HTTP yang sesuai dan endpoint lokal dapat dijangkau.",
        cmd: "curl -I http://localhost",
        out: "HTTP/1.1 200 OK",
      },
      {
        t: "Tinjau unit file dan layanan gagal",
        d: "Unit file mendefinisikan cara `systemd` memuat dan menjalankan layanan. Daftar layanan gagal membantu menentukan prioritas investigasi.",
        cmd: "systemctl cat nginx\nsystemctl list-units --type=service --state=failed",
      },
    ],
  },
  {
    id: "journalctl",
    title: "Analisis Log Sistem dengan journalctl",
    goal: "Mengumpulkan dan memfilter log layanan serta kernel untuk mengidentifikasi gejala, waktu kejadian, dan indikasi akar masalah.",
    steps: [
      {
        t: "Tinjau log layanan tertentu",
        d: "Opsi `-u` membatasi log pada unit layanan tertentu, sedangkan `-n` menentukan jumlah entri yang ditampilkan.",
        cmd: "journalctl -u nginx -n 20 --no-pager",
      },
      {
        t: "Filter log berdasarkan rentang waktu",
        d: "Gunakan parameter waktu absolut atau relatif untuk membatasi hasil pada periode saat gejala terjadi.",
        cmd: 'journalctl -u ssh --since "30 min ago"\njournalctl --since today --until "1 hour ago"',
      },
      {
        t: "Filter entri berprioritas error",
        d: "Opsi `-p err` menampilkan entri dengan prioritas error dan lebih tinggi, sedangkan `-b` membatasi hasil pada sesi boot saat ini.",
        cmd: "journalctl -p err -b",
      },
      {
        t: "Pantau log secara real-time",
        d: "Jalankan permintaan `curl` dari terminal lain untuk menghasilkan aktivitas baru. Hentikan pemantauan dengan `Ctrl+C`.",
        cmd: "journalctl -u nginx -f",
      },
      {
        t: "Identifikasi kegagalan autentikasi SSH",
        d: "Filter ini membantu meninjau percobaan autentikasi yang gagal dan mengidentifikasi pola akses yang perlu diperiksa lebih lanjut.",
        cmd: 'journalctl -u ssh | grep "Failed password"',
      },
      {
        t: "Kelola penggunaan ruang log",
        d: "Periksa ruang disk yang digunakan oleh journal. Kebijakan retensi dan pembersihan perlu diterapkan secara hati-hati agar bukti diagnostik yang masih diperlukan tidak terhapus.",
        cmd: "journalctl --disk-usage\nsudo journalctl --vacuum-size=200M",
      },
    ],
  },
  {
    id: "ufw",
    title: "Konfigurasi Firewall dengan UFW",
    goal: "Menerapkan kebijakan firewall berbasis prinsip least privilege dengan membuka hanya layanan yang diperlukan dan mempertahankan akses administrasi.",
    steps: [
      {
        t: "Periksa status firewall",
        d: "Tinjau status dan kebijakan UFW sebelum membuat perubahan. Pada kondisi awal modul ini, firewall diasumsikan belum aktif.",
        cmd: "sudo ufw status verbose",
        out: "Status: inactive",
      },
      {
        t: "Tetapkan kebijakan default",
        d: "Terapkan kebijakan untuk menolak koneksi masuk yang tidak diizinkan secara eksplisit dan mengizinkan koneksi keluar.",
        cmd: "sudo ufw default deny incoming\nsudo ufw default allow outgoing",
      },
      {
        t: "Izinkan koneksi SSH",
        d: "Tambahkan aturan SSH sebelum mengaktifkan firewall agar akses administrasi jarak jauh tetap tersedia.",
        cmd: "sudo ufw allow OpenSSH",
        warn: "Mengaktifkan firewall tanpa aturan SSH yang sesuai dapat memutus sesi administrasi jarak jauh.",
      },
      {
        t: "Izinkan lalu lintas HTTP",
        d: "Buka port TCP 80 untuk mengizinkan akses HTTP ke layanan Nginx.",
        cmd: "sudo ufw allow 80/tcp",
      },
      {
        t: "Aktifkan dan audit aturan UFW",
        d: "Konfirmasi aktivasi firewall, lalu tinjau aturan bernomor untuk memastikan kebijakan yang diterapkan sesuai kebutuhan.",
        cmd: "sudo ufw enable\nsudo ufw status numbered",
      },
      {
        t: "Batasi sumber koneksi administratif",
        d: "Batasi akses SSH ke subnet host-only. Tinjau nomor aturan aktif dengan `ufw status numbered` sebelum menghapus aturan yang terlalu luas.",
        cmd: "sudo ufw allow from 192.168.56.0/24 to any port 22 proto tcp\nsudo ufw delete 1",
      },
      {
        t: "Validasi konektivitas dari host",
        d: "Uji endpoint HTTP dari komputer host dan pastikan hanya layanan yang diizinkan dapat diakses sesuai kebijakan firewall.",
        cmd: "curl -I http://192.168.56.101",
      },
      {
        t: "Aktifkan pencatatan firewall",
        d: "Aktifkan logging untuk membantu analisis paket yang diblokir, lalu periksa entri terkait melalui journal kernel.",
        cmd: 'sudo ufw logging on\njournalctl -k | grep "UFW BLOCK"',
      },
    ],
  },
  {
    id: "storage",
    title: "Manajemen Disk dan Storage",
    goal: "Menganalisis penggunaan disk dan inode, mengidentifikasi berkas atau direktori berukuran besar, serta menambahkan storage yang terpasang secara persisten.",
    steps: [
      {
        t: "Analisis penggunaan kapasitas dan inode",
        d: "Tinjau kolom penggunaan kapasitas dan inode. Sistem dapat gagal membuat berkas baru meskipun ruang disk masih tersedia apabila inode telah habis.",
        cmd: "df -h\ndf -i",
      },
      {
        t: "Identifikasi direktori dengan penggunaan terbesar",
        d: "Opsi `-x` membatasi analisis pada filesystem yang sama. Lanjutkan pemeriksaan pada direktori dengan kontribusi penggunaan terbesar.",
        cmd: "sudo du -xh /var --max-depth=1 | sort -rh | head",
      },
      {
        t: "Temukan berkas berukuran besar",
        d: "Cari berkas yang berukuran lebih dari 100 MB pada filesystem yang sedang diperiksa.",
        cmd: "sudo find / -xdev -type f -size +100M -exec ls -lh {} + 2>/dev/null",
      },
      {
        t: "Tambahkan disk virtual",
        d: "Matikan VM, buka Settings > Storage pada VirtualBox, lalu tambahkan disk virtual 5 GB. Nyalakan VM kembali dan identifikasi perangkat baru.",
        cmd: "lsblk",
        out: "Contoh: perangkat baru terdeteksi sebagai `/dev/sdb` tanpa partisi.",
      },
      {
        t: "Buat partisi, format, dan mount disk",
        d: "Buat tabel partisi GPT, format partisi dengan filesystem ext4, lalu pasang filesystem pada `/mnt/data`.",
        cmd: "sudo parted /dev/sdb --script mklabel gpt mkpart data ext4 0% 100%\nsudo mkfs.ext4 /dev/sdb1\nsudo mkdir /mnt/data\nsudo mount /dev/sdb1 /mnt/data\ndf -h /mnt/data",
        warn: "Pastikan `/dev/sdb` benar-benar merupakan disk baru dengan memeriksa output `lsblk`. Perintah `mkfs` akan menghapus data pada partisi target.",
      },
      {
        t: "Konfigurasikan mount persisten melalui fstab",
        d: "Ambil UUID partisi menggunakan `blkid`, ganti placeholder `GANTI_UUID`, lalu validasi konfigurasi dengan `mount -a` sebelum melakukan reboot.",
        cmd: 'sudo blkid /dev/sdb1\necho "UUID=GANTI_UUID /mnt/data ext4 defaults 0 2" | sudo tee -a /etc/fstab\nsudo mount -a',
        warn: "Entri `/etc/fstab` yang tidak valid dapat menyebabkan masalah saat boot. Jika `mount -a` menampilkan error, perbaiki konfigurasi sebelum melakukan reboot.",
      },
    ],
  },
  {
    id: "proses",
    title: "Monitoring Proses dan Sumber Daya",
    goal: "Memeriksa penggunaan CPU, memori, dan proses untuk mengidentifikasi penyebab penurunan performa serta menghentikan proses bermasalah secara terkendali.",
    steps: [
      {
        t: "Tinjau ringkasan sumber daya",
        d: "Bandingkan nilai load average dengan jumlah CPU dan data penggunaan memori untuk menilai kemungkinan antrean pekerjaan atau tekanan sumber daya.",
        cmd: "uptime\nfree -h\nnproc",
      },
      {
        t: "Pantau aktivitas proses secara langsung",
        d: "Pada `top`, tekan `P` untuk mengurutkan berdasarkan CPU, `M` berdasarkan penggunaan memori, dan `q` untuk keluar.",
        cmd: "top",
      },
      {
        t: "Identifikasi proses dengan konsumsi tertinggi",
        d: "Gunakan `ps` untuk mengambil snapshot proses, lalu urutkan berdasarkan penggunaan memori atau CPU sebagai bahan analisis dan dokumentasi.",
        cmd: "ps aux --sort=-%mem | head -5\nps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu | head -5",
      },
      {
        t: "Buat simulasi beban CPU",
        d: "Perintah `yes` yang berjalan di latar belakang menghasilkan beban berkelanjutan pada satu core. Jalankan hanya di lingkungan latihan.",
        cmd: "yes > /dev/null &\ntop -bn1 | head -12",
        out: "Contoh hasil: proses `yes` menggunakan sekitar 100% dari satu core CPU.",
      },
      {
        t: "Hentikan proses secara terkendali",
        d: "Perintah `kill` mengirim SIGTERM agar proses dapat berhenti secara normal. Gunakan SIGKILL (`-9`) hanya jika proses tidak merespons dan penghentian paksa memang diperlukan.",
        cmd: 'pgrep -a yes\nkill $(pgrep yes)\npgrep yes || echo "sudah berhenti"',
      },
      {
        t: "Investigasi tekanan memori",
        d: "Periksa log kernel untuk kejadian Out of Memory (OOM) dan gunakan `vmstat` untuk mengamati aktivitas memori serta proses.",
        cmd: 'journalctl -k | grep -i "out of memory"\nvmstat 1 5',
      },
    ],
  },
  {
    id: "paket",
    title: "Manajemen Paket Perangkat Lunak",
    goal: "Mencari, memasang, memperbarui, mengunci versi, dan memperbaiki paket perangkat lunak melalui APT dan dpkg.",
    steps: [
      {
        t: "Cari dan tinjau informasi paket",
        d: "Tinjau deskripsi, versi, ukuran, dan metadata paket sebelum melakukan instalasi.",
        cmd: "apt search htop\napt show htop",
      },
      {
        t: "Kelola instalasi dan penghapusan paket",
        d: "Gunakan APT untuk memasang dan menghapus paket. `autoremove` membersihkan dependensi yang tidak lagi dibutuhkan oleh paket lain.",
        cmd: "sudo apt install -y htop\nsudo apt remove htop\nsudo apt autoremove -y",
      },
      {
        t: "Periksa versi dan berkas paket",
        d: "`apt policy` menampilkan versi kandidat dan versi terpasang beserta sumber repositorinya. `dpkg` membantu memeriksa status serta daftar berkas paket.",
        cmd: "apt policy nginx\ndpkg -l | grep nginx\ndpkg -L nginx | head",
      },
      {
        t: "Tahan pembaruan versi paket",
        d: "Gunakan penahanan versi sementara ketika pembaruan tertentu perlu ditunda, misalnya saat kompatibilitas aplikasi sedang dievaluasi.",
        cmd: "sudo apt-mark hold nginx\napt-mark showhold\nsudo apt-mark unhold nginx",
      },
      {
        t: "Konfigurasikan pembaruan keamanan otomatis",
        d: "Pasang `unattended-upgrades`, tinjau opsi konfigurasi, lalu periksa status layanan untuk memastikan mekanisme pembaruan berjalan sesuai pengaturan.",
        cmd: "sudo apt install -y unattended-upgrades\nsudo dpkg-reconfigure -plow unattended-upgrades\nsystemctl status unattended-upgrades",
      },
      {
        t: "Pulihkan status paket yang bermasalah",
        d: "Gunakan langkah ini ketika proses instalasi terhenti atau dpkg melaporkan dependensi dan konfigurasi paket yang belum terselesaikan.",
        cmd: "sudo dpkg --configure -a\nsudo apt --fix-broken install",
      },
    ],
  },
  {
    id: "backup",
    title: "Penjadwalan Tugas dan Pencadangan Data",
    goal: "Mengotomatisasi tugas berkala menggunakan cron, membuat arsip backup, dan memverifikasi integritas pemulihan data.",
    steps: [
      {
        t: "Siapkan data uji",
        d: "Buat direktori sumber dan tujuan backup, kemudian tambahkan berkas contoh sebagai data yang akan dicadangkan.",
        cmd: 'mkdir -p ~/data-uji ~/backup\necho "dokumen penting" > ~/data-uji/catatan.txt',
      },
      {
        t: "Buat arsip backup dengan tar",
        d: "Cantumkan tanggal pada nama arsip untuk memudahkan identifikasi. Gunakan opsi `-tzf` untuk memverifikasi daftar isi arsip.",
        cmd: "tar -czf ~/backup/data-$(date +%F).tar.gz -C ~ data-uji\ntar -tzf ~/backup/data-$(date +%F).tar.gz",
      },
      {
        t: "Sinkronkan data menggunakan rsync",
        d: "Garis miring di akhir path sumber menandakan bahwa isi direktori yang disinkronkan, bukan direktori induknya.",
        cmd: "rsync -av --delete ~/data-uji/ ~/backup/mirror/",
        warn: "Opsi `--delete` menghapus berkas tujuan yang tidak ditemukan pada sumber. Verifikasi path sumber dan tujuan sebelum menjalankan perintah.",
      },
      {
        t: "Jadwalkan pencadangan dengan cron",
        d: "Tambahkan entri pada crontab untuk menjalankan pencadangan setiap hari pukul 02.00. Dalam crontab, karakter `%` pada perintah perlu di-escape sebagai `\\%`.",
        cmd: "crontab -e\ncrontab -l",
        tpl: "0 2 * * * tar -czf $HOME/backup/data-$(date +\\%F).tar.gz -C $HOME data-uji",
      },
      {
        t: "Validasi pemulihan backup",
        d: "Backup belum dapat dianggap valid sebelum proses pemulihan berhasil dan hasilnya dibandingkan dengan data sumber.",
        cmd: 'mkdir ~/restore\ntar -xzf ~/backup/data-$(date +%F).tar.gz -C ~/restore\ndiff -r ~/data-uji ~/restore/data-uji && echo "Restore OK"',
        out: "Restore OK",
      },
      {
        t: "Verifikasi eksekusi terjadwal",
        d: "Tinjau log layanan cron dan daftar timer systemd untuk memastikan tugas terjadwal berjalan sesuai konfigurasi.",
        cmd: "journalctl -u cron --since today\nsystemctl list-timers",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Diagnosis dan Pemulihan Layanan",
    goal: "Mensimulasikan kegagalan layanan Nginx di lingkungan terisolasi, menganalisis bukti, menerapkan perbaikan, dan memverifikasi pemulihan layanan.",
    steps: [
      {
        t: "Simulasikan konfigurasi tidak valid",
        d: "Buat berkas konfigurasi Nginx yang sengaja tidak valid, lalu mulai ulang layanan untuk menghasilkan kondisi kegagalan yang dapat dianalisis.",
        cmd: 'echo "baris_salah;" | sudo tee /etc/nginx/conf.d/rusak.conf\nsudo systemctl restart nginx',
        out: "Job for nginx.service failed ...",
      },
      {
        t: "Langkah 1: evaluasi status layanan",
        d: "Tinjau status `Active`, kode keluar, dan pesan terbaru untuk mengidentifikasi indikasi awal kegagalan.",
        cmd: "systemctl status nginx",
      },
      {
        t: "Langkah 2: analisis log layanan",
        d: "Opsi `-x` menambahkan konteks penjelasan, sedangkan `-e` membuka log pada bagian paling akhir.",
        cmd: "journalctl -xeu nginx",
      },
      {
        t: "Langkah 3: validasi konfigurasi",
        d: "Jalankan pengujian sintaks untuk memperoleh nama berkas dan nomor baris yang menyebabkan konfigurasi ditolak.",
        cmd: "sudo nginx -t",
        out: 'unknown directive "baris_salah" in /etc/nginx/conf.d/rusak.conf:1',
      },
      {
        t: "Langkah 4: pulihkan dan verifikasi layanan",
        d: "Singkirkan berkas konfigurasi yang bermasalah, validasi ulang sintaks, mulai ulang layanan, lalu uji respons HTTP lokal.",
        cmd: "sudo rm /etc/nginx/conf.d/rusak.conf\nsudo nginx -t\nsudo systemctl restart nginx\ncurl -I http://localhost",
      },
      {
        t: "Skenario 2: konflik port layanan",
        d: "Jalankan server alternatif pada port 80, kemudian coba aktifkan Nginx. Identifikasi proses yang sudah menggunakan port tersebut.",
        cmd: "sudo systemctl stop nginx\nsudo python3 -m http.server 80 &\nsudo systemctl start nginx\nsudo ss -tlnp | grep :80",
        out: "Log Nginx menunjukkan: bind() to 0.0.0.0:80 failed (98: Address already in use)",
      },
      {
        t: "Pulihkan skenario konflik port",
        d: "Hentikan proses yang menggunakan port 80, mulai ulang Nginx, lalu validasi status layanan.",
        cmd: 'sudo pkill -f "http.server 80"\nsudo systemctl restart nginx\nsystemctl is-active nginx',
        out: "active",
      },
      {
        t: "Gunakan checklist diagnostik",
        d: "Terapkan urutan pemeriksaan yang konsisten: status layanan, log (`journalctl -u`), validasi konfigurasi, port yang digunakan (`ss -tlnp`), izin berkas, aturan firewall, dan kapasitas disk.",
        cmd: "df -h\nss -tlnp\nsudo ufw status",
      },
    ],
  },
  {
    id: "capstone",
    title: "Studi Kasus Akhir: Pemulihan Server",
    goal: "Menangani tiket simulasi yang menggabungkan beberapa gangguan layanan, firewall, dan kapasitas penyimpanan melalui proses diagnosis, pemulihan, verifikasi, serta pelaporan insiden.",
    steps: [
      {
        t: "Inisialisasi skenario insiden",
        d: "Jalankan hanya pada VM latihan. Skenario ini menambahkan konfigurasi Nginx yang tidak valid, menghasilkan berkas besar, dan mengaktifkan UFW untuk menciptakan beberapa gejala yang perlu diinvestigasi.",
        cmd: 'sudo apt install -y nginx\necho "baris_salah;" | sudo tee /etc/nginx/conf.d/rusak.conf\nsudo fallocate -l 1G /var/tmp/log-lama.bin\nsudo ufw allow OpenSSH\nsudo ufw --force enable\nsudo systemctl restart nginx',
        warn: "Setelah latihan selesai, pulihkan VM ke snapshot `clean-install`. Pastikan tidak ada data penting pada lingkungan uji.",
      },
      {
        t: "Tinjau tiket dan tetapkan prioritas",
        d: "Tiket 101 melaporkan bahwa situs perusahaan tidak dapat diakses sejak pagi. Dokumentasikan gejala, waktu mulai, dampak terhadap pengguna, dan ketersediaan solusi sementara sebelum menetapkan prioritas penanganan.",
      },
      {
        t: "Lakukan diagnosis secara berurutan",
        d: "Periksa status layanan, validitas konfigurasi, kebijakan firewall, kapasitas penyimpanan, dan log terkait. Catat bukti pada setiap tahap sebelum menerapkan perubahan.",
        cmd: "systemctl is-active nginx\nsudo nginx -t\nsudo ufw status\ndf -h\njournalctl -u nginx -n 20 --no-pager",
      },
      {
        t: "Terapkan perbaikan dan verifikasi",
        d: "Perbaiki satu penyebab pada satu waktu dan lakukan pengujian setelah setiap perubahan. Validasi akhir dilakukan dari komputer host untuk memastikan layanan dapat diakses pengguna.",
        cmd: "sudo rm /etc/nginx/conf.d/rusak.conf\nsudo nginx -t && sudo systemctl restart nginx\nsudo ufw allow 80/tcp\nsudo rm /var/tmp/log-lama.bin\ncurl -I http://192.168.56.101",
        out: "HTTP/1.1 200 OK",
      },
      {
        t: "Dokumentasikan insiden",
        d: "Gunakan templat berikut sebagai dasar laporan. Lengkapi dengan stempel waktu, bukti log, perintah yang dijalankan, hasil verifikasi, dan tindakan pencegahan yang relevan.",
        tpl: "Insiden      : Situs tidak dapat diakses (Tiket 101)\nDampak       : pengguna terdampak dan waktu mulai\nLinimasa     : tiket diterima, diagnosis, perbaikan, verifikasi\nAkar masalah : 1) konfigurasi Nginx tidak valid\n               2) akses HTTP tidak diizinkan oleh firewall\n               3) berkas besar yang tidak diperlukan pada /var/tmp\nPerbaikan    : tindakan dan hasil verifikasi tiap langkah\nPencegahan   : validasi konfigurasi sebelum restart, tinjau aturan firewall, pantau kapasitas disk",
      },
      {
        t: "Arsipkan bukti penyelesaian",
        d: "Simpan tangkapan layar output, catatan diagnosis, dan laporan insiden pada repositori proyek. Sertakan bukti yang relevan pada portofolio agar proses dan hasil dapat ditinjau kembali.",
      },
    ],
  },
];

export const profile = {
  name: "Bagas Anardi Surya Wijaya",
  role: "IT Support · Networking · Linux Administration",
  github: "https://github.com/Anardi/",
  linkedin: "https://www.linkedin.com/in/bagas-anardi/",
  email: "anardibusiness@gmail.com",
  phone: "+62 851-7822-9616",
};

export const skills = {
  persiapan: ["VirtualBox", "Instalasi Ubuntu Server", "Manajemen snapshot"],
  user: ["Manajemen pengguna dan grup", "chmod dan chown", "setgid"],
  jaringan: ["TCP/IP", "DNS", "Routing", "Autentikasi kunci SSH"],
  systemctl: ["systemd", "Manajemen layanan"],
  journalctl: ["Analisis log sistem", "journalctl"],
  ufw: ["Konfigurasi firewall", "UFW"],
  storage: ["Analisis disk dengan df dan du", "Partisi dan mount", "fstab"],
  proses: [
    "Analisis proses dengan top dan ps",
    "Monitoring sumber daya",
    "Manajemen proses",
  ],
  paket: ["APT dan dpkg", "Manajemen pembaruan"],
  backup: [
    "Penjadwalan cron",
    "Backup dengan tar dan rsync",
    "Validasi pemulihan",
  ],
  troubleshooting: ["Analisis akar masalah", "Diagnosis Nginx"],
  capstone: ["Penanganan insiden", "Dokumentasi insiden", "Prioritas tiket"],
};
