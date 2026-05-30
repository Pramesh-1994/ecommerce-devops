import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/users/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🛍️ ShopFlow</div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Join ShopFlow today!</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} placeholder="Pramesh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={s.footer}>Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>Login</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  card: { background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  logo: { fontSize: 24, fontWeight: 800, color: '#6366f1', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 4 },
  sub: { color: '#64748b', textAlign: 'center', marginBottom: 24, fontSize: 14 },
  error: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, marginTop: 16, textTransform: 'uppercase' },
  input: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', fontSize: 14, outline: 'none' },
  btn: { width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, marginTop: 24 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' },
};
