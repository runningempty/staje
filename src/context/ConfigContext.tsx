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
  contactEmail: string;
  displayFont: string;
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
  contactEmail: "zkhan@staje.com",
  displayFont: "Outfit",
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppData[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Basic admin check based on email (matching rules)
      const adminEmail = 'zkhan@staje.com'.toLowerCase();
      const userEmail = u?.email?.toLowerCase();
      setIsAdmin(!!u && userEmail === adminEmail);
    });

    // 2. Fetch Config
    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'site'), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteConfig;
          setConfig(data);
          document.documentElement.style.setProperty('--font-display', `"${data.displayFont}", sans-serif`);
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

