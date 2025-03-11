
import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NetworkMetrics as Metrics, NetworkType, networkData } from "@/lib/network-data";
import { generateNetworkMetrics } from "@/lib/network-simulation";
import { 
  Activity, 
  Gauge, 
  Clock, 
  ArrowDown, 
  ArrowUp, 
  Package, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkMetricsProps {
  networkType: NetworkType;
  simulationParams: {
    bandwidthModifier: number;
    latencyModifier: number;
    packetLossModifier: number;
    encryption: boolean;
  };
}

const NetworkMetrics = ({ networkType, simulationParams }: NetworkMetricsProps) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const network = networkData[networkType];

  useEffect(() => {
    // Initial metrics
    setMetrics(generateNetworkMetrics(networkType, simulationParams));
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(generateNetworkMetrics(networkType, simulationParams));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [networkType, simulationParams]);
  
  if (!metrics) return null;
  
  const metricItems = [
    {
      label: "Throughput",
      value: `${metrics.throughput} Mbps`,
      icon: <Gauge className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-blue-500",
      change: Math.random() > 0.5 ? "up" : "down",
      changeValue: `${(Math.random() * 5).toFixed(1)}%`,
    },
    {
      label: "Latency",
      value: `${metrics.latency} ms`,
      icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-amber-500",
      change: Math.random() > 0.5 ? "up" : "down",
      changeValue: `${(Math.random() * 3).toFixed(1)}%`,
    },
    {
      label: "Packet Loss",
      value: `${metrics.packetLoss}%`,
      icon: <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-red-500",
      change: Math.random() > 0.5 ? "up" : "down",
      changeValue: `${(Math.random() * 2).toFixed(1)}%`,
    },
    {
      label: "Packets Sent",
      value: metrics.packetsSent.toLocaleString(),
      icon: <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-green-500",
      change: "up",
      changeValue: `${Math.floor(Math.random() * 10)}`,
    },
    {
      label: "Packets Received",
      value: metrics.packetsReceived.toLocaleString(),
      icon: <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-green-500", 
      change: "up",
      changeValue: `${Math.floor(Math.random() * 10)}`,
    },
    {
      label: "Jitter",
      value: `${metrics.jitter.toFixed(2)} ms`,
      icon: <Activity className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: "text-purple-500",
      change: Math.random() > 0.5 ? "up" : "down",
      changeValue: `${(Math.random() * 1).toFixed(1)}%`,
    },
  ];

  return (
    <GlassPanel className="p-4 sm:p-5 md:p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <h3 className="text-base sm:text-lg font-medium">Performance Metrics</h3>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full border ${network.id === 'lan' ? 'network-lan' : `network-${network.id}`}`}>
          {network.name}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        {metricItems.map((item) => (
          <div 
            key={item.label} 
            className="p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-black/20 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center mb-1">
              <span className={cn("mr-1.5", item.color)}>{item.icon}</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-sm sm:text-base md:text-lg font-semibold">{item.value}</div>
              <div className={cn(
                "flex items-center text-xs",
                item.change === "up" 
                  ? "text-green-500"
                  : "text-red-500"
              )}>
                {item.change === "up" ? (
                  <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5" />
                ) : (
                  <ArrowDown className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5" />
                )}
                {item.changeValue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

export default NetworkMetrics;
