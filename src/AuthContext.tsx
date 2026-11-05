import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { auth, onAuthStateChanged } from './firebase';
import { isAllowedEmail } from './allowedMembers';

interface AuthState {
  loading: boolean;
  user: User | null;
  /** המשתמש מחובר אבל לא ברשימת בני המשפחה המורשים */
  isBlocked: boolean;
}

const AuthContext = createContext<AuthState>({
  loading: true,
  user: null,
  isBlocked: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );
    // Safety timeout in case auth takes too long or network is delayed
    const timer = setTimeout(() => setLoading(false), 2500);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const isBlocked = !!user && !isAllowedEmail(user.email);

  return (
    <AuthContext.Provider value={{ loading, user, isBlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
