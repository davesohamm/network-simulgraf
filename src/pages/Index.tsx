
import { useState } from "react";
import { NetworkType } from "@/lib/network-data";
import NetworkSelector from "@/components/NetworkSelector";
import NetworkVisualizer from "@/components/NetworkVisualizer";
import NetworkMetrics from "@/components/NetworkMetrics";
import NetworkControls from "@/components/NetworkControls";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Network, Info } from "lucide-react";

const Index = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("lan");
  const [simulationParams, setSimulationParams] = useState({
    bandwidthModifier: 1.0,
    latencyModifier: 1.0,
    packetLossModifier: 1.0,
    encryption: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-x-hidden transition-colors duration-300">
      <div className="container mx-auto py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6">
        {/* Header */}
        <header className="mb-4 sm:mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center p-1.5 sm:p-2 bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-20 backdrop-blur-md rounded-xl shadow-sm mb-2 sm:mb-3 transition-all duration-300">
            <Network className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2 text-blue-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium">Network Simulator & Visualizer</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interactive simulation of different network types with real-time metrics
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-3 order-1 md:order-none">
            <NetworkSelector
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="md:col-span-6 h-[40vh] sm:h-[45vh] md:h-[55vh] lg:h-[60vh] order-3 md:order-none">
            <NetworkVisualizer
              networkType={selectedNetwork}
              simulationParams={simulationParams}
            />
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3 space-y-3 sm:space-y-4 md:space-y-5 order-2 md:order-none">
            <NetworkControls
              networkType={selectedNetwork}
              simulationParams={simulationParams}
              setSimulationParams={setSimulationParams}
            />
            
            <NetworkMetrics
              networkType={selectedNetwork}
              simulationParams={simulationParams}
            />
          </div>
        </div>

        {/* Info Section */}
        <GlassPanel className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-3 sm:p-4 md:p-5 lg:p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
            <h2 className="text-base sm:text-lg md:text-xl font-medium">About Network Types</h2>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-xs sm:text-sm md:text-base">
              This simulator visualizes different network types with their unique characteristics. 
              Select a network type from the sidebar to see how data flows through each network architecture.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4">
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">Local Networks</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <li><strong>LAN (Local Area Network):</strong> Connects devices within a limited area like homes and offices.</li>
                  <li><strong>WLAN (Wireless LAN):</strong> Connects devices wirelessly in a local area.</li>
                  <li><strong>PAN (Personal Area Network):</strong> Connects devices around an individual, typically via Bluetooth.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">Extended Networks</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <li><strong>MAN (Metropolitan Area Network):</strong> Spans a city or large campus.</li>
                  <li><strong>WAN (Wide Area Network):</strong> Spans large geographical areas, connecting LANs.</li>
                  <li><strong>CAN (Campus Area Network):</strong> Connects multiple LANs within a university or business campus.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">Specialized Networks</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <li><strong>SAN (Storage Area Network):</strong> Dedicated network providing access to consolidated storage.</li>
                  <li><strong>EPN (Enterprise Private Network):</strong> Connects multiple offices and remote workers securely.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2">Global Networks</h3>
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                  <li><strong>GAN (Global Area Network):</strong> Spans the globe, often using satellite links.</li>
                  <li><strong>VPN (Virtual Private Network):</strong> Creates secure encrypted connections over less secure networks.</li>
                </ul>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default Index;
