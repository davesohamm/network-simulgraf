
import { GlassPanel } from "@/components/ui/glass-panel";
import { NetworkType, networkData } from "@/lib/network-data";
import { Sliders, Lock, Unlock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkControlsProps {
  networkType: NetworkType;
  simulationParams: {
    bandwidthModifier: number;
    latencyModifier: number;
    packetLossModifier: number;
    encryption: boolean;
  };
  setSimulationParams: (params: {
    bandwidthModifier: number;
    latencyModifier: number;
    packetLossModifier: number;
    encryption: boolean;
  }) => void;
}

const NetworkControls = ({
  networkType,
  simulationParams,
  setSimulationParams,
}: NetworkControlsProps) => {
  const network = networkData[networkType];

  const handleParamChange = (param: string, value: number | boolean) => {
    setSimulationParams({
      ...simulationParams,
      [param]: value,
    });
  };

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium">Simulation Controls</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium flex items-center">
                <Sliders className="h-4 w-4 mr-1.5" />
                Bandwidth Modifier
              </label>
              <span className="text-sm font-medium">
                {simulationParams.bandwidthModifier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={simulationParams.bandwidthModifier}
              onChange={(e) =>
                handleParamChange("bandwidthModifier", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium flex items-center">
                <Sliders className="h-4 w-4 mr-1.5" />
                Latency Modifier
              </label>
              <span className="text-sm font-medium">
                {simulationParams.latencyModifier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={simulationParams.latencyModifier}
              onChange={(e) =>
                handleParamChange("latencyModifier", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium flex items-center">
                <Sliders className="h-4 w-4 mr-1.5" />
                Packet Loss Modifier
              </label>
              <span className="text-sm font-medium">
                {simulationParams.packetLossModifier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={simulationParams.packetLossModifier}
              onChange={(e) =>
                handleParamChange("packetLossModifier", parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.1x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => handleParamChange("encryption", !simulationParams.encryption)}
            className={cn(
              "w-full flex items-center justify-center py-2.5 px-4 rounded-lg border transition-all duration-300 ease-in-out",
              simulationParams.encryption
                ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            {simulationParams.encryption ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                <span>Encryption Enabled</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                <span>Encryption Disabled</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            {simulationParams.encryption 
              ? "Encryption adds security but may reduce performance."
              : "Enable encryption for secure data transmission."}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
};

export default NetworkControls;
