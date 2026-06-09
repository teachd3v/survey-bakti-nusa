import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function getAwardee(referal) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'daftar_awardee.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(fileContent, { header: true }).data.find(a => a.Referal === referal);
}

export default async function DashboardPage({ params }) {
  const { referal } = await params;
  const awardee = getAwardee(referal);
  if (!awardee) return notFound();

  let respondents = [];
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ auth, version: 'v4' });
    const spreadsheetId = process.env.SPREADSHEET_ID;

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:CZ',
    });
    
    const rows = res.data.values || [];
    // Index 1 is Referal
    respondents = rows.slice(1).filter(r => r[1] === referal);
  } catch (error) {
    console.error('Failed to fetch from sheets', error);
  }

  const stats = {
    total: respondents.length,
    hubungan: {},
    lamaKenal: {},
    kota: {}
  };

  const saranList = [];

  respondents.forEach(r => {
    const hub = r[6] || 'Tidak Diketahui';
    const lama = r[7] || 'Tidak Diketahui';
    const kota = r[5] || 'Tidak Diketahui';
    stats.hubungan[hub] = (stats.hubungan[hub] || 0) + 1;
    stats.lamaKenal[lama] = (stats.lamaKenal[lama] || 0) + 1;
    stats.kota[kota] = (stats.kota[kota] || 0) + 1;
    // Kolom BG adalah index 58 (Saran Diri)
    const saranDiri = r[58];
    
    if (saranDiri && saranDiri.trim() !== '') {
      saranList.push({
        saranDiri
      });
    }
  });

  return (
    <main className="wide-container" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        <Link href="/" style={{ color: 'var(--accent-green)', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem', fontWeight: 700, fontSize: '0.9rem' }}>
          ← Kembali
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="blob" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
            <img src="/logo.png" alt="Logo BAKTI NUSA" style={{ height: '20px' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.2rem', lineHeight: 1.2 }}>Data Insight</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{awardee['Nama Awardee']} • {awardee.Wilayah}</p>
          </div>
        </div>
      </div>

      <div className="app-screen" style={{ marginTop: 0, padding: '1.5rem 1rem', minHeight: '85vh' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div className="glass-card animate-fade-in" style={{ textAlign: 'center', marginBottom: 0, padding: '1.5rem 1rem' }}>
          <h2 className="section-title">Ringkasan Demografi</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
            {stats.total} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Responden</span>
          </div>
          
          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--primary)' }}>Hubungan</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(stats.hubungan).map(([key, val]) => (
              <li key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{key}</span>
                <strong style={{ background: 'var(--primary)', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '20px', fontSize: '0.8rem' }}>{val}</strong>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--primary)' }}>Lama Kenal</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(stats.lamaKenal).map(([key, val]) => (
              <li key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{key}</span>
                <strong style={{ background: 'var(--primary)', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '20px', fontSize: '0.8rem' }}>{val}</strong>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--primary)' }}>Kota Domisili</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(stats.kota).map(([key, val]) => (
              <li key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{key}</span>
                <strong style={{ background: 'var(--primary)', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '20px', fontSize: '0.8rem' }}>{val}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card animate-fade-in" style={{ maxHeight: '650px', overflowY: 'auto', padding: '1.5rem 1rem' }}>
          <h2 className="section-title">Saran & Masukan</h2>
          {saranList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Belum ada saran yang masuk untuk awardee ini.</p>
          ) : (
            saranList.map((s, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#111827' }}>"{s.saranDiri}"</span>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </main>
  );
}
