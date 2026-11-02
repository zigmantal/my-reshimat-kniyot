import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLists } from '../hooks/useLists';
import { formatListTitle } from '../utils';

export default function HomeScreen() {
  const [tab, setTab] = useState<'active' | 'done'>('active');
  const active = useLists('active');
  const done = useLists('done');

  const current = tab === 'active' ? active : done;

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>הרשימות שלנו</h1>
        <Link to="/new" className="primary-button new-list-button">
          + רשימה חדשה
        </Link>
      </div>

      <div className="tabs">
        <button
          className={`tab ${tab === 'active' ? 'tab-active' : ''}`}
          onClick={() => setTab('active')}
        >
          רשימות פעילות {active.lists.length > 0 ? `(${active.lists.length})` : ''}
        </button>
        <button
          className={`tab ${tab === 'done' ? 'tab-active' : ''}`}
          onClick={() => setTab('done')}
        >
          היסטוריה
        </button>
      </div>

      {current.loading ? (
        <div className="centered-screen small">
          <div className="spinner" />
        </div>
      ) : current.lists.length === 0 ? (
        <div className="empty-state">
          {tab === 'active' ? (
            <>
              <p>אין רשימות פעילות כרגע.</p>
              <Link to="/new" className="primary-button">
                יצירת רשימה ראשונה
              </Link>
            </>
          ) : (
            <p>עדיין אין רשימות שהושלמו.</p>
          )}
        </div>
      ) : (
        <ul className="list-cards">
          {current.lists.map((list) => (
            <li key={list.id}>
              <Link to={`/list/${list.id}`} className="list-card">
                <span className="list-card-title">{formatListTitle(list)}</span>
                {list.status === 'done' && <span className="badge badge-done">הושלם</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
