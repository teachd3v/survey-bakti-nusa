'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CatalogClient({ awardees }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMsg, setModalMsg] = useState(null);
  
  const filtered = awardees.filter(a => 
    a['Nama Awardee']?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.Wilayah?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (foto) => {
    if (!foto) return null;
    const match = foto.match(/[/\\]images[/\\](.*)/);
    return match ? '/images/' + match[1].replace(/\\/g, '/') : foto;
  };

  const copyLink = async (referal) => {
    const url = `${window.location.origin}/survey/${referal}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback untuk device/browser tanpa HTTPS (contoh: akses HP pakai IP lokal)
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed"; // hindari scroll saat select
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setModalMsg({ type: 'success', text: 'Link survey berhasil disalin! 🔗' });
    } catch (err) {
      console.error('Failed to copy: ', err);
      setModalMsg({ type: 'warning', text: 'Gagal menyalin otomatis. Silakan copy URL manual.' });
    }
  };

  return (
    <main className="wide-container">
      <div style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="blob" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
            <img src="/logo.png" alt="Logo BAKTI NUSA" style={{ height: '25px' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.2rem', lineHeight: 1.2 }}>Our Community</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Explore the incredible awardees</p>
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Cari nama atau wilayah..." 
          className="form-input" 
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            borderRadius: '16px', 
            padding: '0.6rem 1rem', 
            fontSize: '0.9rem',
            border: 'none', 
            background: '#fff', 
            display: 'block' 
          }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((a, i) => (
          <div key={i} className="animate-fade-in catalog-card" style={{ marginBottom: 0 }}>
            <div className="catalog-card-header">
              {a.Foto ? (
                <img 
                  src={getImageUrl(a.Foto)} 
                  alt={a['Nama Awardee']} 
                  className="profile-photo"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(a['Nama Awardee']) + '&background=dc2626&color=fff' }} 
                />
              ) : (
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(a['Nama Awardee'])}&background=dc2626&color=fff`} alt={a['Nama Awardee']} className="profile-photo" />
              )}
              <div className="catalog-card-info">
                <h3 style={{ fontSize: '1.4rem' }}>{a['Nama Awardee']}</h3>
                <div className="catalog-card-badges">
                  <span className="profile-badge">📍 {a.Wilayah}</span>
                  {a.Kampus && <span className="profile-badge">🎓 {a.Kampus}</span>}
                </div>
              </div>
            </div>
            
            <div className="catalog-card-actions" style={{ flexDirection: 'row', width: '100%', flexWrap: 'nowrap' }}>
              <Link href={`/survey/${a.Referal}`} className="btn-submit btn-green" style={{ flex: 1.5, padding: '0.4rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                📝 Survey
              </Link>
              <button onClick={() => copyLink(a.Referal)} className="btn-submit btn-outline" style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}>
                🔗 Copy
              </button>
              <Link href={`/dashboard/${a.Referal}`} className="btn-submit btn-outline" style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}>
                📊 Data
              </Link>
            </div>
          </div>
        ))}
      </div>

      {modalMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26, 32, 44, 0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="animate-fade-in" style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem 1.5rem', width: '85%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>{modalMsg.type === 'success' ? '🥳' : '🥺'}</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#111827', fontWeight: 800 }}>{modalMsg.text}</h3>
            <button onClick={() => setModalMsg(null)} className="btn-submit btn-green" style={{ width: '100%' }}>Oke, Siap!</button>
          </div>
        </div>
      )}
    </main>
  );
}
