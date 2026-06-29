import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  Check,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const frequencies = ['Daily', 'Weekdays', 'Weekly'];

export default function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    frequency: 'Daily',
    target_count: 1,
    notes: '',
  });

  const user = session?.user;
  const completedCount = habits.filter((habit) => habit.completed_today).length;
  const completionRate = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setHabits(data);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) setMessage(error.message);
      setSession(data.session);
      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setMessage('');
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      return;
    }

    fetchHabits();
  }, [fetchHabits, user]);

  const groupedHabits = useMemo(() => {
    return frequencies.map((frequency) => ({
      frequency,
      items: habits.filter((habit) => habit.frequency === frequency),
    }));
  }, [habits]);

  async function handleAuth(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const authCall =
      authMode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await authCall;
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPassword('');
    setMessage(authMode === 'login' ? 'Logged in successfully.' : 'Account created. You are logged in.');
  }

  async function signOut() {
    await supabase.auth.signOut();
    setHabits([]);
    setMessage('Logged out.');
  }

  async function createHabit(event) {
    event.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('Please log in before creating a habit.');
      return;
    }

    if (!form.title.trim()) {
      setMessage('Habit title is required.');
      return;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from('habits')
      .insert({
        title: form.title.trim(),
        frequency: form.frequency,
        target_count: Number(form.target_count),
        notes: form.notes.trim(),
        user_id: user.id,
      })
      .select()
      .single();
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setHabits((current) => [data, ...current]);
    setForm({ title: '', frequency: 'Daily', target_count: 1, notes: '' });
    setMessage('Habit created.');
  }

  async function toggleComplete(habit) {
    if (!user) {
      setMessage('Please log in before updating a habit.');
      return;
    }

    const { data, error } = await supabase
      .from('habits')
      .update({ completed_today: !habit.completed_today })
      .eq('id', habit.id)
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setHabits((current) => current.map((item) => (item.id === habit.id ? data : item)));
  }

  async function deleteHabit(id) {
    if (!user) {
      setMessage('Please log in before deleting a habit.');
      return;
    }

    const { error } = await supabase.from('habits').delete().eq('id', id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setHabits((current) => current.filter((habit) => habit.id !== id));
    setMessage('Habit deleted.');
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="app-shell">
        <section className="hero-band">
          <div>
            <p className="eyebrow">Week 2 full-stack assignment</p>
            <h1>Habit Atlas</h1>
            <p className="hero-copy">
              Add your Supabase project URL and anon key to `.env` to enable authentication and data storage.
            </p>
          </div>
          <div className="session-panel">
            <span>Setup needed</span>
          </div>
        </section>
        <section className="auth-layout">
          <div className="setup-panel">
            <h2>Connect Supabase</h2>
            <p>Create a `.env` file from `.env.example`, add your Supabase values, then restart the dev server.</p>
            <code>VITE_SUPABASE_URL</code>
            <code>VITE_SUPABASE_ANON_KEY</code>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Week 2 full-stack assignment</p>
          <h1>Habit Atlas</h1>
          <p className="hero-copy">
            Track recurring habits with authenticated, user-specific data backed by Supabase.
          </p>
        </div>
        <div className="session-panel">
          {user ? (
            <>
              <span>{user.email}</span>
              <button className="icon-button" onClick={signOut} aria-label="Log out" title="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <span>Signed out</span>
          )}
        </div>
      </section>

      {message && <p className="status-message">{message}</p>}

      {!user ? (
        <section className="auth-layout">
          <form className="auth-form" onSubmit={handleAuth}>
            <div className="segmented-control" aria-label="Authentication mode">
              <button
                type="button"
                className={authMode === 'login' ? 'active' : ''}
                onClick={() => setAuthMode('login')}
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'active' : ''}
                onClick={() => setAuthMode('register')}
              >
                <UserPlus size={16} />
                Register
              </button>
            </div>
            <label>
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                minLength="6"
                required
              />
            </label>
            <button className="primary-button" disabled={saving}>
              {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {saving ? 'Working...' : authMode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>
        </section>
      ) : (
        <section className="workspace-grid">
          <aside className="control-panel">
            <div className="metric-row">
              <div>
                <strong>{habits.length}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{completionRate}%</strong>
                <span>Today</span>
              </div>
            </div>

            <form onSubmit={createHabit} className="habit-form">
              <label>
                Habit
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Drink water"
                  required
                />
              </label>
              <label>
                Frequency
                <select
                  value={form.frequency}
                  onChange={(event) => setForm({ ...form, frequency: event.target.value })}
                >
                  {frequencies.map((frequency) => (
                    <option key={frequency}>{frequency}</option>
                  ))}
                </select>
              </label>
              <label>
                Target count
                <input
                  value={form.target_count}
                  onChange={(event) => setForm({ ...form, target_count: event.target.value })}
                  type="number"
                  min="1"
                  max="20"
                  required
                />
              </label>
              <label>
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Optional detail"
                  rows="3"
                />
              </label>
              <button className="primary-button" disabled={saving}>
                <Plus size={18} />
                {saving ? 'Saving...' : 'Add habit'}
              </button>
            </form>
          </aside>

          <section className="habit-board">
            <div className="board-toolbar">
              <h2>Today</h2>
              <button className="icon-button" onClick={fetchHabits} aria-label="Refresh habits" title="Refresh">
                <RefreshCw size={18} />
              </button>
            </div>

            {loading ? (
              <p className="empty-state">Loading habits...</p>
            ) : habits.length === 0 ? (
              <p className="empty-state">No habits yet. Add your first habit to begin.</p>
            ) : (
              <div className="habit-columns">
                {groupedHabits.map((group) => (
                  <section key={group.frequency} className="frequency-section">
                    <h3>{group.frequency}</h3>
                    <div className="habit-list">
                      {group.items.map((habit) => (
                        <article className="habit-card" key={habit.id}>
                          <div>
                            <div className="habit-title-row">
                              <CalendarCheck size={18} />
                              <h4>{habit.title}</h4>
                            </div>
                            <p>{habit.notes || `Target: ${habit.target_count} time(s)`}</p>
                          </div>
                          <div className="card-actions">
                            <button
                              className={habit.completed_today ? 'complete-button done' : 'complete-button'}
                              onClick={() => toggleComplete(habit)}
                            >
                              <Check size={16} />
                              {habit.completed_today ? 'Done' : 'Mark done'}
                            </button>
                            <button
                              className="icon-button subtle"
                              onClick={() => deleteHabit(habit.id)}
                              aria-label={`Delete ${habit.title}`}
                              title="Delete"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}
