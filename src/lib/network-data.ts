
export type NetworkType = 
  | 'lan' 
  | 'man' 
  | 'wan' 
  | 'pan' 
  | 'can' 
  | 'gan' 
  | 'wlan' 
  | 'epn' 
  | 'vpn' 
  | 'san';

export interface NetworkInfo {
  id: NetworkType;
  name: string;
  description: string;
  bandwidth: number;  // Mbps
  latency: number;    // ms
  packetLoss: number; // percentage
  range: number;      // km
  encryption: boolean;
  color: string;
  icon: string;
}

export interface NetworkMetrics {
  throughput: number;       // Mbps
  packetsSent: number;      // count
  packetsReceived: number;  // count
  packetLoss: number;       // percentage
  latency: number;          // ms
  jitter: number;           // ms
}

export const networkData: Record<NetworkType, NetworkInfo> = {
  lan: {
    id: 'lan',
    name: 'Local Area Network',
    description: 'A network that connects computers within a limited area such as a home, school, or office building.',
    bandwidth: 1000,
    latency: 1,
    packetLoss: 0.01,
    range: 0.1,
    encryption: false,
    color: '#3498db',
    icon: 'lan',
  },
  man: {
    id: 'man',
    name: 'Metropolitan Area Network',
    description: 'A network that connects computers within a city or large campus.',
    bandwidth: 500,
    latency: 5,
    packetLoss: 0.5,
    range: 50,
    encryption: false,
    color: '#9b59b6',
    icon: 'network',
  },
  wan: {
    id: 'wan',
    name: 'Wide Area Network',
    description: 'A network that spans a large geographical area, often connecting different LANs.',
    bandwidth: 100,
    latency: 50,
    packetLoss: 1,
    range: 1000,
    encryption: false,
    color: '#e74c3c',
    icon: 'wan',
  },
  pan: {
    id: 'pan',
    name: 'Personal Area Network',
    description: 'A network for connecting devices centered around an individual person, typically within a range of 10 meters.',
    bandwidth: 50,
    latency: 10,
    packetLoss: 0.1,
    range: 0.01,
    encryption: true,
    color: '#2ecc71',
    icon: 'bluetooth',
  },
  can: {
    id: 'can',
    name: 'Campus Area Network',
    description: 'A network that connects multiple LANs within a university or business campus.',
    bandwidth: 800,
    latency: 3,
    packetLoss: 0.2,
    range: 5,
    encryption: false,
    color: '#f39c12',
    icon: 'network',
  },
  gan: {
    id: 'gan',
    name: 'Global Area Network',
    description: 'A network that spans the globe, often using satellite links.',
    bandwidth: 50,
    latency: 500,
    packetLoss: 2,
    range: 20000,
    encryption: true,
    color: '#1abc9c',
    icon: 'globe',
  },
  wlan: {
    id: 'wlan',
    name: 'Wireless Local Area Network',
    description: 'A network that connects devices wirelessly in a local area.',
    bandwidth: 300,
    latency: 2,
    packetLoss: 0.5,
    range: 0.1,
    encryption: true,
    color: '#d35400',
    icon: 'wifi',
  },
  epn: {
    id: 'epn',
    name: 'Enterprise Private Network',
    description: 'A network used by enterprises to connect multiple offices and remote workers securely.',
    bandwidth: 500,
    latency: 20,
    packetLoss: 0.1,
    range: 100,
    encryption: true,
    color: '#8e44ad',
    icon: 'server',
  },
  vpn: {
    id: 'vpn',
    name: 'Virtual Private Network',
    description: 'A technology that creates a secure encrypted connection over a less secure network.',
    bandwidth: 50,
    latency: 80,
    packetLoss: 0.5,
    range: 10000,
    encryption: true,
    color: '#2c3e50',
    icon: 'lock',
  },
  san: {
    id: 'san',
    name: 'Storage Area Network',
    description: 'A dedicated network that provides access to consolidated storage devices.',
    bandwidth: 1500,
    latency: 0.5,
    packetLoss: 0.01,
    range: 0.1,
    encryption: false,
    color: '#16a085',
    icon: 'database',
  },
};
