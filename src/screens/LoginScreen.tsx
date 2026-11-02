import { signInWithGoogle, signOut } from '../supabase';

export default function LoginScreen({ blocked = false }: { blocked?: boolean }) {
  return (
    <div className="centered-screen login-screen">
      <div className="login-card">
        <div className="login-emoji">🛒</div>
        <h1>רשימת קניות משפחתית</h1>
        {blocked ? (
          <>
            <p className="login-blocked-text">
              החשבון שהתחברת איתו אינו ברשימת בני המשפחה המורשים לאפליקציה.
            </p>
            <button className="secondary-button" onClick={() => signOut()}>
              התנתקות ונסו עם חשבון אחר
            </button>
          </>
        ) : (
          <>
            <p>התחברו עם חשבון Google כדי לצפות ברשימות המשפחה ולנהל אותן.</p>
            <button className="primary-button" onClick={() => signInWithGoogle()}>
              התחברות עם Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
