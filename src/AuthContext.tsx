import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { isAllowedEmail } from './allowedMembers';

interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  /** המשתמש מחובר אבל לא ברשימת בני המשפחה המורשים */
  isBlocked: boolean;
}

const AuthContext = createContext<AuthState>({
  loading: true,
  session: null,
  user: null,
  isBlocked: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const email = user?.email ?? null;
  const isBlocked = !!user && !isAllowedEmail(email);

  return (
    <AuthContext.Provider value={{ loading, session, user, isBlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
