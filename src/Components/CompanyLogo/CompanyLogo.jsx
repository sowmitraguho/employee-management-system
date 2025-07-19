import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function CompanyLogo({ className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-bold text-xl tracking-wide",
        className
      )}
    >
      {/* Small icon */}
      <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      {/* Logo text */}
      <span className="text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          App
        </span>
        <span className="dark:text-gray-200 text-blue-400">Tech</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
          X
        </span>
      </span>
    </div>
  );
}
