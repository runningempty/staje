import React from "react";
import { motion } from "motion/react";
import { ChevronRight, Github, Twitter, Linkedin } from "lucide-react";
import { AppCard } from "../components/AppCard";
import { ScrollToTop } from "../components/ScrollToTop";
import { useConfig } from "../context/ConfigContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { apps, config, loading } = useConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-staje-bg">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Mesh Gradients */}

      <div className="mesh-gradient-1" />
      <div className="mesh-gradient-2" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center font-display font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
          <span className="font-display font-bold text-xl tracking-tighter">STAJE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white/60">
          <a href="#apps" className="hover:text-white transition-colors">APPS</a>
          <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
          <Link to="/admin" className="hover:text-white transition-colors">ADMIN</Link>
          <a href={`mailto:${config.contactEmail}`} className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 backdrop-blur-md">
            CONTACT
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={config.heroImageUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-staje-bg/0 via-staje-bg/40 to-staje-bg" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Internal Ecosystem Showcase
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9]">
              {config.heroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">{config.heroAccent}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed">
              {config.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })} 
                className="group px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-between gap-4 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all duration-300"
              >
                Explore Apps
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} 
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md"
              >
                The Platform
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-[10px] tracking-widest uppercase font-bold"
        >
          Scroll to explore
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* App Showcase */}
      <section id="apps" className="py-32 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 space-y-4 text-center md:text-left">
            <h2 className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-indigo-300 mb-4 uppercase tracking-widest">
              The Collection
            </h2>
            <p className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
              Featured Conceived Apps
            </p>
          </div>

          <div className="space-y-12">
            {apps.length > 0 ? (
              apps.map((app, index) => (
                <AppCard 
                  key={app.id}
                  index={index}
                  title={app.title}
                  description={app.description}
                  features={app.features}
                  imageUrl={app.imageUrl}
                  appleLink={app.appleLink}
                  googleLink={app.googleLink}
                />
              ))
            ) : (
              <div className="py-20 text-center glass-panel rounded-[40px] border-dashed border-white/10">
                <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">No apps in the ecosystem yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Vision/About */}
      <section id="about" className="py-40 px-6 md:px-12 relative overflow-hidden bg-black/20 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-12">
          <h2 className="text-4xl md:text-7xl font-display font-bold leading-tight">
            {config.aboutTitle?.includes(' ') ? (
              <>
                {config.aboutTitle.split(' ').slice(0, -2).join(' ')} <br />
                <span className="italic font-light text-slate-500">{config.aboutTitle.split(' ').slice(-2).join(' ')}</span>
              </>
            ) : (
              config.aboutTitle
            )}
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light">
            {config.aboutSubtitle}
          </p>
          <div className="pt-8">
             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 text-left">
                {config.aboutItems?.map((item, idx) => (
                  <div key={item.id} className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <div className={`${idx === 0 ? 'text-indigo-400' : idx === 1 ? 'text-cyan-400' : 'text-rose-400'} font-display text-4xl font-bold`}>{item.number}</div>
                    <h4 className="font-bold text-xl uppercase tracking-tighter">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-12 border-t border-white/5 bg-black/20 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center font-display font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
              <span className="font-display font-bold text-2xl tracking-tighter">STAJE</span>
            </div>
            <p className="text-slate-500 max-w-xs text-xs leading-relaxed font-medium uppercase tracking-wide">
              Conceived by Staje Platform • Internal Utility Network
            </p>
            <div className="flex gap-4">
              {config.footerTwitter && (
                <a href={config.footerTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {config.footerLinkedin && (
                <a href={config.footerLinkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {config.footerGithub && (
                <a href={config.footerGithub} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h5 className="font-bold text-[10px] tracking-widest uppercase text-slate-600">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-[10px] tracking-widest uppercase text-slate-600">Contact</h5>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href={`mailto:${config.contactEmail}`} className="hover:text-white transition-colors">Inquiries</a></li>
                <li><a href={`mailto:${config.contactEmail}`} className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 text-[10px] tracking-[0.2em] font-bold text-slate-600 uppercase flex flex-col md:flex-row justify-between gap-4">
          <span>{config.footerCopyright}</span>
          <span className="flex items-center gap-2">
            STAY FOCUSED <div className="w-1 h-1 rounded-full bg-indigo-500" /> STAY RELEVANT
          </span>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}
