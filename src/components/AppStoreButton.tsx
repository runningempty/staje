import { motion } from "motion/react";
import { Download, Apple, PlayCircle } from "lucide-react";

interface AppLinkProps {
  type: "apple" | "google";
  url: string;
}

export function AppStoreButton({ type, url }: AppLinkProps) {
  const isApple = type === "apple";
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 px-5 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-all group/btn"
    >
      {isApple ? (
        <Apple className="w-5 h-5 text-white/80 group-hover/btn:text-white transition-colors" />
      ) : (
        <PlayCircle className="w-5 h-5 text-white/80 group-hover/btn:text-white transition-colors" />
      )}
      <div className="flex flex-col items-start leading-none">
        <span className="text-[9px] uppercase tracking-[0.15em] text-white/40 font-bold">
          {isApple ? "Download on" : "Get it on"}
        </span>
        <span className="text-sm font-bold text-white/90">
          {isApple ? "App Store" : "Google Play"}
        </span>
      </div>
    </motion.a>
  );
}
