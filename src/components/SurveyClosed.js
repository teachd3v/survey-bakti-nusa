'use client';

import Link from 'next/link';

export default function SurveyClosed({ awardee }) {
  const getImageUrl = (foto) => {
    if (!foto) return null;
    const match = foto.match(/[/\\]images[/\\](.*)/);
    return match ? '/images/' + match[1].replace(/\\/g, '/') : foto;
  };

  const name = awardee['Nama Awardee'];
  const photoUrl = getImageUrl(awardee.Foto);

  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', padding: '2rem 1rem' }}>
      {/* Logo & Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="blob" style={{ width: '70px', height: '70px', margin: '0 auto 0.8rem auto' }}>
          <img src="/logo.png" alt="Logo BAKTI NUSA" style={{ height: '22px' }} />
        </div>
        <h1 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 800, marginBottom: '0.1rem', lineHeight: 1.2 }}>
          Evaluasi Publik
        </h1>
        <p style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600 }}>
          Awardee BAKTI NUSA 15
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderRadius: 'var(--border-radius)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        {/* Closed Banner */}
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fee2e2', 
          borderRadius: '16px', 
          padding: '0.8rem 1rem', 
          color: '#dc2626', 
          fontSize: '0.85rem', 
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span> Survey Sudah Ditutup
        </div>

        {/* Awardee Target Info */}
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #f1f5f9', 
          borderRadius: '20px', 
          padding: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={name} 
              className="profile-photo" 
              style={{ width: '60px', height: '60px', marginBottom: 0, flexShrink: 0 }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=dc2626&color=fff' }}
            />
          ) : (
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff`} 
              alt={name} 
              className="profile-photo" 
              style={{ width: '60px', height: '60px', marginBottom: 0, flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', color: '#111827', margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h3>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              <span className="profile-badge" style={{ margin: 0, padding: '0.1rem 0.5rem', fontSize: '0.65rem' }}>📍 {awardee.Wilayah}</span>
              {awardee.Kampus && <span className="profile-badge" style={{ margin: 0, padding: '0.1rem 0.5rem', fontSize: '0.65rem' }}>🎓 {awardee.Kampus}</span>}
            </div>
          </div>
        </div>

        {/* Lock/Closed SVG Graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '50%', 
            width: '80px', 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'inset 0 0 12px rgba(239, 68, 68, 0.2)'
          }}>
            <svg style={{ width: '38px', height: '38px', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 style={{ fontSize: '1.3rem', color: '#111827', fontWeight: 800, marginBottom: '0.8rem' }}>
          Pengisian Formulir Berakhir
        </h2>
        
        <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Terima kasih atas antusiasme Anda. Pengisian survey evaluasi publik untuk awardee ini telah resmi ditutup pada tanggal <strong style={{ color: '#111827' }}>24 Juni pukul 23:59 WIB</strong>.
        </p>

        <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '2rem' }}>
          Saat ini kami sudah tidak menerima tanggapan data baru.
        </p>

        {/* Action Button */}
        <Link href="/" className="btn-submit btn-green" style={{ padding: '0.8rem', fontSize: '0.9rem', width: '100%', textDecoration: 'none' }}>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
