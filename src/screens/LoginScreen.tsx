import { useEffect, useRef, useState } from 'react';
import { signInWithGoogle, signInWithGoogleIdToken, signInWithEmail, signOut } from '../firebase';
import { GOOGLE_CLIENT_ID } from '../googleClientId';

function errorToMessage(err: any): string {
  if (err?.code === 'auth/popup-blocked') {
    return 'החלון הקופץ להתחברות נחסם על ידי הדפדפן. אנא אפשרו חלונות קופצים (Pop-ups) או פתחו את האפליקציה בלשונית נפרדת.';
  }
  if (err?.code === 'auth/popup-closed-by-user') {
    return 'ההתחברות בוטלה.';
  }
  if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
    return 'שם משתמש או סיסמה שגויים.';
  }
  if (err?.code === 'auth/user-not-found') {
    return 'לא נמצא משתמש עם כתובת המייל הזו.';
  }
  if (err?.code === 'auth/too-many-requests') {
    return 'יותר מדי ניסיונות כניסה. נסו שוב בעוד כמה דקות.';
  }
  return err?.message || 'שגיאה בהתחברות. אנא נסו שוב.';
}

export default function LoginScreen({ blocked = false }: { blocked?: boolean }) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [gisReady, setGisReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPopupFallback, setShowPopupFallback] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  // אתחול Google Identity Services. זרימה זו (ID token, ללא popup/redirect
  // חוצה-דומיינים) אמינה גם בדפדפני iOS (Safari/Chrome-על-iOS), בניגוד
  // ל-signInWithPopup הרגיל של Firebase שנכשל שם בגלל חלוקת אחסון (ITP).
  useEffect(() => {
    let cancelled = false;

    async function handleCredentialResponse(response: { credential: string }) {
      try {
        setSigningIn(true);
        setErrorMsg(null);
        await signInWithGoogleIdToken(response.credential);
      } catch (err) {
        console.error('Google Sign In (GSI) failed:', err);
        setErrorMsg(errorToMessage(err));
      } finally {
        setSigningIn(false);
      }
    }

    function tryInit() {
      if (cancelled) return;
      if (!window.google?.accounts?.id) {
        setTimeout(tryInit, 150);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        itp_support: true, // תמיכה ייעודית בחלוקת אחסון (ITP) בדפדפני iOS/Safari
      });
      if (buttonContainerRef.current) {
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'center',
          width: 280,
          locale: 'he',
        });
      }
      setGisReady(true);
    }

    tryInit();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePopupLogin() {
    try {
      setSigningIn(true);
      setErrorMsg(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign In (popup) failed:', err);
      setErrorMsg(errorToMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) return;
    try {
      setSigningIn(true);
      setErrorMsg(null);
      await signInWithEmail(emailInput.trim(), passwordInput);
    } catch (err) {
      console.error('Email/password sign in failed:', err);
      setErrorMsg(errorToMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

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

            {signingIn && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>מתחבר...</p>}

            {/* כפתור Google הרשמי (Google Identity Services) */}
            <div
              ref={buttonContainerRef}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', minHeight: 44 }}
            />

            {!gisReady && (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>טוען כפתור התחברות...</p>
            )}

            {showPopupFallback ? (
              <button className="primary-button" onClick={handlePopupLogin} disabled={signingIn} style={{ width: '100%' }}>
                התחברות עם Google (חלון קופץ)
              </button>
            ) : (
              <button className="link-button" onClick={() => setShowPopupFallback(true)}>
                הכפתור לא עובד? נסו דרך חלון קופץ
              </button>
            )}

            <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
              {showPasswordForm ? (
                <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="מייל"
                    className="title-input"
                    style={{ marginBottom: 0 }}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    autoComplete="username"
                  />
                  <input
                    type="password"
                    placeholder="סיסמה"
                    className="title-input"
                    style={{ marginBottom: 0 }}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={signingIn || !emailInput.trim() || !passwordInput}
                    style={{ width: '100%' }}
                  >
                    התחברות
                  </button>
                </form>
              ) : (
                <button className="link-button" onClick={() => setShowPasswordForm(true)}>
                  התחברות עם שם משתמש וסיסמה
                </button>
              )}
            </div>

            {isIframe && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                <span>אם ההתחברות לא עובדת בתצוגה המקדימה, </span>
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
