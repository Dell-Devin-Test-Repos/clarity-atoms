export interface Server {
  id: number;
  name: string;
  site: string;
  role: string;
  cpu: number;
  status: 'Healthy' | 'Degraded' | 'Offline';
}

const sites = ['Round Rock', 'Austin', 'Bangalore', 'Cork', 'Singapore'];
const roles = ['Compute', 'Storage', 'Gateway', 'Backup'];
const statuses: Server['status'][] = ['Healthy', 'Degraded', 'Offline'];


/** Deterministic pseudo random numbers, so the docs render the same every time. */
function random(seed: number) {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

export function makeServers(count: number): Server[] {

  const servers: Server[] = [];

  for (let i = 0; i < count; i++) {
    servers.push({
      id: i + 1,
      name: `pe-r750-${String(i + 1).padStart(4, '0')}`,
      site: sites[Math.floor(random(i + 1) * sites.length)],
      role: roles[Math.floor(random(i + 7) * roles.length)],
      cpu: Math.round(random(i + 13) * 1000) / 10,
      status: statuses[Math.floor(random(i + 23) * statuses.length)]
    });
  }

  return servers;
}
