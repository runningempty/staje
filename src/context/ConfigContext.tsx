import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  db, 
  auth, 
  onSnapshot, 
  collection, 
  doc, 
  query, 
  orderBy,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';

export interface AppData {
  id: string;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  appleLink: string;
  googleLink: string;
  order?: number;
}

export interface SiteConfig {
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroImageUrl: string;
  contactEmail: string;
  displayFont: string;
  bodyFont?: string;
  heroTitleSize?: string;
  heroSubtitleSize?: string;
  bodyFontSize?: string;
  footerTwitter?: string;
  footerLinkedin?: string;
  footerGithub?: string;
  footerCopyright?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutItems?: { id: string; number: string; title: string; text: string }[];
}

interface ConfigContextType {
  apps: AppData[];
  config: SiteConfig;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const DEFAULT_CONFIG: SiteConfig = {
  heroTitle: "Digital",
  heroAccent: "Ecosystems",
  heroSubtitle: "We design and develop purpose-built mobile applications that redefine how people interact with technology. Staje is not a service—it is a launchpad for modern utilities.",
  heroImageUrl: "/src/assets/images/staje_hero_abstract_1779198920246.png",
  contactEmail: "zkhan@staje.com",
  displayFont: "Outfit",
  bodyFont: "Inter",
  heroTitleSize: "large",
  heroSubtitleSize: "normal",
  bodyFontSize: "normal",
  footerTwitter: "#",
  footerLinkedin: "#",
  footerGithub: "#",
  footerCopyright: "© 2026 STAJE PLATFORM • CONCEIVED IN REALITY",
  aboutTitle: "Building the apps the future requires.",
  aboutSubtitle: "Staje stands at the intersection of aesthetic design and functional engineering. Our platform conceives apps that solve specific problems without the noise of mass-market features.",
  aboutItems: [
    { id: '1', number: '01', title: 'Minimalist', text: 'We strip away the excess to focus on core value.' },
    { id: '2', number: '02', title: 'Performant', text: 'Built with cutting-edge tech stacks for native speed.' },
    { id: '3', number: '03', title: 'Exclusive', text: 'Conceived for specific user groups and landscapes.' },
  ]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppData[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper to apply design attributes to the HTML document
  const applySiteDesign = (cfg: SiteConfig) => {
    document.documentElement.style.setProperty('--font-display', `"${cfg.displayFont || 'Outfit'}", sans-serif`);
    document.documentElement.style.setProperty('--font-sans', `"${cfg.bodyFont || 'Inter'}", sans-serif`);
    
    const titleSizes: Record<string, string> = {
      'small': 'clamp(2.5rem, 5vw, 4rem)',
      'normal': 'clamp(3.5rem, 8vw, 6rem)',
      'large': 'clamp(4.5rem, 12vw, 8rem)',
      'epic': 'clamp(5rem, 14vw, 10rem)',
    };
    const activeTitleSize = titleSizes[cfg.heroTitleSize || 'large'] || titleSizes['large'];
    document.documentElement.style.setProperty('--hero-title-size', activeTitleSize);

    const subtitleSizes: Record<string, string> = {
      'small': '1rem',
      'normal': '1.25rem',
      'large': '1.5rem',
      'xlarge': '1.875rem',
    };
    const activeSubtitleSize = subtitleSizes[cfg.heroSubtitleSize || 'normal'] || subtitleSizes['normal'];
    document.documentElement.style.setProperty('--hero-subtitle-size', activeSubtitleSize);

    const bodySizes: Record<string, string> = {
      'small': '15px',
      'normal': '16px',
      'large': '18px',
    };
    const activeBodySize = bodySizes[cfg.bodyFontSize || 'normal'] || bodySizes['normal'];
    document.documentElement.style.setProperty('--body-font-size', activeBodySize);
  };

  useEffect(() => {
    // Apply initial default style overrides immediately
    applySiteDesign(DEFAULT_CONFIG);

    // 1. Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      console.log("Auth State Changed:", u ? `User: ${u.email}` : "No User");
      setUser(u);
      
      // Basic admin check based on email (matching rules)
      const adminEmail = 'zkhan@staje.com'.toLowerCase().trim();
      const userEmail = u?.email?.toLowerCase().trim();
      
      const adminStatus = !!u && userEmail === adminEmail;
      console.log("Admin Check:", { userEmail, adminEmail, isAdmin: adminStatus });
      setIsAdmin(adminStatus);
    });

    // 2. Fetch Config
    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'site'), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteConfig;
          // Merge with defaults to ensure new fields are present
          const mergedConfig = { ...DEFAULT_CONFIG, ...data };
          setConfig(mergedConfig);
          applySiteDesign(mergedConfig);
        }
      },
      (error) => {
        // Site config might not exist yet, fallback to default
        if (!error.message.includes('permission')) {
          console.error("Config fetch error:", error);
        }
      }
    );

    // 3. Fetch Apps
    const q = query(collection(db, 'apps'), orderBy('title', 'asc'));
    const unsubscribeApps = onSnapshot(q, 
      (snapshot) => {
        const appsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AppData[];
        setApps(appsData);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'apps');
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeConfig();
      unsubscribeApps();
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ apps, config, user, loading, isAdmin }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
}

