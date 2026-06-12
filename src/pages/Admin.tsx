import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Type, Mail, LogIn, LogOut, ShieldAlert, Globe, Info, Facebook, Twitter, Linkedin, Github, Copyright, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useConfig, AppData, SiteConfig } from "../context/ConfigContext";
import { ImageUploader } from "../components/ImageUploader";
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  setDoc,
  doc,
  deleteDoc,
  OperationType,
  handleFirestoreError
} from "../lib/firebase";

export default function Admin() {
  const { apps, config, user, isAdmin, loading } = useConfig();
  
  useEffect(() => {
    console.log("--- PLATFORM CONTROL V3.1 INITIALIZED ---");
  }, []);

  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [localApps, setLocalApps] = useState<AppData[]>(apps);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'identity' | 'about' | 'social' | 'ecosystem'>('identity');

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    setLocalApps(apps);
  }, [apps]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSave = async () => {
    setStatus('saving');
    try {
      // 1. Save Config
      await setDoc(doc(db, 'config', 'site'), localConfig);
      
      // 2. Save Apps
      for (const app of localApps) {
        await setDoc(doc(db, 'apps', app.id), app);
      }

      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Save failed");
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const addApp = () => {
    const newApp: AppData = {
      id: Date.now().toString(),
      title: "New Conceived App",
      description: "App description goes here...",
      features: ["Feature 1"],
      imageUrl: "https://picsum.photos/seed/new/800/600",
      appleLink: "#",
      googleLink: "#"
    };
    setLocalApps([...localApps, newApp]);
  };

  const removeApp = async (id: string) => {
    try {
      if (apps.find(a => a.id === id)) {
        await deleteDoc(doc(db, 'apps', id));
      }
      setLocalApps(localApps.filter(a => a.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `apps/${id}`);
    }
  };

  const updateAppField = (id: string, field: keyof AppData, value: string | string[]) => {
    setLocalApps(localApps.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-staje-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="mesh-gradient-1" />
        <div className="fixed top-8 left-8 flex flex-col items-start z-50">
           <span className="px-3 py-1 rounded bg-rose-500 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl mb-1">v4.0 OVERRIDE BUILD</span>
           <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] border border-indigo-500/20 italic">FORCED_DEPLOYMENT_ACTIVE</span>
        </div>
        <div className="relative">
          <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full shadow-2xl shadow-indigo-500/20" />
          <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-xs text-indigo-400">{config.logoLetter || "S"}</div>
        </div>
        <p className="mt-8 text-slate-500 font-display font-medium tracking-widest animate-pulse">SYNCHRONIZING PLATFORM CONTROL...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-staje-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="mesh-gradient-1" />
        <div className="fixed top-8 left-8 flex flex-col items-start z-50">
           <span className="px-3 py-1 rounded bg-rose-500 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl mb-1">v4.0 OVERRIDE BUILD</span>
           <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] border border-indigo-500/20 italic">FORCED_DEPLOYMENT_ACTIVE</span>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-12 space-y-8 relative z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center font-display font-bold text-4xl shadow-2xl shadow-indigo-600/40">{config.logoLetter || "S"}</div>
          <div className="space-y-4">
            <h1 className="text-3xl font-display font-bold tracking-tighter uppercase">{config.siteName || "Platform"} Guard</h1>
            <p className="text-slate-500 text-sm">Access to internal controls is restricted to verified administrators.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-100 transition-all group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign in with Google
          </button>
          <Link to="/" className="block text-xs uppercase font-bold tracking-widest text-slate-600 hover:text-white transition-colors">Return to Site</Link>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-staje-bg flex flex-col items-center justify-center p-6 text-center">
         <div className="fixed top-8 left-8 flex flex-col items-start z-50">
           <span className="px-3 py-1 rounded bg-rose-500 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl mb-1">v4.0 OVERRIDE BUILD</span>
           <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] border border-indigo-500/20 italic">FORCED_DEPLOYMENT_ACTIVE</span>
         </div>
         <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
         <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
         <p className="text-slate-400 mb-8 max-w-sm">Authorized personnel only. Your account ({user.email}) does not have administrative privileges.</p>
         <button onClick={handleLogout} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Sign Out</button>
         <Link to="/" className="mt-8 text-xs font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Return to Site</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Type, color: 'text-indigo-400' },
    { id: 'about', label: 'Vision Control', icon: Info, color: 'text-emerald-400' },
    { id: 'social', label: 'Ecosystem Links', icon: Globe, color: 'text-cyan-400' },
    { id: 'ecosystem', label: 'App Pipeline', icon: Plus, color: 'text-rose-400' },
  ] as const;

  return (
    <div className="min-h-screen bg-staje-bg text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <div className="mesh-gradient-1 opacity-50" />
      <div className="mesh-gradient-2 opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="w-full md:w-auto">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Site
            </Link>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
                  Platform <span className="text-indigo-400">Control</span>
                </h1>
                <div className="hidden md:flex flex-col mt-2">
                   <span className="px-3 py-1 rounded bg-rose-500 text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">v4.0 OVERRIDE BUILD</span>
                   <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em] border border-indigo-500/20 italic">FORCED_DEPLOYMENT_ACTIVE</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="md:hidden p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-rose-400 font-bold hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all font-display text-xs uppercase tracking-widest ${
                status === 'saved' ? 'bg-emerald-500 text-white' : 
                status === 'error' ? 'bg-rose-600 text-white' :
                'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40'
              }`}
            >
              {status === 'saving' ? 'Committing...' : status === 'saved' ? 'Synced' : status === 'error' ? 'Sync Error' : (
                <>
                  <Save className="w-5 h-5" />
                  Apply Changes
                </>
              )}
            </button>
          </div>
        </header>

        {status === 'error' && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {/* System Tabs */}
        <div id="admin-hub-tabs" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-16 p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-white text-black shadow-2xl shadow-white/10 scale-[1.02]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : tab.color}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12 pb-20"
        >
          {activeTab === 'identity' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Brand Configuration Card */}
              <section className="col-span-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Global Brand Identity</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform / Company Name</label>
                      <span className="text-[8px] text-slate-400 font-mono">Header & Document Title</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Blind Pharma"
                      value={localConfig.siteName || ""}
                      onChange={(e) => setLocalConfig({...localConfig, siteName: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-white font-semibold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Single Letter Logo Icon</label>
                      <span className="text-[8px] text-slate-400 font-mono">Navigation Circle badge</span>
                    </div>
                    <input
                      type="text"
                      maxLength={1}
                      placeholder="e.g. B"
                      value={localConfig.logoLetter || ""}
                      onChange={(e) => setLocalConfig({...localConfig, logoLetter: e.target.value.toUpperCase()})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-indigo-400 font-bold text-center text-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Type className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Hero Section</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                    <input
                      type="text"
                      value={localConfig.heroTitle}
                      onChange={(e) => setLocalConfig({...localConfig, heroTitle: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accent Words</label>
                    <input
                      type="text"
                      value={localConfig.heroAccent}
                      onChange={(e) => setLocalConfig({...localConfig, heroAccent: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-indigo-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subtitle</label>
                    <textarea
                      rows={4}
                      value={localConfig.heroSubtitle}
                      onChange={(e) => setLocalConfig({...localConfig, heroSubtitle: e.target.value})}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>
              </section>

              <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                 <div className="flex items-center gap-3 mb-2">
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Visuals & Typography</h2>
                </div>
                <div className="space-y-6">
                  <ImageUploader 
                    label="Hero Background Image" 
                    currentUrl={localConfig.heroImageUrl} 
                    onUpload={(url) => setLocalConfig({...localConfig, heroImageUrl: url})} 
                    folder="hero"
                  />
                  
                  {/* Typefaces */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Typeface</label>
                      <div className="relative">
                        <select
                          value={localConfig.displayFont}
                          onChange={(e) => setLocalConfig({...localConfig, displayFont: e.target.value})}
                          className="w-full border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none text-sm font-semibold text-white"
                          style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                        >
                          <option value="Outfit" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Outfit", sans-serif' }}>Outfit (Default)</option>
                          <option value="Inter" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Inter", sans-serif' }}>Inter (Swiss Minimal)</option>
                          <option value="Plus Jakarta Sans" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Plus Jakarta (Geometry)</option>
                          <option value="Space Grotesk" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Space Grotesk", sans-serif' }}>Space Grotesk (Neo-Future)</option>
                          <option value="Playfair Display" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Playfair Display", serif' }}>Playfair (Editorial Serif)</option>
                          <option value="Syne" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Syne", sans-serif' }}>Syne (Artistic Display)</option>
                          <option value="Space Mono" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Space Mono", monospace' }}>Space Mono (Utility Code)</option>
                        </select>
                        <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                      <p 
                        style={{ fontFamily: `"${localConfig.displayFont || 'Outfit'}", sans-serif` }}
                        className="text-[10px] text-indigo-400 font-bold tracking-wide leading-none mt-2 truncate transition-all duration-300"
                      >
                        ABC•123•Platform Brand
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Body/Content Typeface</label>
                      <div className="relative">
                        <select
                          value={localConfig.bodyFont || "Inter"}
                          onChange={(e) => setLocalConfig({...localConfig, bodyFont: e.target.value})}
                          className="w-full border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none text-sm font-semibold text-white"
                          style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                        >
                          <option value="Inter" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Inter", sans-serif' }}>Inter (Swiss Minimal)</option>
                          <option value="Outfit" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Outfit", sans-serif' }}>Outfit (Modern Sans)</option>
                          <option value="Plus Jakarta Sans" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Plus Jakarta (Geometry)</option>
                          <option value="Space Grotesk" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Space Grotesk", sans-serif' }}>Space Grotesk (Neo-Future)</option>
                          <option value="Space Mono" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a', fontFamily: '"Space Mono", monospace' }}>Space Mono (Utility Code)</option>
                        </select>
                        <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                      <p 
                        style={{ fontFamily: `"${localConfig.bodyFont || 'Inter'}", sans-serif` }}
                        className="text-[10px] text-emerald-400/90 font-medium leading-none mt-2 truncate transition-all duration-300"
                      >
                        Purpose-built digital experiences.
                      </p>
                    </div>
                  </div>

                  {/* Sizing Controls */}
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    <h3 className="font-bold uppercase tracking-widest text-[9px] text-slate-500">Font Sizing Architecture</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Hero Title</label>
                        <select
                          value={localConfig.heroTitleSize || "large"}
                          onChange={(e) => setLocalConfig({...localConfig, heroTitleSize: e.target.value})}
                          className="w-full border border-white/10 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500/50 text-[11px] font-bold tracking-wider uppercase text-white cursor-pointer"
                          style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                        >
                          <option value="small" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Compact</option>
                          <option value="normal" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Standard</option>
                          <option value="large" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Large</option>
                          <option value="epic" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Epic Scale</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Hero Subtitle</label>
                        <select
                          value={localConfig.heroSubtitleSize || "normal"}
                          onChange={(e) => setLocalConfig({...localConfig, heroSubtitleSize: e.target.value})}
                          className="w-full border border-white/10 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500/50 text-[11px] font-bold tracking-wider uppercase text-white cursor-pointer"
                          style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                        >
                          <option value="small" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Small (16px)</option>
                          <option value="normal" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Normal (20px)</option>
                          <option value="large" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Large (24px)</option>
                          <option value="xlarge" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Extra (30px)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Overall Scale</label>
                        <select
                          value={localConfig.bodyFontSize || "normal"}
                          onChange={(e) => setLocalConfig({...localConfig, bodyFontSize: e.target.value})}
                          className="w-full border border-white/10 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500/50 text-[11px] font-bold tracking-wider uppercase text-white cursor-pointer"
                          style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                        >
                          <option value="small" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Compact (15px)</option>
                          <option value="normal" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Balanced (16px)</option>
                          <option value="large" className="bg-slate-900 text-white" style={{ color: '#ffffff', backgroundColor: '#0f172a' }}>Spacious (18px)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Design/Typography Preview */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Live Typography & Scale Preview</h3>
                      <span className="flex items-center gap-1.5 text-[8px] font-black tracking-widest text-emerald-400 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Real-time View
                      </span>
                    </div>

                    <div className="relative rounded-2xl border border-white/5 bg-slate-950/80 p-5 overflow-hidden transition-all duration-300">
                      {/* background ambient glow to resemble the hero section vibe */}
                      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div className="relative z-10 space-y-3">
                        {/* Sample Header/Tags */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span 
                            style={{ fontFamily: `"${localConfig.bodyFont || 'Inter'}", sans-serif` }}
                            className="text-[9px] text-slate-400 font-bold uppercase tracking-wider transition-all duration-300"
                          >
                            staje.com
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">WORKSPACE PREVIEW</span>
                        </div>

                        {/* Eyebrow tag */}
                        <span 
                          style={{ fontFamily: `"${localConfig.displayFont || 'Outfit'}", sans-serif` }}
                          className="inline-block text-[8px] font-bold text-indigo-400 tracking-widest uppercase transition-all duration-300"
                        >
                          // Platform Showcase
                        </span>

                        {/* Title: mapped dynamically based on selected value in localConfig */}
                        <h4 
                          style={{ 
                            fontFamily: `"${localConfig.displayFont || 'Outfit'}", sans-serif`,
                            fontSize: 
                              localConfig.heroTitleSize === 'small' ? '1.25rem' :
                              localConfig.heroTitleSize === 'normal' ? '1.6rem' :
                              localConfig.heroTitleSize === 'large' ? '2.1rem' : '2.6rem',
                            lineHeight: '1.1'
                          }}
                          className="font-bold tracking-tight text-white transition-all duration-300"
                        >
                          Architecting the <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Digital Frontier</span>
                        </h4>

                        {/* Subtitle: mapped dynamically based on selected value in localConfig */}
                        <p 
                          style={{ 
                            fontFamily: `"${localConfig.bodyFont || 'Inter'}", sans-serif`,
                            fontSize: 
                              localConfig.heroSubtitleSize === 'small' ? '11px' :
                              localConfig.heroSubtitleSize === 'normal' ? '13px' :
                              localConfig.heroSubtitleSize === 'large' ? '15px' : '17px',
                            lineHeight: '1.4'
                          }}
                          className="text-slate-400 font-light transition-all duration-300"
                        >
                          Ecosystem built for speed, clean interfaces, and bulletproof integrations.
                        </p>

                        {/* Sample Body Paragraph showing overall body text scale & typeface */}
                        <div className="space-y-1 bg-white/[0.02] rounded-xl p-3 border border-white/5">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider">// Body Text & Font Scale</span>
                          <p 
                            style={{ 
                              fontFamily: `"${localConfig.bodyFont || 'Inter'}", sans-serif`,
                              fontSize: 
                                localConfig.bodyFontSize === 'small' ? '11px' :
                                localConfig.bodyFontSize === 'normal' ? '13px' : '15px',
                              lineHeight: '1.5'
                            }}
                            className="text-slate-300 font-normal transition-all duration-300"
                          >
                            This is how your primary content blocks, descriptive grids, and standard body text will render across the ecosystem.
                          </p>
                        </div>

                        {/* Mock Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button 
                            style={{ fontFamily: `"${localConfig.displayFont || 'Outfit'}", sans-serif` }}
                            className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] font-bold tracking-wider hover:bg-slate-200 transition-colors pointer-events-none"
                          >
                            Explore Gateway
                          </button>
                          <button 
                            style={{ fontFamily: `"${localConfig.bodyFont || 'Inter'}", sans-serif` }}
                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-semibold hover:bg-white/10 transition-colors pointer-events-none"
                          >
                            Documentation
                          </button>
                        </div>

                        {/* Diagnostics legend */}
                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-2 border-t border-white/5 select-none transition-all duration-300">
                          <span className="truncate">Display: {localConfig.displayFont || 'Outfit'}</span>
                          <span className="truncate">Body: {localConfig.bodyFont || 'Inter'}</span>
                          <span>Body Scale: {localConfig.bodyFontSize === 'small' ? '15px' : localConfig.bodyFontSize === 'normal' ? '16px' : '18px'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Gateway</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={localConfig.contactEmail}
                        onChange={(e) => setLocalConfig({...localConfig, contactEmail: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'about' && (
             <div className="grid md:grid-cols-2 gap-8">
                <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6 h-fit">
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Mission & Vision</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Section Title</label>
                      <input
                        type="text"
                        value={localConfig.aboutTitle}
                        onChange={(e) => setLocalConfig({...localConfig, aboutTitle: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Narrative</label>
                      <textarea
                        rows={6}
                        value={localConfig.aboutSubtitle}
                        onChange={(e) => setLocalConfig({...localConfig, aboutSubtitle: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </section>

                <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Plus className="w-5 h-5 text-indigo-400" />
                    <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Vision Points (Three Core Values)</h2>
                  </div>
                  <div className="space-y-4">
                    {localConfig.aboutItems?.map((item, idx) => (
                      <div key={item.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group/item">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={item.number}
                                onChange={(e) => {
                                  const newItems = [...(localConfig.aboutItems || [])];
                                  newItems[idx] = { ...item, number: e.target.value };
                                  setLocalConfig({ ...localConfig, aboutItems: newItems });
                                }}
                                className="w-10 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs text-indigo-400 font-bold text-center"
                              />
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const newItems = [...(localConfig.aboutItems || [])];
                                  newItems[idx] = { ...item, title: e.target.value };
                                  setLocalConfig({ ...localConfig, aboutItems: newItems });
                                }}
                                className="flex-1 bg-transparent font-bold border-b border-white/10 focus:border-indigo-500 transition-colors"
                              />
                           </div>
                        </div>
                        <textarea
                          rows={2}
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...(localConfig.aboutItems || [])];
                            newItems[idx] = { ...item, text: e.target.value };
                            setLocalConfig({ ...localConfig, aboutItems: newItems });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs text-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                </section>
             </div>
          )}

          {activeTab === 'social' && (
             <div className="grid md:grid-cols-2 gap-8">
                <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Social Connections</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Twitter className="w-3 h-3" /> X (Twitter)
                      </label>
                      <input
                        type="text"
                        value={localConfig.footerTwitter}
                        onChange={(e) => setLocalConfig({...localConfig, footerTwitter: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Linkedin className="w-3 h-3" /> LinkedIn
                      </label>
                      <input
                        type="text"
                        value={localConfig.footerLinkedin}
                        onChange={(e) => setLocalConfig({...localConfig, footerLinkedin: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Github className="w-3 h-3" /> GitHub
                      </label>
                      <input
                        type="text"
                        value={localConfig.footerGithub}
                        onChange={(e) => setLocalConfig({...localConfig, footerGithub: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </section>

                <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Copyright className="w-5 h-5 text-slate-500" />
                    <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Global Footer</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Copyright Notice</label>
                      <input
                        type="text"
                        value={localConfig.footerCopyright}
                        onChange={(e) => setLocalConfig({...localConfig, footerCopyright: e.target.value})}
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter pt-4">
                      Changes to the social URLs will immediately update the floating footer icons on the public site.
                    </p>
                  </div>
                </section>
             </div>
          )}

          {activeTab === 'ecosystem' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold tracking-tight">App Integrated Assets</h2>
                <button
                  onClick={addApp}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all font-display"
                >
                  <Plus className="w-4 h-4" />
                  Conceive New App
                </button>
              </div>

              <div className="space-y-6">
                {localApps.map((app, index) => (
                  <div key={app.id} className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl relative group/card overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-display font-bold text-indigo-400 border border-white/10">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={app.title}
                          placeholder="App Title"
                          onChange={(e) => updateAppField(app.id, 'title', e.target.value)}
                          className="bg-transparent text-2xl font-display font-bold focus:outline-none border-b border-transparent focus:border-indigo-500/50"
                        />
                      </div>
                      <button
                        onClick={() => removeApp(app.id)}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Functional Bio</label>
                          <textarea
                            rows={3}
                            value={app.description}
                            onChange={(e) => updateAppField(app.id, 'description', e.target.value)}
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Key Pillars (One per line)</label>
                          <textarea
                            rows={4}
                            value={app.features.join('\n')}
                            onChange={(e) => updateAppField(app.id, 'features', e.target.value.split('\n'))}
                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <ImageUploader 
                          label="Custom Icon Asset"
                          currentUrl={app.imageUrl}
                          onUpload={(url) => updateAppField(app.id, 'imageUrl', url)}
                          folder="apps"
                        />
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <LinkIcon className="w-3 h-3" /> App Store URL
                            </label>
                            <input
                              type="text"
                              value={app.appleLink}
                              onChange={(e) => updateAppField(app.id, 'appleLink', e.target.value)}
                              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <LinkIcon className="w-3 h-3" /> Google Play URL
                            </label>
                            <input
                              type="text"
                              value={app.googleLink}
                              onChange={(e) => updateAppField(app.id, 'googleLink', e.target.value)}
                              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

