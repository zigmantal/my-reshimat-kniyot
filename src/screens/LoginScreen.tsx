import { useState } from 'react';
import { signInWithGoogle, signOut } from '../firebase';

export default function LoginScreen({ blocked = false }: { blocked?: boolean }) {
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleLogin = async () => {
    try {
      setSigningIn(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('החלון הקופץ להתחברות נחסם על ידי הדפדפן. אנא אפשרו חלונות קופצים (Pop-ups) או פתחו את האפליקציה בלשונית נפרדת.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('ההתחברות בוטלה.');
      } else {
        setErrorMsg(err?.message || 'שגיאה בהתחברות עם Google. אנא נסו שוב.');
      }
    } finally {
      setSigningIn(false);
    }
  };

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
            
            {errorMsg && (
              <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.4 }}>
                {errorMsg}
              </div>
            )}

            <button
              className="primary-button"
              onClick={handleLogin}
              disabled={signingIn}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              {signingIn ? 'מתחבר...' : 'התחברות עם Google'}
            </button>

            {isIframe && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span>אם החלון הקופץ נחסם בתצוגה המקדימה, </span>
                <a
                  href={window.location.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  פתחו בלשונית נפרדת ↗
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
