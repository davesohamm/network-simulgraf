
import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
}

const GlassPanel = ({
  children,
  className,
  intensity = "medium",
  ...props
}: GlassPanelProps) => {
  const intensityClasses = {
    light: "bg-white/30 dark:bg-black/20 backdrop-blur-sm border-white/10 dark:border-gray-800/20",
    medium: "bg-white/50 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-gray-800/30",
    heavy: "bg-white/70 dark:bg-black/60 backdrop-blur-lg border-white/30 dark:border-gray-800/40",
  };

  return (
    <div
      className={cn(
        "rounded-xl border shadow-md transition-all duration-300 ease-in-out",
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { GlassPanel };
