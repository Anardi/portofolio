export const blogPosts = [
  {
    slug: 'linux-service-troubleshooting',
    title: 'A Repeatable Workflow for Linux Service Troubleshooting',
    category: 'Linux Administration',
    date: '23 October 2026',
    readTime: '5 min read',
    excerpt: 'A practical sequence for checking service state, validating configuration, reading logs, and verifying recovery without restarting blindly.',
    tags: ['systemd', 'journalctl', 'incident response'],
    intro: 'When a Linux service becomes unavailable, start by collecting evidence. A disciplined sequence helps separate a service-state problem from an invalid configuration, a port conflict, or a resource issue.',
    sections: [
      {
        heading: '1. Confirm the service state',
        body: 'Check the service status first and read the recent log entries. Avoid restarting repeatedly before understanding why the process stopped.',
        commands: ['systemctl status nginx --no-pager', 'journalctl -u nginx -n 50 --no-pager'],
      },
      {
        heading: '2. Validate configuration before restart',
        body: 'For Nginx, the configuration test identifies syntax errors and invalid directives. If validation fails, locate the file and line reported by the command, then correct that issue before attempting recovery.',
        commands: ['sudo nginx -t', 'sudo systemctl cat nginx'],
      },
      {
        heading: '3. Check listening ports and capacity',
        body: 'If the configuration is valid but the service is still unavailable, inspect listening sockets and basic system resources. The exact diagnostic path depends on the service and the evidence collected so far.',
        commands: ['sudo ss -lntp', 'df -h', 'free -h'],
      },
      {
        heading: '4. Apply one fix and verify',
        body: 'After correcting the identified cause, restart the service only when appropriate, check its state again, and test from the client side. Record the symptom, cause, change, and verification result in the incident note.',
        commands: ['sudo nginx -t && sudo systemctl restart nginx', 'systemctl is-active nginx', 'curl -I --max-time 5 http://127.0.0.1'],
      },
    ],
    note: 'Commands in this article are examples for a lab environment. Confirm the service name and impact before running commands on a production host.',
  },
  {
    slug: 'linux-permissions-by-design',
    title: 'Linux File Permissions: Start with Identity and Ownership',
    category: 'Linux Fundamentals',
    date: '23 October 2026',
    readTime: '4 min read',
    excerpt: 'A troubleshooting checklist for permission errors using user identity, group membership, directory traversal, ownership, and mode bits.',
    tags: ['permissions', 'users and groups', 'chmod', 'chown'],
    intro: 'A “Permission denied” error does not automatically mean that chmod should be made more permissive. Begin by identifying the account running the command and examining every directory in the target path.',
    sections: [
      {
        heading: '1. Identify the effective user and groups',
        body: 'The result of a test can differ depending on whether it runs under your account, root, a service account, or a scheduled task. Check the identity and current group membership first.',
        commands: ['whoami', 'id', 'getent group devops'],
      },
      {
        heading: '2. Inspect the path and ownership',
        body: 'Use ls and namei to inspect the file and parent-directory permissions. Users need execute permission on each directory in the path to traverse it, even when the final file itself is readable.',
        commands: ['ls -ld /srv /srv/proyek', 'namei -l /srv/proyek/tes.txt', 'stat /srv/proyek'],
      },
      {
        heading: '3. Prefer group-based access for shared folders',
        body: 'For a shared project directory, a dedicated group is often easier to maintain than repeatedly granting access to individual users. The setgid bit can make newly created items inherit the directory group; verify the result using the accounts intended to use the directory.',
        commands: ['sudo chown root:devops /srv/proyek', 'sudo chmod 2770 /srv/proyek', 'ls -ld /srv/proyek'],
      },
      {
        heading: '4. Test with the intended account',
        body: 'Confirm both the allowed and denied cases. Do not default to chmod 777: broad permissions can expose files or allow unintended changes.',
        commands: ['sudo -u budi touch /srv/proyek/permission-test.txt', 'sudo -u tamu ls /srv/proyek'],
      },
    ],
    note: 'Run ownership and permission changes only against the intended lab directory. Review the path carefully before using sudo.',
  },
  {
    slug: 'network-troubleshooting-layers',
    title: 'Network Troubleshooting: Test One Layer at a Time',
    category: 'Networking',
    date: '23 October 2026',
    readTime: '5 min read',
    excerpt: 'A layered sequence for investigating address configuration, routing, DNS resolution, and application reachability on a Linux host.',
    tags: ['TCP/IP', 'DNS', 'routing', 'connectivity'],
    intro: 'A network issue is easier to narrow down when each test answers a specific question. Inspect local configuration first, then routing, name resolution, and finally the application endpoint.',
    sections: [
      {
        heading: '1. Verify the interface and address',
        body: 'Confirm that the expected interface is up and has an address from the correct subnet. Compare the output with the intended VirtualBox adapter configuration or network plan.',
        commands: ['ip -br address', 'ip route'],
      },
      {
        heading: '2. Test reachability carefully',
        body: 'A ping to the configured gateway can help test local network reachability. Some systems or networks filter ICMP, so a failed ping alone does not prove that every service is unreachable.',
        commands: ['ping -c 4 <gateway-ip>', 'ip neigh'],
      },
      {
        heading: '3. Check DNS separately',
        body: 'Test name resolution separately from raw IP connectivity. If an IP endpoint responds but a hostname does not resolve, inspect the resolver configuration and the result from the DNS lookup tool available on that system.',
        commands: ['getent hosts example.com', 'resolvectl status'],
      },
      {
        heading: '4. Verify the application endpoint',
        body: 'Once address, route, and DNS checks are understood, test the actual destination port or HTTP endpoint. Note the exact error and timeout; these details help distinguish resolution, connection, and application-layer failures.',
        commands: ['curl -I --max-time 5 https://example.com', 'ss -lnt'],
      },
    ],
    note: 'Replace placeholder addresses with values from your own lab. Do not publish internal IP addresses, credentials, or sensitive packet captures from a real environment.',
  },
]

export function getBlogPost(slug) {
  return blogPosts.find(post => post.slug === slug)
}
