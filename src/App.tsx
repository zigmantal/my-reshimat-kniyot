import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { seedDatabaseIfEmpty } from './seedDatabase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ListViewScreen from './screens/ListViewScreen';
import NewListScreen from './screens/NewListScreen';
import TopBar from './components/TopBar';

export default function App() {
  const { loading, user, isBlocked } = useAuth();

  useEffect(() => {
    if (user && !isBlocked) {
      seedDatabaseIfEmpty(user.email).catch((err) => console.error('Seed failed:', err));
    }
  }, [user, isBlocked]);

  if (loading) {
    return (
      <div className="centered-screen">
        <div className="spinner" aria-label="טוען" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (isBlocked) {
    return <LoginScreen blocked />;
  }

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/list/:listId" element={<ListViewScreen />} />
          <Route path="/new" element={<NewListScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
