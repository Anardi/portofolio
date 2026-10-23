/**
 * Browser-only Ubuntu CLI simulator.
 * IMPORTANT: no command is passed to a real shell or server. All state lives in memory.
 */
const moduleScenarios = {
  persiapan: { title: 'Persiapan VM', intro: 'Skenario: periksa identitas OS, alamat IP, dan konektivitas host.', commands: ['whoami', 'uname -a', 'ip a', 'ping -c 4 192.168.56.1'] },
  user: { title: 'User, group, dan permission', intro: 'Skenario: buat user latihan, group tim, dan atur permission pada folder bersama.', commands: ['id', 'groups student', 'ls -l', 'mkdir -p ~/shared', 'chmod 750 ~/shared'] },
  jaringan: { title: 'IP, DNS, routing, dan SSH', intro: 'Skenario: periksa interface, default route, DNS, serta service SSH.', commands: ['ip a', 'ip route', 'getent hosts ubuntu.com', 'systemctl status ssh'] },
  systemctl: { title: 'Service dengan systemctl', intro: 'Skenario: cek status nginx, restart service, lalu verifikasi port yang terbuka.', commands: ['systemctl status nginx', 'sudo nginx -t', 'sudo systemctl restart nginx', 'ss -tulpn'] },
  journalctl: { title: 'Analisis log dengan journalctl', intro: 'Skenario: temukan error service dari journal dan log aplikasi.', commands: ['journalctl -u nginx -n 20', 'journalctl -p err -n 10', 'tail -n 10 /var/log/nginx/error.log'] },
  ufw: { title: 'Firewall dengan UFW', intro: 'Skenario: periksa kebijakan firewall dan pastikan SSH tidak terblokir.', commands: ['sudo ufw status verbose', 'sudo ufw allow OpenSSH', 'sudo ufw allow 80/tcp', 'sudo ufw status numbered'] },
  storage: { title: 'Disk dan storage', intro: 'Skenario: temukan filesystem yang penuh dan analisis pemakaian direktori.', commands: ['df -h', 'df -i', 'du -xh /var --max-depth=1', 'lsblk'] },
  proses: { title: 'Proses dan resource', intro: 'Skenario: periksa CPU, memori, load, dan proses yang paling berat.', commands: ['uptime', 'free -h', 'ps aux --sort=-%mem', 'top'] },
  paket: { title: 'Manajemen paket', intro: 'Skenario: periksa paket yang tersedia dan simulasikan pembaruan paket.', commands: ['apt update', 'apt policy nginx', 'apt install --simulate htop'] },
  backup: { title: 'Cron dan backup', intro: 'Skenario: siapkan berkas latihan, buat arsip, dan periksa isi backup.', commands: ['mkdir -p ~/data-uji ~/backup', 'echo "dokumen penting" > ~/data-uji/catatan.txt', 'tar -czf ~/backup/data-lab.tar.gz -C ~ data-uji', 'tar -tzf ~/backup/data-lab.tar.gz'] },
  troubleshooting: { title: 'Troubleshooting service gagal', intro: 'Tiket simulasi: nginx gagal karena konfigurasi rusak. Diagnosis sebelum memperbaiki.', commands: ['systemctl status nginx', 'journalctl -u nginx -n 20', 'sudo nginx -t', 'sudo rm /etc/nginx/conf.d/rusak.conf', 'sudo nginx -t', 'sudo systemctl restart nginx'] },
  capstone: { title: 'Capstone: server warisan', intro: 'Skenario gabungan simulasi: diagnosis service, firewall, dan kapasitas disk tanpa menyentuh mesin sungguhan.', commands: ['systemctl status nginx', 'sudo nginx -t', 'sudo ufw status', 'df -h', 'journalctl -u nginx -n 20'] },
}

const cloneSet = values => new Set(values)

export function getModuleScenario(id) {
  return moduleScenarios[id] || {
    title: 'Bash Ubuntu dasar',
    intro: 'Coba perintah Linux. Respons dan filesystem disimulasikan langsung di browser.',
    commands: ['help', 'pwd', 'ls -la', 'whoami'],
  }
}

export function createSimulator(moduleId = '') {
  const scenario = getModuleScenario(moduleId)
  const hasBrokenNginx = moduleId === 'troubleshooting' || moduleId === 'capstone'
  const state = {
    moduleId,
    cwd: '/home/student',
    users: new Set(['root', 'student', 'ubuntu']),
    groups: new Set(['sudo', 'adm', 'student']),
    userGroups: { root: ['root'], student: ['student', 'sudo', 'adm'], ubuntu: ['ubuntu', 'sudo'] },
    installed: new Set(['bash', 'coreutils', 'iproute2', 'systemd', 'openssh-server', 'nginx', 'ufw', 'curl', 'tar', 'cron']),
    services: { nginx: hasBrokenNginx ? 'failed' : 'active', ssh: 'active', cron: 'active', ufw: 'active' },
    ufwEnabled: true,
    ufwRules: ['22/tcp                    ALLOW IN    Anywhere', '80/tcp                    ALLOW IN    Anywhere'],
    diskFull: moduleId === 'storage' || moduleId === 'capstone',
    brokenNginx: hasBrokenNginx,
    portCollision: false,
    pythonServerRunning: false,
    yesRunning: false,
    diskExists: false,
    mountedData: false,
    heldPackages: new Set(),
    history: [],
    permissions: { '/home/student': 'drwxr-x---', '/home/student/README.md': '-rw-r--r--', '/home/student/lab-notes.txt': '-rw-r-----', '/home/student/shared': 'drwxr-x---' },
    directories: cloneSet([
      '/', '/bin', '/boot', '/dev', '/etc', '/etc/nginx', '/etc/nginx/conf.d', '/etc/ssh', '/home', '/home/student', '/home/student/shared',
      '/lib', '/media', '/mnt', '/opt', '/proc', '/root', '/run', '/sbin', '/srv', '/sys', '/tmp', '/usr', '/usr/bin', '/usr/sbin', '/var', '/var/log',
      '/var/log/nginx', '/var/www', '/var/www/html', '/var/tmp', '/srv', '/home/student/data-uji', '/home/student/backup',
    ]),
    files: new Map([
      ['/etc/hostname', 'ubuntu-lab\n'],
      ['/etc/os-release', 'PRETTY_NAME="Ubuntu 24.04 LTS"\nNAME="Ubuntu"\nVERSION_ID="24.04"\n'],
      ['/etc/hosts', '127.0.0.1 localhost\n127.0.1.1 ubuntu-lab\n192.168.56.101 ubuntu-lab\n'],
      ['/etc/passwd', 'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nubuntu:x:1001:1001:Ubuntu:/home/ubuntu:/bin/bash\n'],
      ['/etc/group', 'root:x:0:\nsudo:x:27:student,ubuntu\nadm:x:4:student\nstudent:x:1000:\n'],
      ['/etc/ssh/sshd_config', 'PermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\n'],
      ['/etc/nginx/nginx.conf', 'user www-data;\nworker_processes auto;\ninclude /etc/nginx/conf.d/*.conf;\n'],
      ['/etc/nginx/conf.d/rusak.conf', hasBrokenNginx ? 'baris_salah;\n' : ''],
      ['/var/log/nginx/error.log', ...(hasBrokenNginx ? ['2026/10/23 09:41:12 [emerg] unknown directive "baris_salah" in /etc/nginx/conf.d/rusak.conf:1\n'] : ['2026/10/23 08:12:04 [notice] nginx started successfully\n'])],
      ['/var/log/syslog', 'Oct 23 09:00:01 ubuntu-lab CRON[1204]: (root) CMD (run-parts /etc/cron.hourly)\nOct 23 09:01:22 ubuntu-lab systemd[1]: Started OpenSSH server daemon.\n'],
      ['/var/log/auth.log', 'Oct 23 09:12:41 ubuntu-lab sshd[631]: Failed password for invalid user admin from 192.168.56.120 port 52201 ssh2\nOct 23 09:13:12 ubuntu-lab sshd[631]: Accepted publickey for student from 192.168.56.1 port 52203 ssh2\n'],
      ['/home/student/README.md', '# Ubuntu Lab\n\nFilesystem ini hanya simulasi browser, bukan VM sungguhan.\n'],
      ['/home/student/lab-notes.txt', 'Checklist: identifikasi masalah, baca log, lakukan satu perubahan, verifikasi hasil.\n'],
      ['/var/www/html/index.html', '<h1>Ubuntu Lab</h1>\n'],
    ]),
  }
  if (!state.files.has('/etc/nginx/conf.d/rusak.conf')) state.files.delete('/etc/nginx/conf.d/rusak.conf')

  function normalizePath(input = '.', base = state.cwd) {
    const raw = String(input || '.').replace(/^~/, '/home/student')
    const joined = raw.startsWith('/') ? raw : `${base}/${raw}`
    const parts = []
    for (const part of joined.split('/')) {
      if (!part || part === '.') continue
      if (part === '..') parts.pop()
      else parts.push(part)
    }
    return `/${parts.join('/')}` || '/'
  }

  function parseWords(input) {
    const words = String(input).match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []
    return words.map(word => {
      if ((word.startsWith('"') && word.endsWith('"')) || (word.startsWith("'") && word.endsWith("'"))) return word.slice(1, -1)
      return word
    })
  }

  function exists(path) { return state.directories.has(path) || state.files.has(path) }
  function listDirectory(path, long = false, all = false) {
    if (!state.directories.has(path)) return `ls: cannot access '${path}': No such file or directory`
    const children = []
    for (const dir of state.directories) {
      if (dir === path || dir === '/') continue
      if (dir.slice(0, dir.lastIndexOf('/')) === path) children.push({ name: dir.split('/').pop(), path: dir, dir: true })
    }
    for (const file of state.files.keys()) {
      if (file.slice(0, file.lastIndexOf('/')) === path) children.push({ name: file.split('/').pop(), path: file, dir: false })
    }
    children.sort((a, b) => a.name.localeCompare(b.name))
    if (all) children.unshift({ name: '..', path: path, dir: true }, { name: '.', path, dir: true })
    if (!children.length) return ''
    if (!long) return children.map(c => c.dir ? `${c.name}/` : c.name).join('  ')
    return children.map(c => `${state.permissions[c.path] || (c.dir ? 'drwxr-xr-x' : '-rw-r--r--')}  ${c.dir ? '4.0K' : `${Math.max(1, (state.files.get(c.path) || '').length)}B`}  student student  Oct 23 09:12  ${c.dir ? `${c.name}/` : c.name}`).join('\n')
  }

  function executeSingle(command, pipeInput = null) {
    const trimmed = command.trim()
    if (!trimmed) return ''
    const lowered = trimmed.toLowerCase()
    const words = parseWords(trimmed)
    const cmd = (words[0] || '').toLowerCase()
    const args = words.slice(1)
    const argLine = args.join(' ')

    if (cmd === 'sudo') {
      if (!args.length) return 'usage: sudo COMMAND (password prompt tidak digunakan pada simulasi)'
      if (args[0] === '-u' && args.length > 2) return executeSingle(args.slice(2).join(' '), pipeInput)
      return executeSingle(trimmed.replace(/^sudo\s+/, ''), pipeInput)
    }
    if (cmd === 'help' || cmd === 'bash' && args[0] === '--help') return [
      'Ubuntu Lab CLI — daftar perintah simulasi',
      '',
      'Dasar      : help, clear, whoami, id, groups, hostname, pwd, ls, cd, date, uname',
      'File       : mkdir, touch, cat, echo "teks" > file, cp, mv, rm, chmod, stat',
      'Jaringan   : ip a, ip route, ping, getent hosts, ss -tulpn, curl -I URL',
      'Service    : systemctl status|start|stop|restart SERVICE, journalctl -u SERVICE',
      'Keamanan   : ufw status, ufw allow PORT, adduser, groupadd, usermod',
      'Paket      : apt update, apt policy PACKAGE, apt install --simulate PACKAGE',
      'Lab        : module, lab list, lab status, history',
      '',
      'Catatan: semua respons palsu/simulasi di browser. Tidak ada command OS yang dieksekusi.',
    ].join('\n')
    if (cmd === 'whoami') return 'student'
    if (cmd === 'hostname') return 'ubuntu-lab'
    if (cmd === 'hostnamectl') return ' Static hostname: ubuntu-lab\n       Icon name: computer-vm\n         Chassis: vm\n      Machine ID: simulated-ubuntu-machine\n         Virtualization: oracle\n       Operating System: Ubuntu 24.04 LTS'
    if (cmd === 'pwd') return state.cwd
    if (cmd === 'date') return 'Fri Oct 23 09:47:12 WIB 2026'
    if (cmd === 'uname') return args.includes('-a') ? 'Linux ubuntu-lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux (simulated)' : 'Linux'
    if (cmd === 'id') {
      const user = args[0] || 'student'
      if (!state.users.has(user)) return `id: '${user}': no such user`
      const id = user === 'root' ? 0 : user === 'ubuntu' ? 1001 : 1000
      return `uid=${id}(${user}) gid=${id}(${user}) groups=${id}(${user}),27(sudo),4(adm)`
    }
    if (cmd === 'groups') {
      const user = args[0] || 'student'
      return state.users.has(user) ? (state.userGroups[user] || [user]).join(' ') : `groups: '${user}': no such user`
    }
    if (cmd === 'getent') {
      if (args[0] === 'hosts') return args[1] && /ubuntu\.com|google\.com|example\.com/.test(args[1]) ? `91.189.91.81   ${args[1]}\n` : `${args[1] || 'ubuntu-lab'}: Name or service not known`
      if (args[0] === 'passwd') { const text = state.files.get('/etc/passwd') || ''; return args[1] ? text.split('\n').filter(line => line.startsWith(`${args[1]}:`)).join('\n') : text }
      if (args[0] === 'group') { const text = state.files.get('/etc/group') || ''; return args[1] ? (text.split('\n').find(line => line.startsWith(`${args[1]}:`)) || `${args[1]}:x:${state.groups.has(args[1]) ? 1002 : ''}:`) : text }
      return ''
    }
    if (cmd === 'env') return 'HOME=/home/student\nLANG=en_US.UTF-8\nSHELL=/bin/bash\nUSER=student\nTERM=xterm-256color'
    if (cmd === 'history') return state.history.map((c, i) => `${String(i + 1).padStart(4, ' ')}  ${c}`).join('\n')
    if (cmd === 'module') return `${scenario.title}\n${scenario.intro}\n\nPerintah latihan yang disarankan:\n${scenario.commands.map(c => `  $ ${c}`).join('\n')}`
    if (cmd === 'lab') {
      if (args[0] === 'status') return `Modul aktif: ${scenario.title}\nFilesystem: in-memory\nBackend: none (browser-only)\nPerubahan: sementara selama sesi ini`
      return Object.entries(moduleScenarios).map(([id, item]) => `${id.padEnd(18)} ${item.title}`).join('\n')
    }
    if (cmd === 'clear' || cmd === 'reset') return '__CLEAR__'
    if (cmd === 'exit' || cmd === 'logout') return 'Sesi simulasi tetap aktif. Tutup tab untuk keluar dari lab.'
    if (cmd === 'history' && args.length) return ''
    if (cmd === 'ls' || cmd === 'dir') {
      const long = args.some(a => a.includes('l'))
      const all = args.some(a => a.includes('a'))
      const pathArg = args.filter(a => !a.startsWith('-'))[0] || state.cwd
      const path = normalizePath(pathArg)
      if (args.some(a => a === '-ld' || a === '-dl' || (a.startsWith('-') && a.includes('d')))) return `${state.permissions[path] || (state.directories.has(path) ? 'drwxr-xr-x' : '-rw-r--r--')}  student student  ${path}`
      return listDirectory(path, long, all)
    }
    if (cmd === 'cd') {
      const nextPath = normalizePath(args[0] || '/home/student')
      if (!state.directories.has(nextPath)) return `bash: cd: ${args[0] || nextPath}: No such file or directory`
      state.cwd = nextPath
      return ''
    }
    if (cmd === 'mkdir') {
      const paths = args.filter(a => !a.startsWith('-'))
      if (!paths.length) return 'mkdir: missing operand'
      const output = []
      for (const rawPath of paths) {
        const path = normalizePath(rawPath)
        if (exists(path) && !args.includes('-p')) output.push(`mkdir: cannot create directory '${rawPath}': File exists`)
        else {
          state.directories.add(path)
          state.permissions[path] = 'drwxr-xr-x'
        }
      }
      return output.join('\n')
    }
    if (cmd === 'touch') {
      if (!args.length) return 'touch: missing file operand'
      for (const item of args) { const path = normalizePath(item); if (!state.directories.has(path)) state.files.set(path, state.files.get(path) || '') }
      return ''
    }
    if (cmd === 'cat') {
      const paths = args.filter(a => !a.startsWith('-'))
      if (!paths.length) return pipeInput || 'cat: missing file operand'
      return paths.map(raw => {
        const path = normalizePath(raw)
        if (state.files.has(path)) return state.files.get(path).replace(/\n$/, '')
        if (state.directories.has(path)) return `cat: ${raw}: Is a directory`
        return `cat: ${raw}: No such file or directory`
      }).join('\n')
    }
    if (cmd === 'echo') return args.join(' ')
    if (cmd === 'cp' || cmd === 'mv') {
      const paths = args.filter(a => !a.startsWith('-'))
      if (paths.length < 2) return `${cmd}: missing file operand`
      const from = normalizePath(paths[0]); const to = normalizePath(paths[1])
      if (!state.files.has(from)) return `${cmd}: cannot stat '${paths[0]}': No such file or directory`
      state.files.set(to, state.files.get(from))
      if (cmd === 'mv') state.files.delete(from)
      return ''
    }
    if (cmd === 'rm') {
      const targets = args.filter(a => !a.startsWith('-'))
      if (!targets.length) return 'rm: missing operand'
      const output = []
      for (const raw of targets) {
        const path = normalizePath(raw)
        if (path === '/' || path === '/etc' || path === '/home' || path === '/usr' || path === '/var') { output.push(`rm: refusing to remove protected path '${raw}' in this simulator`); continue }
        if (state.files.delete(path)) { if (path === '/var/tmp/log-lama.bin') state.diskFull = false; continue }
        if (state.directories.has(path)) {
          if (!args.some(a => a.includes('r'))) { output.push(`rm: cannot remove '${raw}': Is a directory`); continue }
          for (const file of [...state.files.keys()]) if (file.startsWith(`${path}/`)) state.files.delete(file)
          for (const dir of [...state.directories]) if (dir === path || dir.startsWith(`${path}/`)) state.directories.delete(dir)
          continue
        }
        output.push(`rm: cannot remove '${raw}': No such file or directory`)
      }
      if (!state.files.has('/etc/nginx/conf.d/rusak.conf')) {
        state.brokenNginx = false
        state.services.nginx = state.services.nginx === 'failed' ? 'inactive' : state.services.nginx
      }
      return output.join('\n')
    }
    if (cmd === 'chmod') {
      if (args.length < 2) return 'chmod: missing operand'
      const path = normalizePath(args[args.length - 1])
      if (!exists(path)) return `chmod: cannot access '${args[args.length - 1]}': No such file or directory`
      state.permissions[path] = `${state.directories.has(path) ? 'd' : '-'}${args[0]} (simulated)`
      return ''
    }
    if (cmd === 'chown') return args.length >= 2 ? '' : 'chown: missing operand'
    if (cmd === 'stat') {
      const path = normalizePath(args.filter(a => !a.startsWith('-'))[0] || '.')
      return exists(path) ? `  File: ${path}\n  Size: ${(state.files.get(path) || '').length}\nAccess: ${state.permissions[path] || (state.directories.has(path) ? 'drwxr-xr-x' : '-rw-r--r--')}\nModify: 2026-10-23 09:12:00 WIB` : `stat: cannot statx '${path}': No such file or directory`
    }
    if (cmd === 'df') {
      if (args.includes('/mnt/data') && state.mountedData) return 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sdb1       4.9G   24K  4.6G   1% /mnt/data'
      if (args.includes('-i')) return `Filesystem       Inodes IUsed IFree IUse% Mounted on\n/dev/sda2        1310720 45210 1265510    4% /${state.mountedData ? '\n/dev/sdb1        327680  1024 326656    1% /mnt/data' : ''}`
      return state.diskFull
        ? 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        20G   18G  1.0G  95% /\n/dev/sda1       1.0G  180M  844M  18% /boot'
        : 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        20G  8.4G   11G  45% /\n/dev/sda1       1.0G  180M  844M  18% /boot'
    }
    if (cmd === 'du') return '/var/log/nginx          12M\n/var/log                540M\n/var/cache              1.2G\n/var                    2.1G'
    if (cmd === 'lsblk') return 'NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda      8:0    0   20G  0 disk\n├─sda1   8:1    0    1G  0 part /boot\n└─sda2   8:2    0   19G  0 part /'
    if (cmd === 'free') return '               total        used        free      shared  buff/cache   available\nMem:           1.9Gi       612Mi       730Mi        12Mi       590Mi       1.1Gi\nSwap:          1.0Gi          0B       1.0Gi'
    if (cmd === 'uptime') return ' 09:47:12 up 3 days,  2:14,  1 user,  load average: 0.12, 0.18, 0.15'
    if (cmd === 'nproc') return '2'
    if (cmd === 'vmstat') return 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 747520  64200 604112    0    0     5    12  121  243  2  1 96  1  0'
    if (cmd === 'top') return 'top - 09:47:12 up 3 days,  2:14,  1 user,  load average: 0.12, 0.18, 0.15\nTasks: 118 total, 1 running, 117 sleeping, 0 stopped, 0 zombie\n%Cpu(s):  2.1 us,  1.3 sy,  0.0 ni, 96.0 id\nMiB Mem :  2048.0 total,  748.0 free,  612.0 used,  688.0 buff/cache\n  PID USER      %CPU %MEM COMMAND\n  812 www-data   0.7  1.8 nginx\n  631 root       0.2  0.9 sshd\n 1042 student    0.1  0.6 bash'
    if (cmd === 'ps') return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.2 167000 10240 ?        Ss   Oct20   0:03 /sbin/init\nroot       631  0.0  0.5  15432  6144 ?        Ss   Oct20   0:00 sshd\nwww-data   812  0.1  1.8  76432 36864 ?        S    Oct20   0:12 nginx: worker process\nstudent   1042  0.0  0.6   9216 12288 pts/0    Ss   09:42   0:00 bash${state.yesRunning ? '\nstudent   2345 99.0  0.1   4096   512 pts/0    R    09:47   0:00 yes' : ''}`
    if (cmd === 'ip') {
      const sub = args[0]
      if ((sub === 'a' || sub === 'addr' || sub === 'address') && args.includes('-br')) return 'lo               UNKNOWN        127.0.0.1/8 ::1/128\nenp0s3           UP             192.168.56.101/24 fe80::a00:27ff:fea1:b2c3/64'
      if (sub === 'a' || sub === 'addr' || sub === 'address') return '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default\n    inet 127.0.0.1/8 scope host lo\n2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default\n    link/ether 08:00:27:a1:b2:c3 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.56.101/24 brd 192.168.56.255 scope global dynamic enp0s3\n    inet6 fe80::a00:27ff:fea1:b2c3/64 scope link'
      if (sub === 'route' || sub === 'r') return 'default via 192.168.56.1 dev enp0s3 proto dhcp metric 100\n192.168.56.0/24 dev enp0s3 proto kernel scope link src 192.168.56.101'
      if (sub === 'link') return '1: lo: <LOOPBACK,UP,LOWER_UP> state UNKNOWN\n2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> state UP'
      return 'Usage: ip [ a | addr | route | link ]'
    }
    if (cmd === 'ping') {
      const target = args.filter(a => !a.startsWith('-')).at(-1) || '127.0.0.1'
      return `PING ${target} (${target === 'ubuntu.com' ? '91.189.91.81' : target}) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.43 ms\n64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.39 ms\n64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.42 ms\n64 bytes from ${target}: icmp_seq=4 ttl=64 time=0.41 ms\n\n--- ${target} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms\nrtt min/avg/max/mdev = 0.390/0.412/0.430/0.016 ms (simulated)`
    }
    if (cmd === 'ss' || cmd === 'netstat') {
      const ports = ['State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process', 'LISTEN 0      4096   0.0.0.0:22        0.0.0.0:*     users:(("sshd",pid=631,fd=3))']
      if (state.services.nginx === 'active') ports.push('LISTEN 0      511    0.0.0.0:80        0.0.0.0:*     users:(("nginx",pid=812,fd=6))', 'LISTEN 0      511    0.0.0.0:443       0.0.0.0:*     users:(("nginx",pid=812,fd=7))')
      if (state.pythonServerRunning) ports.push('LISTEN 0      5      0.0.0.0:80        0.0.0.0:*     users:(("python3",pid=2301,fd=3))')
      return ports.join('\n')
    }
    if (cmd === 'systemctl' || cmd === 'service') {
      const action = args[0]
      const service = (args[1] || 'nginx').replace(/\.service$/, '')
      if (action === 'status') {
        const active = state.services[service] || 'inactive'
        const lines = [`${active === 'active' ? '●' : '×'} ${service}.service - ${service === 'nginx' ? 'A high performance web server' : service === 'ssh' ? 'OpenBSD Secure Shell server' : `${service} service`}`, `     Loaded: loaded (/lib/systemd/system/${service}.service; enabled; preset: enabled)`, `     Active: ${active === 'active' ? 'active (running)' : active === 'failed' ? 'failed (Result: exit-code)' : 'inactive (dead)'} since Fri 2026-10-23 09:41:12 WIB; 6min ago`]
        if (service === 'nginx' && state.portCollision) { state.services.nginx = 'failed'; return 'nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use) (simulated)' }
        if (service === 'nginx' && state.brokenNginx) lines.push('    Process: 809 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=1/FAILURE)', 'Oct 23 09:41:12 ubuntu-lab nginx[809]: nginx: [emerg] unknown directive "baris_salah"')
        return lines.join('\n')
      }
      if (action === 'is-active') return state.services[service] === 'active' ? 'active' : state.services[service] || 'inactive'
      if (action === 'is-enabled') return ['nginx', 'ssh', 'cron'].includes(service) ? 'enabled' : 'disabled'
      if (['start', 'restart', 'try-restart'].includes(action)) {
        if (service === 'nginx' && state.brokenNginx) { state.services.nginx = 'failed'; return `Job for ${service}.service failed because the control process exited with error code.\nSee "systemctl status ${service}.service" and "journalctl -xeu ${service}.service" for details.` }
        state.services[service] = 'active'
        return ''
      }
      if (action === 'stop') { state.services[service] = 'inactive'; return '' }
      if (action === 'enable') return `Created symlink /etc/systemd/system/multi-user.target.wants/${service}.service → /lib/systemd/system/${service}.service.`
      if (action === 'disable') return `Removed "/etc/systemd/system/multi-user.target.wants/${service}.service".`
      if (action === 'list-units' || action === 'list-unit-files') return 'UNIT                    LOAD   ACTIVE SUB     DESCRIPTION\ncron.service            loaded active running Regular background program processing daemon\nnginx.service           loaded active running A high performance web server\nssh.service              loaded active running OpenBSD Secure Shell server'
      return 'Usage: systemctl status|start|stop|restart|is-active SERVICE'
    }
    if (cmd === 'journalctl') {
      const serviceIndex = args.indexOf('-u')
      const service = serviceIndex >= 0 ? (args[serviceIndex + 1] || 'nginx').replace(/\.service$/, '') : ''
      const lines = service === 'nginx' && state.brokenNginx
        ? ['Oct 23 09:41:12 ubuntu-lab systemd[1]: Starting A high performance web server...', 'Oct 23 09:41:12 ubuntu-lab nginx[809]: nginx: [emerg] unknown directive "baris_salah" in /etc/nginx/conf.d/rusak.conf:1', 'Oct 23 09:41:12 ubuntu-lab systemd[1]: nginx.service: Control process exited, code=exited, status=1/FAILURE', 'Oct 23 09:41:12 ubuntu-lab systemd[1]: nginx.service: Failed with result "exit-code".']
        : ['Oct 23 09:00:01 ubuntu-lab systemd[1]: Started OpenSSH server daemon.', 'Oct 23 09:02:21 ubuntu-lab systemd[1]: Started A high performance web server.', 'Oct 23 09:10:03 ubuntu-lab CRON[1204]: (root) CMD (run-parts /etc/cron.hourly)']
      return lines.join('\n')
    }
    if (cmd === 'nginx') {
      if (args[0] === '-t' || args[0] === '-T') return state.brokenNginx
        ? '2026/10/23 09:41:12 [emerg] unknown directive "baris_salah" in /etc/nginx/conf.d/rusak.conf:1\nnginx: configuration file /etc/nginx/nginx.conf test failed'
        : 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful'
      return 'nginx: use -t to test the simulated configuration.'
    }
    if (cmd === 'curl') {
      if (state.services.nginx !== 'active') return 'curl: (7) Failed to connect to localhost port 80 after 0 ms: Connection refused (simulated)'
      return 'HTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nDate: Fri, 23 Oct 2026 02:47:12 GMT\nContent-Type: text/html\nContent-Length: 615\nConnection: keep-alive'
    }
    if (cmd === 'ufw') {
      const action = args[0]
      if (action === 'status') return `${state.ufwEnabled ? 'Status: active' : 'Status: inactive'}${args.includes('verbose') ? '\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)' : ''}\n\nTo                         Action      From\n--                         ------      ----\n${state.ufwRules.join('\n') || '(no rules)'}`
      if (action === 'allow' || action === 'deny' || action === 'delete') {
        const rule = args.slice(1).join(' ')
        const port = rule.replace(/\/tcp|\/udp/g, '')
        if (action === 'allow') {
          const display = `${port.padEnd(26)} ALLOW IN    Anywhere`
          if (!state.ufwRules.some(r => r.startsWith(port.padEnd(26)))) state.ufwRules.push(display)
          return `Rule added\nRule added (v6) (simulated)`
        }
        if (action === 'deny') { state.ufwRules.push(`${port.padEnd(26)} DENY IN     Anywhere`); return 'Rule added (simulated)' }
        state.ufwRules = state.ufwRules.filter(r => !r.startsWith(port.padEnd(26)))
        return 'Rule deleted (simulated)'
      }
      if (action === 'enable') { state.ufwEnabled = true; return 'Firewall is active and enabled on system startup (simulated)' }
      if (action === 'disable') { state.ufwEnabled = false; return 'Firewall stopped and disabled on system startup (simulated)' }
      if (action === 'default') return 'Default incoming policy changed (simulated)'
      return 'Usage: sudo ufw status|allow|deny|enable|disable'
    }
    if (cmd === 'adduser' || cmd === 'useradd') {
      const user = args.filter(a => !a.startsWith('-') && !['--disabled-password', '--gecos'].includes(a)).at(-1)
      if (!user || user === '""') return 'adduser: Please enter a username to add.'
      if (state.users.has(user)) return `The user '${user}' already exists.`
      state.users.add(user); state.userGroups[user] = [user]
      const line = `${user}:x:${Object.keys(state.userGroups).length + 1000}:${Object.keys(state.userGroups).length + 1000}:${user}:/home/${user}:/bin/bash\n`
      state.files.set('/etc/passwd', `${state.files.get('/etc/passwd') || ''}${line}`)
      return `Adding user '${user}' ...\nCreating home directory '/home/${user}' ...\nUser '${user}' added (simulated).`
    }
    if (cmd === 'groupadd') {
      const group = args.filter(a => !a.startsWith('-')).at(-1)
      if (!group) return 'groupadd: missing group name'
      if (state.groups.has(group)) return `groupadd: group '${group}' already exists`
      state.groups.add(group)
      return `Group '${group}' created (simulated).`
    }
    if (cmd === 'usermod') {
      const groupIndex = args.indexOf('-aG')
      if (groupIndex >= 0 && args[groupIndex + 2]) {
        const group = args[groupIndex + 1]; const user = args[groupIndex + 2]
        if (!state.users.has(user)) return `usermod: user '${user}' does not exist`
        if (!state.groups.has(group)) return `usermod: group '${group}' does not exist`
        state.userGroups[user] = [...new Set([...(state.userGroups[user] || [user]), group])]
        return ''
      }
      return 'Usage: usermod -aG GROUP USER'
    }
    if (cmd === 'apt' || cmd === 'apt-get') {
      const action = args[0]
      const packageName = args.filter(a => !a.startsWith('-'))[1]
      if (action === 'update') return 'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nHit:2 http://security.ubuntu.com/ubuntu noble-security InRelease\nReading package lists... Done (simulated)\nAll package indexes are up to date.'
      if (action === 'policy') return `nginx:\n  Installed: ${state.installed.has(packageName || 'nginx') ? '1.24.0-2ubuntu7' : '(none)'}\n  Candidate: 1.24.0-2ubuntu7\n  Version table:\n *** 1.24.0-2ubuntu7 500\n        500 http://archive.ubuntu.com/ubuntu noble/main amd64 Packages`
      if (action === 'search') return `${packageName || 'htop'} - interactive processes viewer\nnginx - small, powerful, scalable web/proxy server`
      if (action === 'install' && args.includes('--simulate')) return `NOTE: This is only a simulation!\nThe following NEW packages would be installed:\n  ${packageName || 'htop'}\n0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.`
      if (action === 'install') { if (packageName) state.installed.add(packageName); return `Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed: ${packageName || 'package'}\nSetting up ${packageName || 'package'} (simulated) ...\nInstallation completed in mock environment.` }
      if (action === 'remove' || action === 'purge') { if (packageName) state.installed.delete(packageName); return `Package ${packageName || ''} removed from simulated package state.` }
      return 'Usage: apt update|search|policy|install [--simulate] PACKAGE'
    }
    if (cmd === 'which' || cmd === 'command') {
      const executable = cmd === 'command' ? args.at(-1) : args[0]
      return state.installed.has(executable) || ['ls', 'cat', 'grep', 'chmod', 'mkdir', 'touch', 'echo', 'cd', 'pwd', 'whoami', 'bash', 'ip', 'ss', 'systemctl', 'journalctl'].includes(executable)
        ? `/usr/bin/${executable}` : ` ${executable}: not found`.trim()
    }
    if (cmd === 'grep') {
      const pattern = args.filter(a => !a.startsWith('-'))[0] || ''
      const source = pipeInput ?? args.filter(a => !a.startsWith('-')).slice(1).map(p => state.files.get(normalizePath(p)) || '').join('\n')
      try { return String(source).split('\n').filter(line => new RegExp(pattern, args.includes('-i') ? 'i' : '').test(line)).join('\n') } catch { return `grep: invalid regular expression: ${pattern}` }
    }
    if (cmd === 'head' || cmd === 'tail') {
      const nIndex = args.indexOf('-n')
      const shortCount = args.find(a => /^-\d+$/.test(a))
      const count = nIndex >= 0 ? Number(args[nIndex + 1]) || 10 : shortCount ? Number(shortCount.slice(1)) || 10 : 10
      const file = args.filter(a => !a.startsWith('-') && !/^\d+$/.test(a))[0]
      const text = pipeInput ?? (file ? state.files.get(normalizePath(file)) : '')
      const lines = String(text || '').split('\n')
      return (cmd === 'head' ? lines.slice(0, count) : lines.slice(-count)).join('\n')
    }
    if (cmd === 'sort') return String(pipeInput || '').split('\n').sort().join('\n')
    if (cmd === 'wc') return `${String(pipeInput || '').split('\n').length} ${args.includes('-l') ? '' : '0 0'}`.trim()
    if (cmd === 'tar') {
      const archive = args.find(a => a.endsWith('.tar.gz'))
      if (args.includes('-tzf')) return archive ? 'data-uji/\ndata-uji/catatan.txt' : 'tar: no archive specified'
      if (args.includes('-czf') && archive) { state.files.set(normalizePath(archive), '[simulated gzip archive]'); return '' }
      if (args.includes('-xzf') && archive) {
        const destAt = args.indexOf('-C')
        const destination = normalizePath(destAt >= 0 ? args[destAt + 1] : '.')
        const restoredDir = normalizePath('data-uji', destination)
        state.directories.add(restoredDir)
        state.files.set(`${restoredDir}/catatan.txt`, state.files.get('/home/student/data-uji/catatan.txt') || 'dokumen penting\n')
        return `Archive extracted to ${destination} (simulated).`
      }
      return 'tar: simulated usage: tar -czf ARCHIVE.tar.gz FILES or tar -tzf ARCHIVE.tar.gz'
    }
    if (cmd === 'diff') return 'Files are identical (simulated).'
    if (cmd === 'find') return state.files.has('/var/tmp/log-lama.bin') ? '/var/tmp/log-lama.bin (1.0G, simulated)' : '/var/log/nginx/error.log (12M, simulated)'
    if (cmd === 'apt-mark') {
      const action = args[0]; const pkg = args[1]
      if (action === 'hold' && pkg) { state.heldPackages.add(pkg); return `${pkg} set on hold (simulated).` }
      if (action === 'unhold' && pkg) { state.heldPackages.delete(pkg); return `${pkg} set off hold (simulated).` }
      if (action === 'showhold') return [...state.heldPackages].join('\n')
      return 'Usage: apt-mark hold|unhold|showhold PACKAGE'
    }
    if (cmd === 'dpkg') {
      if (args[0] === '-l') return 'Desired=Unknown/Install/Remove/Purge/Hold\n||/ Name           Version             Architecture Description\n+++-==============-===================-============-==========================\nii  nginx          1.24.0-2ubuntu7     amd64        small, powerful web server\nii  openssh-server 1:9.6p1-3ubuntu13   amd64        secure shell server'
      if (args[0] === '-L') return '/usr/sbin/nginx\n/etc/nginx/nginx.conf\n/lib/systemd/system/nginx.service'
      if (args[0] === '--configure' || args[0] === '--configure-a') return 'dpkg package configuration completed (simulated).'
      return 'dpkg: package manager response simulated.'
    }
    if (cmd === 'dpkg-reconfigure') return 'Package configuration dialog is unavailable in a browser. Configuration step simulated.'
    if (cmd === 'rsync') {
      const paths = args.filter(a => !a.startsWith('-'))
      if (paths.length >= 2) {
        const source = normalizePath(paths[0].replace(/\/$/, '')); const destination = normalizePath(paths[1].replace(/\/$/, ''))
        state.directories.add(destination)
        for (const [file, content] of state.files) if (file.startsWith(`${source}/`)) state.files.set(`${destination}/${file.slice(source.length + 1)}`, content)
        return 'sending incremental file list\ncatatan.txt\nsent 182 bytes  received 35 bytes  434.00 bytes/sec\ntotal size is 18  speedup is 0.08 (simulated)'
      }
      return 'rsync: source and destination are required'
    }
    if (cmd === 'tee') {
      const pathArg = args.filter(a => !a.startsWith('-')).at(-1)
      if (!pathArg) return pipeInput || ''
      const path = normalizePath(pathArg); const content = String(pipeInput || '')
      state.files.set(path, `${args.includes('-a') ? (state.files.get(path) || '') : ''}${content}\n`)
      return content
    }
    if (cmd === 'ssh-keygen') return 'Generating public/private ed25519 key pair (simulated).\nYour identification has been saved in /home/student/.ssh/id_ed25519.\nYour public key has been saved in /home/student/.ssh/id_ed25519.pub.'
    if (cmd === 'ssh-copy-id') return '1 key(s) added. Now try logging into the machine (simulated).'
    if (cmd === 'ssh') return 'Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-45-generic x86_64)\nAuthenticated with public key (simulated).'
    if (cmd === 'sshd') return 'sshd: configuration file /etc/ssh/sshd_config test is successful (simulated).'
    if (cmd === 'resolvectl') return 'Global\n       Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported\n resolv.conf mode: stub\nLink 2 (enp0s3)\n    Current Scopes: DNS\n         DNS Servers: 192.168.56.1'
    if (cmd === 'tracepath') return ` 1?: [LOCALHOST] pmtu 1500\n 1:  192.168.56.1  0.400ms\n 2:  ${args.at(-1) || 'ubuntu.com'}  5.20ms reached (simulated)`
    if (cmd === 'fallocate') { const path = normalizePath(args.at(-1)); state.files.set(path, '[simulated 1 GB sparse file]'); state.diskFull = true; return `Created simulated large file: ${path} (1 GB mock data).` }
    if (cmd === 'yes') { state.yesRunning = true; return '[1] 2345 (background process simulated)' }
    if (cmd === 'pgrep') return state.yesRunning ? '2345 yes' : ''
    if (cmd === 'kill') { state.yesRunning = false; return 'Signal sent to simulated process (if it existed).' }
    if (cmd === 'pkill') { if (argLine.includes('http.server')) { state.pythonServerRunning = false; state.portCollision = false; return 'Stopped simulated python http server.' } state.yesRunning = false; return 'Stopped matching simulated process.' }
    if (cmd === 'python3') { if (args.includes('-m') && args.includes('http.server')) { state.pythonServerRunning = true; state.portCollision = true; return '[1] 2301\nServing HTTP on 0.0.0.0 port 80 (simulated background server)' } return 'Python is available only as a mocked lab command.' }
    if (cmd === 'nano' || cmd === 'vim' || cmd === 'vi') return 'Interactive editor is not implemented. For simulated files, use echo "content" > path or tee.'
    if (cmd === 'crontab') return args[0] === '-l' ? '0 2 * * * tar -czf $HOME/backup/data-$(date +%F).tar.gz -C $HOME data-uji' : 'crontab editor tidak dijalankan di browser. Gunakan crontab -l untuk melihat contoh.'
    if (cmd === 'man') return args[0] ? `${args[0].toUpperCase()}(1) — ringkasan bantuan\nPerintah ini ditangani sebagai simulasi pembelajaran. Ketik help untuk daftar perintah yang tersedia.` : 'What manual page do you want?'
    if (cmd === 'blkid') return '/dev/sda1: UUID=1111-AAAA TYPE="ext4" PARTUUID=simulated-01\n/dev/sda2: UUID=2222-BBBB TYPE="ext4" PARTUUID=simulated-02\n/dev/sdb1: UUID=3333-CCCC TYPE="ext4" PARTUUID=simulated-03'
    if (cmd === 'parted') { state.diskExists = true; return 'Information: You may need to update /etc/fstab.\nPartition table created on /dev/sdb (simulated).' }
    if (cmd.startsWith('mkfs')) return `mke2fs: creating ext4 filesystem on ${args.at(-1) || '/dev/sdb1'} (simulated).\nFilesystem UUID: 3333-CCCC`
    if (cmd === 'mount') { if (args.length >= 2) { state.diskExists = true; state.mountedData = true; state.directories.add('/mnt/data'); return 'Mounted /dev/sdb1 on /mnt/data (simulated).' } return '/dev/sda2 on / type ext4 (rw,relatime)\n/dev/sdb1 on /mnt/data type ext4 (rw,relatime) (simulated)' }
    if (cmd === 'umount') { state.mountedData = false; return 'Filesystem unmounted (simulated).' }
    if (cmd === 'fdisk') return 'Disk /dev/sdb: 5 GiB, 5368709120 bytes (simulated partition table).'
    if (cmd === 'reboot' || cmd === 'shutdown' || cmd === 'poweroff') return 'Aksi power sistem dinonaktifkan. Ini hanya terminal simulasi di browser.'
    if (cmd === 'printf') return args.join(' ').replace(/\\n/g, '\n').replace(/%s/g, '')
    if (cmd === 'true') return ''
    if (cmd === 'false') return 'Command returned exit status 1 (simulated).'
    if (pipeInput !== null && !trimmed) return pipeInput
    return `bash: ${words[0]}: command not found\nPerintah ini tidak dijalankan. Ketik help untuk melihat command simulasi.`
  }

  function splitCommandChain(command) {
    const parts = []
    const operators = []
    let quote = ''
    let escaped = false
    let start = 0
    for (let i = 0; i < command.length; i += 1) {
      const char = command[i]
      if (escaped) { escaped = false; continue }
      if (char === '\\' && quote) { escaped = true; continue }
      if ((char === '"' || char === "'") && (!quote || quote === char)) { quote = quote ? '' : char; continue }
      if (quote) continue
      const pair = command.slice(i, i + 2)
      if (pair === '&&' || pair === '||') {
        parts.push(command.slice(start, i).trim())
        operators.push(pair)
        i += 1
        start = i + 1
      } else if (char === ';') {
        parts.push(command.slice(start, i).trim())
        operators.push(';')
        start = i + 1
      }
    }
    if (start > 0) parts.push(command.slice(start).trim())
    return { parts, operators }
  }

  function execute(rawCommand, nested = false) {
    const command = String(rawCommand || '').trim().replace(/\$\(\s*date\s+\+%F\s*\)/g, '2026-10-23')
    if (!command) return ''
    if (!nested) state.history.push(command)

    const chain = splitCommandChain(command)
    if (chain.parts.length > 1) {
      let previousSuccess = true
      const results = []
      for (let i = 0; i < chain.parts.length; i += 1) {
        const operator = chain.operators[i - 1]
        if (operator === '&&' && !previousSuccess) continue
        if (operator === '||' && previousSuccess) continue
        const output = execute(chain.parts[i], true)
        if (output === '__CLEAR__') return '__CLEAR__'
        if (output) results.push(String(output))
        previousSuccess = !/(?:command not found|\bfailed\b|syntax.*failed|cannot |no such file or directory|permission denied|unknown directive|refusing to remove|name or service not known)/i.test(String(output))
      }
      return results.join('\n')
    }

    // Supports safe, in-memory echo redirection; no files outside the simulated map are touched.
    const redirect = command.match(/^echo\s+(.+?)\s*(>>|>)\s*(.+)$/)
    if (redirect) {
      const text = redirect[1].replace(/^(['"])(.*)\1$/, '$2').replace(/\\n/g, '\n')
      const path = normalizePath(redirect[3].trim())
      if (state.directories.has(path)) return `bash: ${redirect[3]}: Is a directory`
      const previous = redirect[2] === '>>' ? (state.files.get(path) || '') : ''
      state.files.set(path, `${previous}${text}\n`)
      return ''
    }

    const pipes = command.split(/\s+\|\s+/)
    let output = executeSingle(pipes[0])
    if (output === '__CLEAR__') return '__CLEAR__'
    for (const stage of pipes.slice(1)) {
      const cmd = stage.trim().split(/\s+/)[0]
      if (['grep', 'head', 'tail', 'sort', 'wc', 'cat'].includes(cmd)) output = executeSingle(stage, output)
      else output = executeSingle(stage)
    }
    return output == null ? '' : String(output)
  }

  return { state, scenario, execute }
}
