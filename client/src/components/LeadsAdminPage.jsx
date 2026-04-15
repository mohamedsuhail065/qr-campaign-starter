import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [instaOnly, setInstaOnly] = useState(false);
  const [winners, setWinners] = useState([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchFilter = filter === 'All' || l.answer === filter;
    const matchInsta = !instaOnly || l.clickedInstagram;
    return matchFilter && matchInsta;
  });
  
  const responses = ["All", ...new Set(leads.map(l => l.answer))];

  const pickWinners = () => {
    if (filteredLeads.length === 0) return;
    setIsDrawing(true);
    setWinners([]);

    // Simulate drawing animation
    setTimeout(() => {
      const shuffled = [...filteredLeads].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(winnerCount, shuffled.length));
      setWinners(selected);
      setIsDrawing(false);
    }, 2000);
  };

  return (
    <main className="page-shell" style={{ display: 'block', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Lottery Hub Section */}
      <section className="campaign-card animate-in" style={{ width: '100%', maxWidth: 'none', marginBottom: '32px', border: '1px solid #fbbf24' }}>
        <div className="eyebrow" style={{ color: '#fbbf24' }}>Lot Hub</div>
        <h1>Pick Winners</h1>
        <p className="intro">Select pool and number of users to draw.</p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>RESPONSE POOL</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--surface)', color: 'white', border: '1px solid var(--border)' }}
            >
              {responses.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>WINNERS</span>
            <input
              type="number"
              min="1"
              max={filteredLeads.length}
              value={winnerCount}
              onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
              style={{ width: '80px', padding: '12px', borderRadius: '12px', background: 'var(--surface)', color: 'white', border: '1px solid var(--border)' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '14px' }}>
            <input 
              type="checkbox" 
              checked={instaOnly} 
              onChange={(e) => setInstaOnly(e.target.checked)} 
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: instaOnly ? '#fbbf24' : 'var(--muted)' }}>
              Clicked Instagram Only
            </span>
          </label>

          <button
            onClick={pickWinners}
            className="primary-btn"
            style={{ padding: '12px 24px', background: '#fbbf24', color: '#000', marginTop: '14px' }}
            disabled={isDrawing || filteredLeads.length === 0}
          >
            {isDrawing ? 'Drawing...' : `Draw ${Math.min(winnerCount, filteredLeads.length)} Winners`}
          </button>
        </div>

        {winners.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {winners.map((winner, idx) => (
              <div key={winner._id} className="success-box animate-in" style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', margin: 0, animationDelay: `${idx * 0.1}s` }}>
                <div className="success-badge" style={{ background: '#fbbf24', color: '#000' }}>WINNER #{idx + 1}</div>
                <h3 style={{ color: '#fbbf24', margin: '12px 0 4px' }}>{winner.name}</h3>
                <p style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: 0 }}>{winner.mobile}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="campaign-card animate-in" style={{ width: '100%', maxWidth: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow">Admin Hub</div>
            <h1>Lead Submissions</h1>
            <p className="intro">Total participants: {leads.length}</p>
          </div>
        </div>

        {loading ? (
          <p>Loading submissions...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : leads.length === 0 ? (
          <p>No submissions found yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px' }}>User</th>
                  <th style={{ padding: '12px 8px' }}>Response</th>
                  <th style={{ padding: '12px 8px' }}>Insta</th>
                  <th style={{ padding: '12px 8px' }}>Source</th>
                  <th style={{ padding: '12px 8px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const isWinner = winners.some(w => w._id === lead._id);
                  return (
                    <tr key={lead._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: isWinner ? 'rgba(251, 191, 36, 0.1)' : 'transparent' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ fontWeight: 600 }}>{lead.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{lead.mobile}</div>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px' }}>{lead.answer}</td>
                      <td style={{ padding: '16px 8px' }}>
                        {lead.clickedInstagram ? 
                          <span style={{ color: '#22c55e', fontSize: '18px' }}>✓</span> : 
                          <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '18px' }}>×</span>
                        }
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <span className="eyebrow" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)' }}>{lead.ref}</span>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '13px', color: 'var(--muted)' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '32px' }}>
          <a href="/admin/qr" className="meta-text" style={{ textDecoration: 'none', color: 'var(--primary)' }}>
            ← Back to QR Generator
          </a>
        </div>
      </div>
    </main>
  );
}
