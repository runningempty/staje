import React from "react";
import { motion } from "motion/react";
import { AppStoreButton } from "./AppStoreButton";

interface AppCardProps {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  appleLink: string;
  googleLink: string;
  index: number;
  key?: string | number;
}

export function AppCard({ title, description, features, imageUrl, appleLink, googleLink, index }: AppCardProps) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative grid lg:grid-cols-2 gap-12 items-center py-16 px-8 rounded-[40px] border border-white/5 transition-all duration-500 overflow-hidden ${
        isEven ? "bg-white/2" : "bg-black/20 backdrop-blur-sm shadow-[0_0_40px_rgba(99,102,241,0.05)] border-t-indigo-500/20"
      }`}
    >
      <div className={`space-y-8 ${!isEven ? 'lg:order-2' : ''}`}>
        <div className="space-y-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
            index === 0 ? "bg-indigo-500/20 text-indigo-400" : "bg-cyan-500/20 text-cyan-400"
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
            {title}
          </h3>
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl font-light">
            {description}
          </p>
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300/80 text-sm font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? "bg-indigo-500" : "bg-cyan-500"}`} />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 pt-4">
          <AppStoreButton type="apple" url={appleLink} />
          <AppStoreButton type="google" url={googleLink} />
        </div>
      </div>

      <div className={`relative aspect-[4/3] rounded-[32px] overflow-hidden glass-panel border-white/10 group-hover:border-indigo-500/30 transition-all duration-700 ${!isEven ? 'lg:order-1' : ''}`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-staje-bg/80 via-transparent to-transparent opacity-60" />
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-24 bg-indigo-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  );
}
