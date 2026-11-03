import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { signOut } from '../supabase';

export default function TopBar() {
  const { user } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || '';

  return (
    <header className="top-bar">
      <Link to="/" className="top-bar-title">
        🛒 רשימת קניות
      </Link>
      <div className="top-bar-user">
        <span className="top-bar-name">{displayName}</span>
        <button className="link-button" onClick={() => signOut()}>
          התנתקות
        </button>
      </div>
    </header>
  );
}
