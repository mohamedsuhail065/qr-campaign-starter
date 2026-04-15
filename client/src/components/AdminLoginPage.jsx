import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Store auth state
      sessionStorage.setItem('adminToken', data.token);
      navigate('/admin/qr');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="campaign-card animate-in">
        <div className="eyebrow">Secure Access</div>
        <h1>Admin Login</h1>
        <p className="intro">Please enter the admin password to access the dashboard.</p>

        <form onSubmit={handleLogin} className="form-stack">
          <label>
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </section>
    </main>
  );
}
