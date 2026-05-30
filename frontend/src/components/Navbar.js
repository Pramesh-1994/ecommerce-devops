import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>🛍️ ShopFlow</Link>
        <div style={s.links}>
          <Link to="/" style={s.link}>Products</Link>
          {user && <Link to="/orders" style={s.link}>My Orders</Link>}
        </div>
        <div style={s.right}>
          <Link to="/cart" style={s.cartBtn}>
            🛒 Cart {count > 0 && <span style={s.badge}>{count}</span>}
          </Link>
          {user ? (
            <div style={s.userArea}>
              <span style={s.userName}>Hi, {user.name}!</span>
              <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={s.authLinks}>
              <Link to="/login" style={s.loginBtn}>Login</Link>
              <Link to="/register" style={s.registerBtn}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 22, fontWeight: 800, color: '#6366f1' },
  links: { display: 'flex', gap: 24 },
  link: { color: '#64748b', fontWeight: 500, fontSize: 15, ':hover': { color: '#6366f1' } },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  cartBtn: { background: '#f1f5f9', padding: '8px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#1e293b', position: 'relative', display: 'flex', alignItems: 'center', gap: 6 },
  badge: { background: '#ef4444', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 },
  userArea: { display: 'flex', alignItems: 'center', gap: 12 },
  userName: { fontWeight: 600, fontSize: 14, color: '#475569' },
  logoutBtn: { background: 'none', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: 6, fontSize: 13, color: '#64748b' },
  authLinks: { display: 'flex', gap: 8 },
  loginBtn: { padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#6366f1', border: '1px solid #6366f1' },
  registerBtn: { padding: '7px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: '#6366f1', color: '#fff', border: 'none' },
};
