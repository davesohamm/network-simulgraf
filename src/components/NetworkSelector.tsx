
import { useCallback } from "react";
import { NetworkType, networkData } from "@/lib/network-data";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/utils";
import { 
  Bluetooth, 
  Cpu, 
  Database, 
  Globe, 
  Network, 
  Lock, 
  Router, 
  Server, 
  Wifi, 
  Wand2, 
  ArrowUpRight, 
  CheckCircle 
} from "lucide-react";

interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  setSelectedNetwork: (network: NetworkType) => void;
}

const NetworkSelector = ({ selectedNetwork, setSelectedNetwork }: NetworkSelectorProps) => {
  const getNetworkIcon = useCallback((type: NetworkType) => {
    const iconMap = {
      lan: <Network className="h-4 w-4" />,
      man: <Network className="h-4 w-4" />,
      wan: <Globe className="h-4 w-4" />,
      pan: <Bluetooth className="h-4 w-4" />,
      can: <Network className="h-4 w-4" />,
      gan: <Globe className="h-4 w-4" />,
      wlan: <Wifi className="h-4 w-4" />,
      epn: <Server className="h-4 w-4" />,
      vpn: <Lock className="h-4 w-4" />,
      san: <Database className="h-4 w-4" />,
    };
    return iconMap[type] || <Router className="h-4 w-4" />;
  }, []);

  return (
    <GlassPanel className="p-4 sm:p-5 md:p-6 overflow-hidden h-full">
      <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
          <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-medium">Network Types</h3>
      </div>
      
      <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1 scrollbar-thin">
        {Object.keys(networkData).map((type) => {
          const network = networkData[type as NetworkType];
          const isSelected = type === selectedNetwork;
          
          return (
            <button
              key={type}
              onClick={() => setSelectedNetwork(type as NetworkType)}
              className={cn(
                "w-full p-2 sm:p-2.5 md:p-3 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out",
                isSelected 
                  ? `network-${network.id} scale-[1.02] shadow-md`
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/30 border border-transparent hover:scale-[1.01]",
                "group relative overflow-hidden"
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer-effect" />
              )}
              
              <div className="flex items-center relative z-10">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md mr-2 sm:mr-3",
                  isSelected 
                    ? `bg-${network.id}-500/20 text-${network.id}-500` 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                )}>
                  {getNetworkIcon(type as NetworkType)}
                </div>
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "font-medium text-sm sm:text-base transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {network.name}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-muted-foreground mt-0.5 animate-fade-in hidden sm:block">
                      {network.bandwidth} Mbps · {network.latency} ms
                    </span>
                  )}
                </div>
              </div>
              
              {isSelected ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-fade-in flex-shrink-0" />
              ) : (
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
};

export default NetworkSelector;
