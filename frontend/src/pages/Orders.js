import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/user/${user.id}`);
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={s.centered}>Loading orders...</div>;

  return (
    <div style={s.page}>
      <h1 style={s.title}>My Orders 📦</h1>
      {orders.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 64 }}>📭</div>
          <h2>No orders yet!</h2>
          <button style={s.shopBtn} onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div style={s.orders}>
          {orders.map(order => (
            <div key={order._id} style={s.card}>
              <div style={s.cardHeader}>
                <div>
                  <div style={s.orderId}>Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span style={{ ...s.status, background: STATUS_COLORS[order.status] + '22', color: STATUS_COLORS[order.status] }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div style={s.items}>
                {order.items.map((item, i) => (
                  <div key={i} style={s.item}>
                    <span style={s.itemName}>{item.productName}</span>
                    <span style={s.itemQty}>× {item.quantity}</span>
                    <span style={s.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={s.cardFooter}>
                <span style={s.address}>📍 {order.shippingAddress}</span>
                <span style={s.total}>Total: <strong style={{ color: '#6366f1' }}>${order.totalAmount.toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: '0 auto', padding: '24px' },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 24 },
  orders: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderId: { fontWeight: 700, fontSize: 16, marginBottom: 4 },
  orderDate: { fontSize: 13, color: '#64748b' },
  status: { padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  items: { borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: 12 },
  item: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 },
  itemName: { flex: 1, color: '#1e293b', fontWeight: 500 },
  itemQty: { color: '#64748b', marginRight: 16 },
  itemPrice: { fontWeight: 600 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  address: { fontSize: 13, color: '#64748b', flex: 1 },
  total: { fontSize: 15 },
  centered: { textAlign: 'center', padding: 60, color: '#94a3b8' },
  empty: { textAlign: 'center', padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  shopBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 15 },
};
