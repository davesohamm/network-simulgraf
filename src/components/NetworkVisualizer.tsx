
import { useEffect, useRef, useState } from "react";
import { NetworkType, networkData } from "@/lib/network-data";
import { GlassPanel } from "@/components/ui/glass-panel";
import { generateNetworkTopology, updateSimulation } from "@/lib/network-simulation";
import { 
  Monitor, 
  Server, 
  Router, 
  Cloud, 
  ArrowUpRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause,
  Lock
} from "lucide-react";

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
  size: number;
  progress: number;
  lost: boolean;
  x?: number;
  y?: number;
}

interface NetworkTopology {
  nodes: Node[];
  links: Link[];
  packets: Packet[];
}

interface NetworkVisualizerProps {
  networkType: NetworkType;
  simulationParams: {
    bandwidthModifier: number;
    latencyModifier: number;
    packetLossModifier: number;
    encryption: boolean;
  };
}

const NetworkVisualizer = ({ networkType, simulationParams }: NetworkVisualizerProps) => {
  const [topology, setTopology] = useState<NetworkTopology | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const network = networkData[networkType];
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate initial topology
    const newTopology = generateNetworkTopology(networkType);
    setTopology(newTopology);
    
    // Reset simulation state
    setIsPaused(false);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [networkType]);

  useEffect(() => {
    if (!topology || isPaused) return;

    const animate = () => {
      setTopology(currentTopology => {
        if (!currentTopology) return null;
        return updateSimulation(currentTopology, networkType, simulationParams);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [topology, networkType, simulationParams, isPaused]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'device':
        return <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'router':
        return <Router className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'server':
        return <Server className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'cloud':
        return <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const getNodePosition = (nodeId: string) => {
    if (!topology) return { x: 0, y: 0 };
    const node = topology.nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const calculatePacketPosition = (packet: Packet) => {
    const source = getNodePosition(packet.sourceId);
    const target = getNodePosition(packet.targetId);
    
    // Interpolate position based on progress
    const x = source.x + (target.x - source.x) * packet.progress;
    const y = source.y + (target.y - source.y) * packet.progress;
    
    return { x, y };
  };

  return (
    <GlassPanel 
      className={`${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'} flex flex-col transition-all duration-300`}
      intensity={isFullscreen ? "heavy" : "medium"}
    >
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <div 
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}
          />
          <h3 className="text-base sm:text-lg font-medium">{network.name} Simulation</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={togglePause}
            className="p-1 sm:p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
          >
            {isPaused ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-1 sm:p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow overflow-hidden" ref={containerRef}>
        {topology && (
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Links */}
            {topology.links.map((link) => {
              const source = getNodePosition(link.source);
              const target = getNodePosition(link.target);
              
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className="network-link"
                />
              );
            })}
            
            {/* Nodes */}
            {topology.nodes.map((node) => (
              <g 
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-transform hover:scale-110 duration-300"
              >
                <circle
                  r={node.type === 'router' ? 14 : node.type === 'server' ? 16 : node.type === 'cloud' ? 18 : 12}
                  fill={node.type === 'cloud' ? 'rgba(255, 255, 255, 0.8)' : 'white'}
                  stroke={network.color}
                  strokeWidth="2"
                  className={`transition-all duration-300 ${node.type === 'device' ? 'animate-pulse-slow' : ''}`}
                />
                
                <foreignObject
                  x="-10"
                  y="-10"
                  width="20"
                  height="20"
                  className="overflow-visible flex items-center justify-center"
                >
                  <div className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>
              </g>
            ))}
            
            {/* Data Packets */}
            {topology.packets
              .filter(packet => !packet.lost)
              .map((packet) => {
                const position = calculatePacketPosition(packet);
                
                return (
                  <circle
                    key={packet.id}
                    cx={position.x}
                    cy={position.y}
                    r={2 + (packet.size / 5000)}
                    fill={simulationParams.encryption ? "#3498db" : "#e74c3c"}
                    className="animate-pulse shadow-md"
                    opacity={0.8}
                  />
                );
              })}
          </svg>
        )}
        
        {/* Node tooltip */}
        {hoveredNode && (
          <div
            className="absolute bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-md shadow-md text-xs border border-gray-200 dark:border-gray-700 z-20 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 animate-fade-in"
            style={{
              left: `${hoveredNode.x + 20}px`,
              top: `${hoveredNode.y}px`,
            }}
          >
            <div className="font-medium">{hoveredNode.name || hoveredNode.id}</div>
            <div className="text-gray-500 dark:text-gray-400">Type: {hoveredNode.type}</div>
          </div>
        )}
      </div>
      
      <div className="hidden sm:flex justify-between items-center px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
        <div>Range: {network.range} km</div>
        <div>Bandwidth: {network.bandwidth} Mbps</div>
        <div>Latency: {network.latency} ms</div>
        <div>
          {network.encryption ? (
            <span className="flex items-center text-green-500">
              <Lock className="h-3 w-3 mr-1" /> Encrypted
            </span>
          ) : (
            <span>Not Encrypted</span>
          )}
        </div>
      </div>
      <div className="flex sm:hidden justify-center items-center px-3 py-1.5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
        <div className={network.encryption ? "text-green-500" : ""}>
          {network.encryption ? <Lock className="h-3 w-3 inline mr-1" /> : null}
          {network.encryption ? "Encrypted" : "Not Encrypted"}
        </div>
      </div>
    </GlassPanel>
  );
};

export default NetworkVisualizer;
