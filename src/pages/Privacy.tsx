import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Shield, Lock, FileText, Trash2, Eye, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { useConfig } from "../context/ConfigContext";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function Privacy() {
  const { config } = useConfig();
  const [activeSection, setActiveSection] = useState("overview");

  const sections: Section[] = [
    {
      id: "overview",
      title: "Overview",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-300">
            Welcome to the <strong>{config.siteName || "Staje"} Platform</strong> Privacy Policy. We are dedicated to building, hosting, and showcasing purpose-built mobile utilities and custom software architectures. We respect your digital boundaries, value your privacy, and design our ecosystem to keep you in control of your personal data.
          </p>
          <p className="leading-relaxed text-slate-300">
            This Policy covers all mobile applications conceived by our platform and distributed through the <strong>Google Play Store</strong> and <strong>Apple App Store</strong>, as well as our primary web interface.
          </p>
          <p className="leading-relaxed text-slate-300">
            We hold a strong belief that software should perform its core tasks beautifully without harvesting user identities. Our collection is designed from the ground up to minimize data collection.
          </p>
        </div>
      )
    },
    {
      id: "data-collection",
      title: "What We Collect",
      icon: Eye,
      content: (
        <div className="space-y-6">
          <p className="leading-relaxed text-slate-300">
            Most of our conceived tools operate as standalone utilities. Depending on the specific application, personal data is treated under strict categories:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-semibold text-white text-sm">Offline & Local Data</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Settings, profile customizations, and log documents stay saved directly on your local device repository. We do not transmit or proxy local databases to external cloud hosts.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-semibold text-white text-sm">Cloud-Synced Accounts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                For apps utilizing cross-device synchronization (using Firebase platforms or active user accounts), we store your email address and profile identifiers strictly to secure your sync endpoints.
              </p>
            </div>
          </div>
          <p className="leading-relaxed text-slate-300 text-sm">
            We do not share, sell, distribute, or license any collected data elements (including contact information or device logs) to third-party ad networks or marketing agents.
          </p>
        </div>
      )
    },
    {
      id: "app-store-compliance",
      title: "App Store Compliance",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-300">
            To fulfill the transparency mandates of the <strong>Google Play Console</strong> and the <strong>Apple App Store Connect</strong>, we explicitly disclose:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
            <li>
              <strong>Device Status:</strong> We may request permission to view network or hardware indicators to maintain active cloud handshakes.
            </li>
            <li>
              <strong>Analytics & Telemetry:</strong> Anonymized usage data may be monitored strictly through platform partners (like Google Firebase Analytics or App Store Vitals) to capture crashes, performance degradation, and latency benchmarks.
            </li>
            <li>
              <strong>Integrations:</strong> Applications integrating native device actions (such as push notifications or spatial directions) utilize standard operating system APIs governed by your global configuration profiles.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "data-deletion",
      title: "Account & Data Deletion",
      icon: Trash2,
      content: (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
            <h4 className="font-semibold text-rose-300 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              Right to Erasure (App Store Compliant Deletion)
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              In complete alignment with Apple App Store Guidelines and Google Play User Data policies, users can request the immediate and irreversible deletion of their entire account, synchronization streams, and data footprints from our hosting architecture.
            </p>
          </div>
          <p className="leading-relaxed text-slate-300">
            To trigger data or account deletion, utilize one of the following official channels:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
            <li>
              Navigate to our dedicated <Link to="/contact" className="text-indigo-400 hover:underline">Contact Page</Link>, select <strong>"Account / Data Deletion Request"</strong> as your inquiry option, and submit your registered email address.
            </li>
            <li>
              Send a direct email to our system administrator at <a href={`mailto:${config.contactEmail}`} className="text-indigo-400 hover:underline">{config.contactEmail}</a> referencing "Data Deletion Request".
            </li>
          </ol>
          <p className="text-xs text-slate-400 leading-relaxed italic pt-2">
            Upon verification, your user profiles, synced collections, active credentials, and historic records are purged permanently from Google Cloud Platform / Firebase databases within 48 business hours.
          </p>
        </div>
      )
    },
    {
      id: "contact-info",
      title: "Privacy Contacts",
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-slate-300">
            For suggestions, inquiries, legal claims, or general questions regarding our data operations, reach out directly to the platform management:
          </p>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-semibold text-white">{config.siteName || "Staje"} Platform Administration</h4>
            <p className="text-sm text-slate-300">Primary Liaison: System Administrator</p>
            <p className="text-sm text-slate-300">
              Email Endpoint: <a href={`mailto:${config.contactEmail}`} className="text-indigo-400 hover:underline font-mono">{config.contactEmail}</a>
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen selection:bg-indigo-500/30 relative overflow-hidden pb-20">
      <div className="mesh-gradient-1" />
      <div className="mesh-gradient-2" />

      {/* Mini Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-transparent backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2 group text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wide uppercase font-sans">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center font-display font-bold text-xs text-white">{config.logoLetter || "S"}</div>
          <span className="font-display font-bold text-sm tracking-tighter text-white uppercase">{config.siteName || "STAJE"}</span>
        </div>
      </nav>

      {/* Privacy Title */}
      <header className="relative pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Compliance Verified
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-slate-500">Policy</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl uppercase tracking-wider font-medium font-mono">
            LAST REVISED: MAY 2026 • GOOGLE PLAY & APP STORE COMPLIANCE PLATFORM
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-[250px_1fr] gap-12 relative z-10">
        
        {/* Navigation Sidebar (Desktop Only) */}
        <aside className="hidden lg:block space-y-2 sticky top-28 self-start">
          <h3 className="text-slate-600 font-bold text-[10px] tracking-widest uppercase mb-4 px-3">Content Sections</h3>
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all font-medium ${
                      isActive
                        ? "bg-indigo-600/10 border border-indigo-500/20 text-white font-bold"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content Body */}
        <section className="space-y-8 max-w-3xl">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                id={section.id}
                key={section.id}
                onViewportEnter={() => setActiveSection(section.id)}
                viewport={{ amount: 0.5 }}
                className="section-card p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-white">
                    {section.title}
                  </h2>
                </div>
                <div>{section.content}</div>
              </motion.div>
            );
          })}
        </section>

      </main>

      <ScrollToTop />
    </div>
  );
}
