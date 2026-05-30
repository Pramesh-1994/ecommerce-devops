import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Clothing'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const { addToCart } = useCart();

  useEffect(() => { fetchProducts(); }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products';
      if (category !== 'All') url += `?category=${category}`;
      const res = await axios.get(url);
      setProducts(res.data.data);
    } catch (e) {
      // seed first
      await axios.post('/api/products/seed');
      const res = await axios.get('/api/products');
      setProducts(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2000);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={s.page}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Welcome to ShopFlow 🛍️</h1>
        <p style={s.heroSub}>Microservices-powered E-Commerce Platform</p>
        <input style={s.search} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Categories */}
      <div style={s.categories}>
        {CATEGORIES.map(cat => (
          <button key={cat} style={{ ...s.catBtn, ...(category === cat ? s.catActive : {}) }} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={s.centered}>Loading products...</div>
      ) : (
        <div style={s.grid}>
          {filtered.map(product => (
            <div key={product._id} style={s.card}>
              <div style={s.imgBox}>
                <span style={s.emoji}>{getCategoryEmoji(product.category)}</span>
              </div>
              <div style={s.cardBody}>
                <span style={s.catTag}>{product.category}</span>
                <h3 style={s.productName}>{product.name}</h3>
                <p style={s.desc}>{product.description}</p>
                <div style={s.cardFooter}>
                  <span style={s.price}>${product.price}</span>
                  <span style={s.stock}>Stock: {product.stock}</span>
                </div>
                <button style={s.addBtn} onClick={() => handleAddToCart(product)}>
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const getCategoryEmoji = (cat) => ({ Electronics: '💻', Footwear: '👟', Clothing: '👕' }[cat] || '📦');

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '24px' },
  toast: { position: 'fixed', top: 80, right: 24, background: '#22c55e', color: '#fff', padding: '12px 20px', borderRadius: 8, fontWeight: 600, zIndex: 999 },
  hero: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, padding: '48px 32px', textAlign: 'center', marginBottom: 32, color: '#fff' },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 8 },
  heroSub: { fontSize: 16, opacity: 0.9, marginBottom: 24 },
  search: { width: '100%', maxWidth: 400, padding: '12px 20px', borderRadius: 30, border: 'none', fontSize: 15, outline: 'none' },
  categories: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  catBtn: { padding: '8px 20px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 500, fontSize: 14, color: '#64748b' },
  catActive: { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'transform 0.2s' },
  imgBox: { background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 64 },
  cardBody: { padding: 20 },
  catTag: { fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 16, fontWeight: 700, margin: '6px 0', color: '#1e293b' },
  desc: { fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 22, fontWeight: 800, color: '#6366f1' },
  stock: { fontSize: 12, color: '#94a3b8' },
  addBtn: { width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: 14 },
  centered: { textAlign: 'center', padding: 60, color: '#94a3b8' },
};
