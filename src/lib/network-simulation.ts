
import { NetworkInfo, NetworkMetrics, NetworkType, networkData } from './network-data';

interface SimulationParams {
  bandwidthModifier: number;   // 0.1 to 2.0
  latencyModifier: number;     // 0.1 to 2.0
  packetLossModifier: number;  // 0.1 to 2.0
  encryption: boolean;
}

const defaultParams: SimulationParams = {
  bandwidthModifier: 1.0,
  latencyModifier: 1.0,
  packetLossModifier: 1.0,
  encryption: false,
};

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'device' | 'router' | 'server' | 'cloud';
  name?: string;
}

interface Link {
  source: string;
  target: string;
  distance?: number;
  bandwidth?: number;
}

interface Packet {
  id: string;
  sourceId: string;
  targetId: string;
  size: number;  // KB
  progress: number; // 0 to 1
  lost: boolean;
  x?: number;
  y?: number;
}

interface NetworkTopology {
  nodes: Node[];
  links: Link[];
  packets: Packet[];
}

// Generate random value with normal distribution
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

// Generate metrics based on network type and simulation params
export function generateNetworkMetrics(
  networkType: NetworkType, 
  params: SimulationParams = defaultParams
): NetworkMetrics {
  const network = networkData[networkType];
  const baseLatency = network.latency * params.latencyModifier;
  const baseBandwidth = network.bandwidth * params.bandwidthModifier;
  const basePacketLoss = network.packetLoss * params.packetLossModifier;
  
  // Add encryption overhead if enabled
  const encryptionOverhead = (params.encryption || network.encryption) ? 0.85 : 1.0;
  
  // Calculate metrics with some randomness
  const throughput = baseBandwidth * encryptionOverhead * (0.9 + Math.random() * 0.2);
  const packetsSent = Math.floor(randomNormal(1000, 100));
  const lostPackets = Math.floor(packetsSent * (basePacketLoss / 100));
  const packetsReceived = packetsSent - lostPackets;
  const packetLoss = (lostPackets / packetsSent) * 100;
  const latency = baseLatency * (0.9 + Math.random() * 0.2);
  const jitter = latency * 0.1 * Math.random();
  
  return {
    throughput: parseFloat(throughput.toFixed(2)),
    packetsSent,
    packetsReceived,
    packetLoss: parseFloat(packetLoss.toFixed(2)),
    latency: parseFloat(latency.toFixed(2)),
    jitter: parseFloat(jitter.toFixed(2)),
  };
}

// Create network topology based on network type
export function generateNetworkTopology(networkType: NetworkType): NetworkTopology {
  const topologies: Record<NetworkType, () => NetworkTopology> = {
    lan: generateLanTopology,
    man: generateManTopology,
    wan: generateWanTopology,
    pan: generatePanTopology,
    can: generateCanTopology,
    gan: generateGanTopology,
    wlan: generateWlanTopology,
    epn: generateEpnTopology,
    vpn: generateVpnTopology,
    san: generateSanTopology,
  };
  
  return topologies[networkType]();
}

// LAN topology: Star topology with central switch
function generateLanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'switch', x: 400, y: 300, type: 'router', name: 'Switch' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Add devices around the switch
  const deviceCount = 6;
  const radius = 150;
  
  for (let i = 0; i < deviceCount; i++) {
    const angle = (i / deviceCount) * Math.PI * 2;
    const x = 400 + Math.cos(angle) * radius;
    const y = 300 + Math.sin(angle) * radius;
    
    const deviceId = `device${i + 1}`;
    nodes.push({ 
      id: deviceId, 
      x, 
      y, 
      type: 'device',
      name: `PC ${i + 1}`
    });
    
    links.push({
      source: 'switch',
      target: deviceId,
      bandwidth: 1000,
    });
    
    // Create packets
    if (Math.random() > 0.5) {
      const targetId = `device${(i + Math.floor(Math.random() * (deviceCount - 1) + 1)) % deviceCount + 1}`;
      packets.push({
        id: `packet-${i}-${Date.now()}`,
        sourceId: deviceId,
        targetId,
        size: Math.floor(Math.random() * 1000) + 100,
        progress: Math.random(),
        lost: Math.random() < 0.01,
      });
    }
  }
  
  return { nodes, links, packets };
}

// MAN topology: Multiple LANs connected to a central backbone
function generateManTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'backbone', x: 400, y: 300, type: 'router', name: 'MAN Backbone' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Create multiple "buildings" or LANs
  const buildingCount = 4;
  const radius = 200;
  
  for (let i = 0; i < buildingCount; i++) {
    const angle = (i / buildingCount) * Math.PI * 2;
    const buildingX = 400 + Math.cos(angle) * radius;
    const buildingY = 300 + Math.sin(angle) * radius;
    
    const routerId = `router${i + 1}`;
    nodes.push({
      id: routerId,
      x: buildingX,
      y: buildingY,
      type: 'router',
      name: `Building ${i + 1} Router`
    });
    
    links.push({
      source: 'backbone',
      target: routerId,
      bandwidth: 500,
    });
    
    // Add a few devices per building
    const deviceCount = 3;
    const deviceRadius = 80;
    
    for (let j = 0; j < deviceCount; j++) {
      const deviceAngle = (j / deviceCount) * Math.PI * 2;
      const deviceX = buildingX + Math.cos(deviceAngle) * deviceRadius;
      const deviceY = buildingY + Math.sin(deviceAngle) * deviceRadius;
      
      const deviceId = `device-${i}-${j}`;
      nodes.push({
        id: deviceId,
        x: deviceX,
        y: deviceY,
        type: 'device',
        name: `PC ${i}-${j}`
      });
      
      links.push({
        source: routerId,
        target: deviceId,
        bandwidth: 1000,
      });
      
      // Create packets between buildings
      if (Math.random() > 0.7) {
        const targetBuilding = (i + Math.floor(Math.random() * (buildingCount - 1) + 1)) % buildingCount;
        const targetDevice = Math.floor(Math.random() * deviceCount);
        const targetId = `device-${targetBuilding}-${targetDevice}`;
        
        packets.push({
          id: `packet-${i}-${j}-${Date.now()}`,
          sourceId: deviceId,
          targetId,
          size: Math.floor(Math.random() * 1000) + 500,
          progress: Math.random(),
          lost: Math.random() < 0.05,
        });
      }
    }
  }
  
  return { nodes, links, packets };
}

// WAN topology: Different locations connected over long distances
function generateWanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'internet', x: 400, y: 300, type: 'cloud', name: 'Internet' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Create different global locations
  const locations = [
    { id: 'nyc', name: 'New York', x: 300, y: 200 },
    { id: 'london', name: 'London', x: 500, y: 150 },
    { id: 'tokyo', name: 'Tokyo', x: 600, y: 250 },
    { id: 'sydney', name: 'Sydney', x: 550, y: 450 },
    { id: 'saopaulo', name: 'São Paulo', x: 250, y: 400 },
  ];
  
  // Add each location
  locations.forEach(location => {
    nodes.push({
      id: location.id,
      x: location.x,
      y: location.y,
      type: 'server',
      name: location.name,
    });
    
    links.push({
      source: 'internet',
      target: location.id,
      distance: Math.sqrt(Math.pow(location.x - 400, 2) + Math.pow(location.y - 300, 2)) * 10,
      bandwidth: 100,
    });
    
    // Add devices for each location
    const deviceId = `device-${location.id}`;
    nodes.push({
      id: deviceId,
      x: location.x + (Math.random() > 0.5 ? 40 : -40),
      y: location.y + (Math.random() > 0.5 ? 40 : -40),
      type: 'device',
      name: `${location.name} Client`,
    });
    
    links.push({
      source: location.id,
      target: deviceId,
      bandwidth: 500,
    });
    
    // Create packets between locations
    if (Math.random() > 0.5) {
      const targetLocation = locations[Math.floor(Math.random() * locations.length)];
      if (targetLocation.id !== location.id) {
        packets.push({
          id: `packet-${location.id}-${Date.now()}`,
          sourceId: deviceId,
          targetId: `device-${targetLocation.id}`,
          size: Math.floor(Math.random() * 2000) + 1000,
          progress: Math.random(),
          lost: Math.random() < 0.1,
        });
      }
    }
  });
  
  return { nodes, links, packets };
}

// PAN topology: Personal devices connected in close proximity
function generatePanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'user', x: 400, y: 300, type: 'device', name: 'Smartphone' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Personal devices
  const devices = [
    { id: 'watch', name: 'Smartwatch', x: 350, y: 250 },
    { id: 'headphones', name: 'Headphones', x: 450, y: 250 },
    { id: 'laptop', name: 'Laptop', x: 350, y: 350 },
    { id: 'tablet', name: 'Tablet', x: 450, y: 350 },
  ];
  
  devices.forEach(device => {
    nodes.push({
      id: device.id,
      x: device.x,
      y: device.y,
      type: 'device',
      name: device.name,
    });
    
    links.push({
      source: 'user',
      target: device.id,
      distance: Math.sqrt(Math.pow(device.x - 400, 2) + Math.pow(device.y - 300, 2)),
      bandwidth: 50,
    });
    
    // Create packets
    if (Math.random() > 0.3) {
      packets.push({
        id: `packet-${device.id}-${Date.now()}`,
        sourceId: 'user',
        targetId: device.id,
        size: Math.floor(Math.random() * 500) + 100,
        progress: Math.random(),
        lost: Math.random() < 0.01,
      });
      
      if (Math.random() > 0.7) {
        packets.push({
          id: `packet-${device.id}-return-${Date.now()}`,
          sourceId: device.id,
          targetId: 'user',
          size: Math.floor(Math.random() * 200) + 50,
          progress: Math.random(),
          lost: Math.random() < 0.01,
        });
      }
    }
  });
  
  return { nodes, links, packets };
}

// CAN topology: Multiple buildings in a campus network
function generateCanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'core', x: 400, y: 300, type: 'router', name: 'Core Switch' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Campus buildings
  const buildings = [
    { id: 'admin', name: 'Admin Building', x: 300, y: 200 },
    { id: 'science', name: 'Science Building', x: 500, y: 200 },
    { id: 'library', name: 'Library', x: 500, y: 400 },
    { id: 'dorms', name: 'Dormitories', x: 300, y: 400 },
  ];
  
  buildings.forEach(building => {
    nodes.push({
      id: building.id,
      x: building.x,
      y: building.y,
      type: 'router',
      name: building.name,
    });
    
    links.push({
      source: 'core',
      target: building.id,
      bandwidth: 800,
    });
    
    // Add devices for each building
    const deviceCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < deviceCount; i++) {
      const deviceId = `${building.id}-device${i}`;
      const offsetX = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 40;
      const offsetY = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 40;
      
      nodes.push({
        id: deviceId,
        x: building.x + offsetX,
        y: building.y + offsetY,
        type: 'device',
        name: `${building.name} PC ${i + 1}`,
      });
      
      links.push({
        source: building.id,
        target: deviceId,
        bandwidth: 1000,
      });
      
      // Create packets
      if (Math.random() > 0.6) {
        const targetBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        if (targetBuilding.id !== building.id) {
          packets.push({
            id: `packet-${deviceId}-${Date.now()}`,
            sourceId: deviceId,
            targetId: `${targetBuilding.id}-device0`,
            size: Math.floor(Math.random() * 1000) + 500,
            progress: Math.random(),
            lost: Math.random() < 0.02,
          });
        }
      }
    }
  });
  
  return { nodes, links, packets };
}

// GAN topology: Global networks connected by satellites
function generateGanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'satellite1', x: 250, y: 150, type: 'server', name: 'Satellite 1' },
    { id: 'satellite2', x: 550, y: 150, type: 'server', name: 'Satellite 2' },
    { id: 'satellite3', x: 250, y: 450, type: 'server', name: 'Satellite 3' },
    { id: 'satellite4', x: 550, y: 450, type: 'server', name: 'Satellite 4' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Connect satellites in a mesh
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      links.push({
        source: nodes[i].id,
        target: nodes[j].id,
        bandwidth: 50,
      });
    }
  }
  
  // Add ground stations
  const groundStations = [
    { id: 'ny', name: 'New York', x: 200, y: 300, satellite: 'satellite1' },
    { id: 'la', name: 'Los Angeles', x: 150, y: 350, satellite: 'satellite3' },
    { id: 'london', name: 'London', x: 350, y: 250, satellite: 'satellite1' },
    { id: 'tokyo', name: 'Tokyo', x: 650, y: 300, satellite: 'satellite2' },
    { id: 'sydney', name: 'Sydney', x: 600, y: 350, satellite: 'satellite4' },
    { id: 'rio', name: 'Rio de Janeiro', x: 350, y: 400, satellite: 'satellite3' },
  ];
  
  groundStations.forEach(station => {
    nodes.push({
      id: station.id,
      x: station.x,
      y: station.y,
      type: 'router',
      name: station.name,
    });
    
    links.push({
      source: station.satellite,
      target: station.id,
      bandwidth: 50,
    });
    
    // Create packets between ground stations
    if (Math.random() > 0.7) {
      const targetStation = groundStations[Math.floor(Math.random() * groundStations.length)];
      if (targetStation.id !== station.id) {
        packets.push({
          id: `packet-${station.id}-${Date.now()}`,
          sourceId: station.id,
          targetId: targetStation.id,
          size: Math.floor(Math.random() * 5000) + 1000,
          progress: Math.random(),
          lost: Math.random() < 0.2,
        });
      }
    }
  });
  
  return { nodes, links, packets };
}

// WLAN topology: Wireless devices connected to access points
function generateWlanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'router', x: 400, y: 300, type: 'router', name: 'Wireless Router' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Wireless devices randomly positioned
  const deviceCount = 8;
  for (let i = 0; i < deviceCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 150 + 50;
    const x = 400 + Math.cos(angle) * distance;
    const y = 300 + Math.sin(angle) * distance;
    
    const deviceId = `device${i}`;
    const deviceTypes = ['Laptop', 'Smartphone', 'Tablet', 'Smart TV', 'IoT Device'];
    const deviceName = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    nodes.push({
      id: deviceId,
      x,
      y,
      type: 'device',
      name: `${deviceName} ${i + 1}`,
    });
    
    links.push({
      source: 'router',
      target: deviceId,
      bandwidth: 300,
    });
    
    // Create packets
    if (Math.random() > 0.5) {
      const targetId = Math.random() > 0.5 ? 'router' : `device${Math.floor(Math.random() * deviceCount)}`;
      if (targetId !== deviceId) {
        packets.push({
          id: `packet-${deviceId}-${Date.now()}`,
          sourceId: deviceId,
          targetId,
          size: Math.floor(Math.random() * 1500) + 500,
          progress: Math.random(),
          lost: Math.random() < 0.05,
        });
      }
    }
  }
  
  return { nodes, links, packets };
}

// EPN topology: Enterprise Private Network with multiple sites
function generateEpnTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'hq', x: 400, y: 200, type: 'server', name: 'Headquarters' },
    { id: 'vpn', x: 400, y: 300, type: 'router', name: 'VPN Gateway' },
    { id: 'cloud', x: 400, y: 400, type: 'cloud', name: 'Cloud Services' },
  ];
  
  const links: Link[] = [
    { source: 'hq', target: 'vpn', bandwidth: 500 },
    { source: 'vpn', target: 'cloud', bandwidth: 300 },
  ];
  
  const packets: Packet[] = [];
  
  // Branch offices
  const branches = [
    { id: 'branch1', name: 'Branch Office 1', x: 250, y: 300 },
    { id: 'branch2', name: 'Branch Office 2', x: 550, y: 300 },
    { id: 'remote1', name: 'Remote Worker 1', x: 300, y: 400 },
    { id: 'remote2', name: 'Remote Worker 2', x: 500, y: 400 },
  ];
  
  branches.forEach(branch => {
    nodes.push({
      id: branch.id,
      x: branch.x,
      y: branch.y,
      type: branch.id.includes('remote') ? 'device' : 'router',
      name: branch.name,
    });
    
    links.push({
      source: 'vpn',
      target: branch.id,
      bandwidth: 100,
    });
    
    // Create packets
    if (Math.random() > 0.3) {
      const targets = ['hq', 'cloud'];
      const targetId = targets[Math.floor(Math.random() * targets.length)];
      
      packets.push({
        id: `packet-${branch.id}-${Date.now()}`,
        sourceId: branch.id,
        targetId,
        size: Math.floor(Math.random() * 1000) + 500,
        progress: Math.random(),
        lost: Math.random() < 0.05,
      });
      
      if (Math.random() > 0.7) {
        packets.push({
          id: `packet-return-${branch.id}-${Date.now()}`,
          sourceId: targetId,
          targetId: branch.id,
          size: Math.floor(Math.random() * 1500) + 500,
          progress: Math.random(),
          lost: Math.random() < 0.05,
        });
      }
    }
  });
  
  return { nodes, links, packets };
}

// VPN topology: Encrypted tunnels between networks
function generateVpnTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'internet', x: 400, y: 300, type: 'cloud', name: 'Internet' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // VPN endpoints
  const endpoints = [
    { id: 'company', name: 'Company Network', x: 250, y: 200 },
    { id: 'home', name: 'Home Network', x: 550, y: 200 },
    { id: 'cafe', name: 'Coffee Shop', x: 250, y: 400 },
    { id: 'hotel', name: 'Hotel WiFi', x: 550, y: 400 },
  ];
  
  endpoints.forEach(endpoint => {
    nodes.push({
      id: endpoint.id,
      x: endpoint.x,
      y: endpoint.y,
      type: 'router',
      name: endpoint.name,
    });
    
    links.push({
      source: 'internet',
      target: endpoint.id,
      bandwidth: 50,
    });
    
    // Add a device for each endpoint
    const deviceId = `device-${endpoint.id}`;
    nodes.push({
      id: deviceId,
      x: endpoint.x + (Math.random() > 0.5 ? 50 : -50),
      y: endpoint.y + (Math.random() > 0.5 ? 50 : -50),
      type: 'device',
      name: `${endpoint.name} User`,
    });
    
    links.push({
      source: endpoint.id,
      target: deviceId,
      bandwidth: 100,
    });
    
    // Create encrypted packets
    if (Math.random() > 0.5) {
      const targetEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      if (targetEndpoint.id !== endpoint.id) {
        const targetId = `device-${targetEndpoint.id}`;
        
        packets.push({
          id: `packet-${deviceId}-${Date.now()}`,
          sourceId: deviceId,
          targetId,
          size: Math.floor(Math.random() * 1000) + 500,
          progress: Math.random(),
          lost: Math.random() < 0.05,
        });
      }
    }
  });
  
  return { nodes, links, packets };
}

// SAN topology: Storage devices connected to servers
function generateSanTopology(): NetworkTopology {
  const nodes: Node[] = [
    { id: 'fabric', x: 400, y: 300, type: 'router', name: 'Storage Fabric' },
  ];
  
  const links: Link[] = [];
  const packets: Packet[] = [];
  
  // Servers on the left
  const serverCount = 4;
  for (let i = 0; i < serverCount; i++) {
    const y = 200 + i * 70;
    const serverId = `server${i}`;
    
    nodes.push({
      id: serverId,
      x: 250,
      y,
      type: 'server',
      name: `Server ${i + 1}`,
    });
    
    links.push({
      source: 'fabric',
      target: serverId,
      bandwidth: 1500,
    });
  }
  
  // Storage devices on the right
  const storageTypes = ['SSD Array', 'HDD Array', 'Tape Library', 'Flash Storage'];
  for (let i = 0; i < storageTypes.length; i++) {
    const y = 200 + i * 70;
    const storageId = `storage${i}`;
    
    nodes.push({
      id: storageId,
      x: 550,
      y,
      type: 'server',
      name: storageTypes[i],
    });
    
    links.push({
      source: 'fabric',
      target: storageId,
      bandwidth: 1500,
    });
    
    // Create packets (read/write operations)
    for (let j = 0; j < serverCount; j++) {
      if (Math.random() > 0.7) {
        packets.push({
          id: `packet-${storageId}-${j}-${Date.now()}`,
          sourceId: `server${j}`,
          targetId: storageId,
          size: Math.floor(Math.random() * 10000) + 1000,
          progress: Math.random(),
          lost: Math.random() < 0.01,
        });
      }
      
      if (Math.random() > 0.8) {
        packets.push({
          id: `packet-return-${storageId}-${j}-${Date.now()}`,
          sourceId: storageId,
          targetId: `server${j}`,
          size: Math.floor(Math.random() * 20000) + 5000,
          progress: Math.random(),
          lost: Math.random() < 0.01,
        });
      }
    }
  }
  
  return { nodes, links, packets };
}

export function getNetworkIcon(networkType: NetworkType): string {
  return networkData[networkType].icon;
}

export function updateSimulation(
  topology: NetworkTopology, 
  networkType: NetworkType, 
  params: SimulationParams = defaultParams
): NetworkTopology {
  const network = networkData[networkType];
  const baseLatency = network.latency * params.latencyModifier;
  const baseBandwidth = network.bandwidth * params.bandwidthModifier;
  const basePacketLoss = network.packetLoss * params.packetLossModifier;
  
  // Add encryption overhead if enabled
  const encryptionOverhead = (params.encryption || network.encryption) ? 0.85 : 1.0;
  
  // Update existing packets
  const updatedPackets = topology.packets
    .filter(packet => !packet.lost && packet.progress < 1)
    .map(packet => {
      // Calculate packet speed based on bandwidth
      const speed = (baseBandwidth * encryptionOverhead) / 10000;
      
      // Update progress
      let progress = packet.progress + speed;
      
      // Check for packet loss
      const lost = Math.random() < (basePacketLoss / 100);
      
      if (progress >= 1) {
        progress = 1;
      }
      
      return {
        ...packet,
        progress,
        lost,
      };
    });
  
  // Generate new packets occasionally
  if (Math.random() > 0.8) {
    const nodes = topology.nodes.filter(node => node.type === 'device' || node.type === 'server');
    if (nodes.length > 1) {
      const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
      let targetNode;
      do {
        targetNode = nodes[Math.floor(Math.random() * nodes.length)];
      } while (targetNode.id === sourceNode.id);
      
      updatedPackets.push({
        id: `packet-new-${Date.now()}-${Math.random()}`,
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        size: Math.floor(Math.random() * 1000) + 500,
        progress: 0,
        lost: false,
      });
    }
  }
  
  return {
    ...topology,
    packets: updatedPackets,
  };
}
