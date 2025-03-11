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
      lan: <Network className="mr-2 h-4 w-4" />,
      man: <Network className="mr-2 h-4 w-4" />,
      wan: <Globe className="mr-2 h-4 w-4" />,
      pan: <Bluetooth className="mr-2 h-4 w-4" />,
      can: <Network className="mr-2 h-4 w-4" />,
      gan: <Globe className="mr-2 h-4 w-4" />,
      wlan: <Wifi className="mr-2 h-4 w-4" />,
      epn: <Server className="mr-2 h-4 w-4" />,
      vpn: <Lock className="mr-2 h-4 w-4" />,
      san: <Database className="mr-2 h-4 w-4" />,
    };
    return iconMap[type] || <Router className="mr-2 h-4 w-4" />;
  }, []);

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center mb-4">
        <Wand2 className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Network Types</h3>
      </div>
      
      <div className="space-y-2">
        {Object.keys(networkData).map((type) => {
          const network = networkData[type as NetworkType];
          const isSelected = type === selectedNetwork;
          
          return (
            <button
              key={type}
              onClick={() => setSelectedNetwork(type as NetworkType)}
              className={cn(
                "w-full p-3 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out",
                isSelected 
                  ? `bg-${network.id}-500/10 border border-${network.id}-500/20 shadow-sm network-${network.id}` 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/30 border border-transparent",
                "group"
              )}
            >
              <div className="flex items-center">
                {getNetworkIcon(type as NetworkType)}
                <span className="font-medium">{network.name}</span>
              </div>
              
              {isSelected ? (
                <CheckCircle className="h-4 w-4 text-primary" />
              ) : (
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
};

export default NetworkSelector;
