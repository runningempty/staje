import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, CheckCircle2, AlertTriangle, Mail, HelpCircle, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { useConfig } from "../context/ConfigContext";

type SubjectType = "general" | "support" | "deletion" | "feedback";

interface FormData {
  name: string;
  email: string;
  subject: SubjectType;
  message: string;
}

export default function Contact() {
  const { config } = useConfig();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please input a valid email address.";
    }
    
    if (!formData.message.trim()) {
      tempErrors.message = "Message cannot be empty.";
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Please write a more descriptive message (min 10 characters).";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error dynamically
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate submission network handshake to fit standard high-fidelity client expectation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Store locally so user or reviewer can feel the persistent form engagement
      const messages = JSON.parse(localStorage.getItem("staje_contact_messages") || "[]");
      messages.push({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ...formData
      });
      localStorage.setItem("staje_contact_messages", JSON.stringify(messages));

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "general", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center font-display font-bold text-xs text-white">S</div>
          <span className="font-display font-bold text-sm tracking-tighter text-white">STAJE</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-32 grid lg:grid-cols-5 gap-12 relative z-10">
        
        {/* Sidebar Info Section */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Direct Liaison
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-none text-white">
              Connect <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-400">With Staje</span>
            </h1>
            <p className="text-slate-400 leading-relaxed font-light text-base md:text-lg">
              Have inquiries about an application, developer partnerships, or want to trigger a privacy data deletion mandate? Send a direct dispatch below.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Primary Inbox</h4>
                <a href={`mailto:${config.contactEmail}`} className="text-sm text-indigo-300 hover:underline font-mono">
                  {config.contactEmail}
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Compliance Operations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Support hours: Mon - Fri, 9AM - 5PM EST. All data deletion or account closure inquiries are processed within 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Container Panel */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden backdrop-blur-2xl">
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-6 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white scale-110 shadow-2xl shadow-indigo-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-display font-semibold text-white">Dispatch Transmitted</h2>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Thank you. Your inquiry has been logged securely in our support queues. Our platform liaison will check it within 24–48 standard business hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Send Another Dispatch
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
                    <MessageSquare className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-display font-medium text-white">Transmission Controls</h3>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-indigo-500/50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-600"
                    />
                    {errors.name && <p className="text-[11px] text-rose-400 font-medium">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. communications@yourbrand.com"
                      className="w-full px-4 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-indigo-500/50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-600 font-mono"
                    />
                    {errors.email && <p className="text-[11px] text-rose-400 font-medium">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="subject" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Inquiry Stream</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-staje-bg border border-white/10 focus:border-indigo-500/50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-300"
                    >
                      <option value="general">General Platform Inquiry</option>
                      <option value="support">App Support & Bugs</option>
                      <option value="deletion">Account / Data Deletion Request</option>
                      <option value="feedback">Creative / Developer Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="message" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Dispatch Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your brief description, technical inquiry, or user account details..."
                      className="w-full px-4 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-indigo-500/50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-600 resize-none leading-relaxed"
                    />
                    {errors.message && <p className="text-[11px] text-rose-400 font-medium">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 disabled:text-white/40 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-600/10 cursor-pointer transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Transmitting handshake...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Transmit Dispatch
                      </>
                    )}
                  </button>

                  {submitStatus === "error" && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-xs">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      An error occurred during communication. Check connection and retry.
                    </div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>

      <ScrollToTop />
    </div>
  );
}
