// Resume content based on the supplied CV. Keep achievements factual and verifiable.
export const about = {
  headline: 'IT Support dengan fondasi jaringan komputer, administrasi sistem, dan keamanan informasi.',
  paragraphs: [
    'Saya menyelesaikan pendidikan S1 Teknik Informatika di Institut Teknologi Nasional Malang. Dasar teknis saya mencakup sistem komputer, jaringan TCP/IP, konfigurasi jaringan, analisis lalu lintas jaringan, lingkungan Linux, dan keamanan jaringan dasar.',
    'Portofolio ini mendokumentasikan latihan Ubuntu Server yang terstruktur, mulai dari pengelolaan akses, pemantauan layanan, analisis log, konfigurasi firewall, validasi backup, hingga troubleshooting insiden. Setiap modul dilengkapi prosedur, perintah yang relevan, dan hasil verifikasi yang diharapkan.',
  ],
  principles: [
    ['Lakukan verifikasi sebelum mengubah', 'Periksa status layanan, log, dan konfigurasi sebelum menerapkan perubahan.'],
    ['Dokumentasikan hasil', 'Catat perintah, output, langkah penyelesaian, dan tindak lanjut untuk setiap skenario.'],
    ['Jaga keamanan akses', 'Gunakan snapshot VM sebelum latihan yang berisiko mengubah konfigurasi dan validasi aturan akses sebelum menerapkannya.'],
  ],
}

export const resume = {
  summary: 'Informatics Engineering graduate seeking an IT Support role, with a foundation in computer systems, networking, and information security. Hands-on academic and laboratory practice includes TCP/IP, network configuration, traffic analysis, Linux environments, and basic network security, complemented by experience supporting laboratory users and troubleshooting software and device issues.',
  experience: [
    {
      role: 'Graphic Designer (Internship)',
      org: 'PT Sariguna Primatirta (Cleo)',
      location: 'Surabaya, Indonesia · On-site',
      period: 'Aug 2026 – Present',
      points: [
        'Use computer systems, software applications, and digital tools as part of daily production workflows.',
        'Troubleshoot application and technical issues encountered across software and devices.',
        'Maintain organized digital files, application settings, and workflow assets.',
      ],
    },
    {
      role: 'Laboratory Assistant — Image Processing & Multimedia Laboratory',
      org: 'Institut Teknologi Nasional Malang',
      location: 'Malang, East Java',
      period: 'Jan 2024 – Jul 2024',
      points: [
        'Assisted students with computer and software issues during practical laboratory sessions.',
        'Troubleshot issues involving computers, applications, and laboratory equipment.',
        'Supported software installation, basic computer configuration, and laboratory readiness.',
      ],
    },
    {
      role: 'Network Configuration & Troubleshooting Lab',
      org: 'Institut Teknologi Nasional Malang',
      location: 'Malang, East Java · Academic laboratory',
      period: 'Academic practice',
      points: [
        'Configured LAN topologies in Cisco Packet Tracer, including IPv4 addressing, subnetting, DHCP, DNS, and basic routing.',
        'Diagnosed connectivity issues using ping, network configuration checks, and standard diagnostic commands.',
        'Identified and corrected configuration issues that prevented communication between network devices.',
      ],
    },
  ],
  projects: [
    {
      name: 'Linux System Administration Lab',
      type: 'Technical portfolio project',
      period: 'Portfolio project',
      summary: 'A structured Ubuntu Server learning environment documented around common IT Support and system administration tasks.',
      points: [
        'Organized guided scenarios for user and group administration, permissions, SSH, systemd services, logs, UFW, storage, process monitoring, package management, scheduled backups, and troubleshooting.',
        'Added a browser-based terminal simulator with mock responses to demonstrate command workflows without executing commands on a real server.',
        'Included validation steps and safety notes for tasks that may affect service availability, access, or disk data.',
      ],
      tags: ['Ubuntu Server', 'VirtualBox', 'SSH', 'systemd', 'journalctl', 'UFW', 'Troubleshooting'],
    },
    {
      name: 'Educational Platform — MSIB Batch 6',
      type: 'Independent Study capstone',
      org: 'PT Maleo Edukasi Teknologi',
      period: 'Feb 2024 – Jun 2024',
      summary: 'Collaborative capstone project to develop an educational platform.',
      points: [
        'Contributed to front-end, back-end, database, and API implementation.',
        'Worked with database management, user authentication and authorization, and REST API integration.',
        'Collaborated with team members to review requirements, troubleshoot technical issues, and present the final project.',
      ],
      tags: ['Web Development', 'Database', 'REST API', 'Authentication'],
    },
  ],
  education: [
    {
      title: 'Bachelor’s Degree in Informatics Engineering',
      org: 'Institut Teknologi Nasional Malang (ITN)',
      location: 'Malang, East Java',
      period: 'May 2021 – Feb 2025',
      result: 'GPA: 3.60 / 4.00 · Cum Laude',
    },
  ],
  skills: [
    {
      category: 'Networking',
      level: 'Expert',
      items: ['TCP/IP', 'IPv4 addressing', 'Subnetting', 'LAN/WAN', 'DHCP', 'DNS', 'Routing', 'Switching', 'Network troubleshooting'],
    },
    {
      category: 'Network Tools',
      level: 'Proficient',
      items: ['Cisco Packet Tracer', 'MikroTik', 'Wireshark', 'Network configuration'],
    },
    {
      category: 'IT Support & Systems',
      level: 'Proficient',
      items: ['Windows', 'Linux', 'Hardware and software troubleshooting', 'PC setup', 'System installation', 'Command line fundamentals'],
    },
    {
      category: 'Virtualization',
      level: 'Proficient',
      items: ['Virtual machine setup', 'VirtualBox', 'Linux environment configuration'],
    },
    {
      category: 'Security Fundamentals',
      level: 'Academic / Lab Practice',
      items: ['Basic network security', 'Traffic analysis', 'SSH key authentication', 'UFW firewall rules'],
    },
  ],
  workshops: [
    'Bicara Tentang Data Workshop',
    'UI Design Competition',
    'How to Build REST API with Laravel Workshop',
    'Cyber Fest 2022',
  ],
  links: {
    workshops: 'https://drive.google.com/drive/folders/1gD3Z1J4uXsbOxm7kJWo1eHVjwS79agg7?usp=sharing',
    msib: 'https://drive.google.com/drive/folders/1UhdPrA1rPQkjCXangIpSLjqU6W8dCXjF?usp=drive_link',
  },
}
