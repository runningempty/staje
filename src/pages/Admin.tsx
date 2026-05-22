import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Plus, Trash2, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Type, Mail, LogIn, LogOut, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useConfig, AppData, SiteConfig } from "../context/ConfigContext";
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
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [localApps, setLocalApps] = useState<AppData[]>(apps);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

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
      
      // 2. Save Apps (Sync based on current state)
      // Since we modified locally, we need to compare with remote
      // A simpler way with Firestore is to just update what changed or add what's new
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
      <div className="min-h-screen flex items-center justify-center bg-staje-bg">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-staje-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="mesh-gradient-1" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-12 space-y-8 relative z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center font-display font-bold text-4xl shadow-2xl shadow-indigo-600/40">S</div>
          <div className="space-y-4">
            <h1 className="text-3xl font-display font-bold tracking-tighter uppercase">Platform Guard</h1>
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
         <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
         <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
         <p className="text-slate-400 mb-8 max-w-sm">Authorized personnel only. Your account ({user.email}) does not have administrative privileges.</p>
         <button onClick={handleLogout} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Sign Out</button>
         <Link to="/" className="mt-8 text-xs font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Return to Site</Link>
      </div>
    );
  }

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
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">
                Platform <span className="text-indigo-400">Control</span>
              </h1>
              <button 
                onClick={handleLogout}
                className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400"
              >
                <LogOut className="w-5 h-5" />
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
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                status === 'saved' ? 'bg-emerald-500 text-white' : 
                status === 'error' ? 'bg-rose-600 text-white' :
                'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
              }`}
            >
              {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : status === 'error' ? 'Error!' : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
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

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Config */}
          <div className="lg:col-span-1 space-y-8">
            <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Type className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Site Identity</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Title</label>
                  <input
                    type="text"
                    value={localConfig.heroTitle}
                    onChange={(e) => setLocalConfig({...localConfig, heroTitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Accent</label>
                  <input
                    type="text"
                    value={localConfig.heroAccent}
                    onChange={(e) => setLocalConfig({...localConfig, heroAccent: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-indigo-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Subtitle</label>
                  <textarea
                    rows={4}
                    value={localConfig.heroSubtitle}
                    onChange={(e) => setLocalConfig({...localConfig, heroSubtitle: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm leading-relaxed"
                  />
                </div>
              </div>
            </section>

            <section className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Contact & Typography</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    value={localConfig.contactEmail}
                    onChange={(e) => setLocalConfig({...localConfig, contactEmail: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Font</label>
                  <select
                    value={localConfig.displayFont}
                    onChange={(e) => setLocalConfig({...localConfig, displayFont: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none"
                  >
                    <option value="Outfit">Outfit (Modern)</option>
                    <option value="Inter">Inter (Clean)</option>
                    <option value="Space Grotesk">Space Grotesk (Tech)</option>
                    <option value="Playfair Display">Playfair (Elegant)</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Apps Manager */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold tracking-tight">App Ecosystem</h2>
              <button
                onClick={addApp}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 font-bold text-sm hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New App
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                        <textarea
                          rows={3}
                          value={app.description}
                          onChange={(e) => updateAppField(app.id, 'description', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Features (One per line)</label>
                        <textarea
                          rows={4}
                          value={app.features.join('\n')}
                          onChange={(e) => updateAppField(app.id, 'features', e.target.value.split('\n'))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon className="w-3 h-3" /> Image URL
                        </label>
                        <input
                          type="text"
                          value={app.imageUrl}
                          onChange={(e) => updateAppField(app.id, 'imageUrl', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" /> App Store URL
                          </label>
                          <input
                            type="text"
                            value={app.appleLink}
                            onChange={(e) => updateAppField(app.id, 'appleLink', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs"
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

