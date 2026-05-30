import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (!address) return setMessage('Please enter shipping address!');
    try {
      setLoading(true);
      // Create order
      const orderRes = await axios.post('/api/orders', {
        userId: user.id,
        items: cart.map(item => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: address,
      });
      const order = orderRes.data.data;
      // Process payment
      const payRes = await axios.post('/api/payments', {
        orderId: order._id,
        userId: user.id,
        amount: total,
        method,
      });
      if (payRes.data.success) {
        clearCart();
        setMessage('🎉 Order placed and payment successful!');
        setTimeout(() => navigate('/orders'), 2000);
      } else {
        setMessage('❌ Payment failed. Please try again.');
      }
    } catch (err) {
      setMessage('Something went wrong: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div style={s.empty}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2>Your cart is empty!</h2>
      <button style={s.shopBtn} onClick={() => navigate('/')}>Start Shopping</button>
    </div>
  );

  return (
    <div style={s.page}>
      <h1 style={s.title}>Your Cart 🛒</h1>
      {message && <div style={{ ...s.msg, background: message.includes('🎉') ? '#dcfce7' : '#fee2e2', color: message.includes('🎉') ? '#166534' : '#991b1b' }}>{message}</div>}
      <div style={s.layout}>
        {/* Cart Items */}
        <div style={s.items}>
          {cart.map(item => (
            <div key={item._id} style={s.item}>
              <div style={s.itemEmoji}>{getCategoryEmoji(item.category)}</div>
              <div style={s.itemInfo}>
                <h3 style={s.itemName}>{item.name}</h3>
                <span style={s.itemPrice}>${item.price}</span>
              </div>
              <div style={s.qtyControl}>
                <button style={s.qtyBtn} onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                <span style={s.qty}>{item.quantity}</span>
                <button style={s.qtyBtn} onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
              </div>
              <span style={s.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              <button style={s.removeBtn} onClick={() => removeFromCart(item._id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div style={s.checkout}>
          <h2 style={s.checkoutTitle}>Order Summary</h2>
          <div style={s.summary}>
            {cart.map(item => (
              <div key={item._id} style={s.summaryRow}>
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={s.totalRow}>
              <span>Total</span>
              <span style={{ color: '#6366f1', fontWeight: 800 }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <label style={s.label}>Shipping Address</label>
          <textarea style={s.input} value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your full address..." rows={3} />

          <label style={s.label}>Payment Method</label>
          <select style={s.input} value={method} onChange={e => setMethod(e.target.value)}>
            <option value="credit_card">💳 Credit Card</option>
            <option value="debit_card">💳 Debit Card</option>
            <option value="upi">📱 UPI</option>
            <option value="netbanking">🏦 Net Banking</option>
          </select>

          <button style={s.placeBtn} onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const getCategoryEmoji = (cat) => ({ Electronics: '💻', Footwear: '👟', Clothing: '👕' }[cat] || '📦');

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '24px' },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 24 },
  msg: { padding: '12px 20px', borderRadius: 8, marginBottom: 16, fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 },
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { background: '#fff', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  itemEmoji: { fontSize: 36, width: 56, textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  itemPrice: { fontSize: 13, color: '#64748b' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 12, background: '#f1f5f9', borderRadius: 8, padding: '4px 8px' },
  qtyBtn: { background: 'none', border: 'none', fontSize: 18, fontWeight: 700, color: '#6366f1', width: 24 },
  qty: { fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: 'center' },
  itemTotal: { fontWeight: 700, fontSize: 16, minWidth: 70, textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: 16 },
  checkout: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: 'fit-content' },
  checkoutTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  summary: { background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 8 },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 8 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, marginTop: 16, textTransform: 'uppercase' },
  input: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', resize: 'vertical' },
  placeBtn: { width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, fontSize: 15, marginTop: 20 },
  empty: { textAlign: 'center', padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  shopBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 15 },
};
