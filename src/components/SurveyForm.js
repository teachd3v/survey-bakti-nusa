'use client';

import { useState } from 'react';

export default function SurveyForm({ awardee, rubrics }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    namaEvaluator: '',
    kotaEvaluator: '',
    hubungan: '',
    lamaKenal: '',
    scores: Array(rubrics.length).fill(null),
    saranDiri: '',
    saranProgram: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [modalMsg, setModalMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const categories = [...new Set(rubrics.map(r => r['Kategori']))];
  const totalSteps = 2 + categories.length;

  const handleScoreChange = (index, value) => {
    const newScores = [...formData.scores];
    newScores[index] = value;
    setFormData({ ...formData, scores: newScores });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!isAnon && !formData.namaEvaluator) {
        document.getElementById('field-nama')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!formData.kotaEvaluator) {
        document.getElementById('field-kota')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!formData.hubungan) {
        document.getElementById('field-hubungan')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!formData.lamaKenal) {
        document.getElementById('field-lama')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    } else if (step > 1 && step <= 1 + categories.length) {
      const categoryIndex = step - 2;
      const catName = categories[categoryIndex];
      const unansweredIdx = rubrics.findIndex((r, idx) => r['Kategori'] === catName && formData.scores[idx] === null);
      if (unansweredIdx !== -1) {
        const el = document.getElementById(`field-q${unansweredIdx}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.transition = 'all 0.3s ease';
          el.style.transform = 'scale(1.02)';
          el.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.2)';
          setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.boxShadow = 'none';
          }, 800);
        }
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
  };

  const handleKirimClick = (e) => {
    if (e) e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }
    if (formData.scores.includes(null)) {
      setModalMsg({ type: 'warning', text: 'Masih ada pertanyaan yang terlewat nih! Yuk cek lagi.' });
      return;
    }
    setShowConfirm(true);
  };

  const executeSubmit = async () => {
    setShowConfirm(false);
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referal: awardee.Referal,
          namaAwardee: awardee['Nama Awardee'],
          wilayah: awardee.Wilayah,
          ...formData,
          namaEvaluator: isAnon ? 'Anonim' : formData.namaEvaluator
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.message);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };


  const emojis = [
    { score: 0, text: 'Tidak Setuju', emoji: '👎' },
    { score: 1, text: 'Kurang Setuju', emoji: '😕' },
    { score: 2, text: 'Cukup Setuju', emoji: '😐' },
    { score: 3, text: 'Setuju', emoji: '🙂' },
    { score: 4, text: 'Sangat Setuju', emoji: '🌟' }
  ];

  return (
    <main className="wide-container">
      <div style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="blob" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
            {status === 'success' ? (
              <span style={{ fontSize: '2rem' }}>🎉</span>
            ) : (
              <img src="/logo.png" alt="Logo BAKTI NUSA" style={{ height: '20px' }} />
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.2rem', lineHeight: 1.2 }}>Peer Review</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Evaluasi 360° Awardee</p>
          </div>
        </div>
      </div>

      <div className="app-screen" style={{ marginTop: 0, padding: '1.5rem 1rem', minHeight: '85vh' }}>
        <div className="catalog-card" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
          <div className="catalog-card-header" style={{ marginBottom: 0 }}>
            {awardee.Foto ? (
              <img 
                src={awardee.Foto.match(/[/\\]images[/\\](.*)/) ? '/images/' + awardee.Foto.match(/[/\\]images[/\\](.*)/)[1].replace(/\\/g, '/') : awardee.Foto} 
                alt={`Foto ${awardee['Nama Awardee']}`} 
                className="profile-photo"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(awardee['Nama Awardee']) + '&background=dc2626&color=fff&size=200' }} 
              />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(awardee['Nama Awardee'])}&background=dc2626&color=fff&size=200`} alt={`Avatar ${awardee['Nama Awardee']}`} className="profile-photo" />
            )}
            <div className="catalog-card-info">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{awardee['Nama Awardee']}</h3>
              <div className="catalog-card-badges">
                <span className="profile-badge">📍 {awardee.Wilayah}</span>
                {awardee.Kampus && <span className="profile-badge">🎓 {awardee.Kampus}</span>}
              </div>
            </div>
          </div>
        </div>

        {status === 'success' ? (
          <div className="glass-card" style={{ textAlign: 'center', marginTop: '1rem', padding: '2rem 1rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Terima Kasih!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Evaluasi Anda telah berhasil disimpan.</p>
            <button onClick={() => window.location.href = '/'} className="btn-submit btn-green" style={{ padding: '0.8rem', fontSize: '0.9rem' }}>Kembali ke Beranda</button>
          </div>
        ) : (
          <form onSubmit={handleKirimClick}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 1rem' }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: '6px', background: step > i ? 'var(--primary)' : 'rgba(0,0,0,0.05)', margin: '0 4px', borderRadius: '4px', transition: 'all 0.3s ease' }}></div>
              ))}
            </div>

            {step === 1 && (
              <div className="glass-card animate-fade-in">
                <h2 className="section-title">Step 1: Profil Responden</h2>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px' }}>
                  <input type="checkbox" id="anonToggle" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }} />
                  <label htmlFor="anonToggle" style={{ fontSize: '0.95rem', cursor: 'pointer', userSelect: 'none' }}>Isi sebagai Anonim</label>
                </div>
                {!isAnon && (
                  <div id="field-nama" className="form-group animate-fade-in" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                    <label className="form-label">Nama Saudara *</label>
                    <input type="text" className="form-input" value={formData.namaEvaluator} onChange={e => setFormData({...formData, namaEvaluator: e.target.value})} />
                  </div>
                )}
                <div id="field-kota" className="form-group" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                  <label className="form-label">Kota/Kabupaten Domisili *</label>
                  <input type="text" className="form-input" value={formData.kotaEvaluator} onChange={e => setFormData({...formData, kotaEvaluator: e.target.value})} />
                </div>
                <div id="field-hubungan" className="form-group" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                  <label className="form-label">Dalam hal apa anda berhubungan dengan yang bersangkutan? *</label>
                  <select className="form-select" value={formData.hubungan} onChange={e => setFormData({...formData, hubungan: e.target.value})}>
                    <option value="">Pilih Hubungan...</option>
                    <option value="Atasan/Leader di organisasi">Atasan/Leader di organisasi</option>
                    <option value="Anggota tim">Anggota tim</option>
                    <option value="Pembina/Pembimbing">Pembina/Pembimbing</option>
                    <option value="Teman organisasi">Teman organisasi</option>
                    <option value="Teman kos / Teman dekat">Teman kos / Teman dekat</option>
                    <option value="Manager Wilayah">Manager Wilayah</option>
                    <option value="Awardee angkatan se-Wilayah (Peer)">Awardee angkatan se-Wilayah (Peer)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div id="field-lama" className="form-group" style={{ padding: '0.5rem', borderRadius: '12px' }}>
                  <label className="form-label">Berapa lama saudara mengenal yang bersangkutan? *</label>
                  <select className="form-select" value={formData.lamaKenal} onChange={e => setFormData({...formData, lamaKenal: e.target.value})}>
                    <option value="">Pilih Durasi...</option>
                    <option value="< 5 bulan">&lt; 5 bulan</option>
                    <option value="5 bulan - 1 tahun">5 bulan - 1 tahun</option>
                    <option value="> 1 tahun">&gt; 1 tahun</option>
                  </select>
                </div>
              </div>
            )}

            {categories.map((cat, catIndex) => {
              const currentStep = catIndex + 2;
              if (step !== currentStep) return null;
              return (
                <div key={cat} className="glass-card animate-fade-in">
                  <h2 className="section-title">{cat}</h2>
                  {rubrics.map((rubric, idx) => rubric['Kategori'] === cat && (
                    <div id={`field-q${idx}`} key={idx} className="form-group" style={{ marginBottom: '1.5rem', padding: '0.5rem', borderRadius: '16px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.8rem' }}>{rubric['Indikator Penilaian']}</p>
                      <div className="likert-scale" style={{ gap: '0.3rem', marginTop: '0.5rem' }}>
                        {emojis.map(({ score, text, emoji }) => (
                          <div key={score} className="likert-option">
                            <input type="radio" id={`q${idx}-${score}`} name={`q${idx}`} value={score} checked={formData.scores[idx] === score} onChange={() => handleScoreChange(idx, score)} />
                            <label htmlFor={`q${idx}-${score}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60px', padding: '0.5rem' }}>
                              <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      {formData.scores[idx] !== null && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {emojis.find(e => e.score === formData.scores[idx])?.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}

            {step === totalSteps && (
              <div className="glass-card animate-fade-in">
                <h2 className="section-title">Final Step: Saran</h2>
                <div className="form-group">
                  <label className="form-label">Saran Pengembangan Diri</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Mohon berikan masukan untuk pengembangan kepemimpinan yang bersangkutan.</p>
                  <textarea className="form-textarea" rows="4" value={formData.saranDiri} onChange={e => setFormData({...formData, saranDiri: e.target.value})} placeholder="Tuliskan saran di sini..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Saran untuk Program</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Berikan masukan untuk pengembangan program BAKTI NUSA di masa mendatang.</p>
                  <textarea className="form-textarea" rows="4" value={formData.saranProgram} onChange={e => setFormData({...formData, saranProgram: e.target.value})} placeholder="Tuliskan saran di sini..."></textarea>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              {step > 1 && (
                <button type="button" onClick={prevStep} className="btn-submit" style={{ flex: '0.2', background: '#e5e7eb', color: '#111827', padding: '0.8rem' }}>←</button>
              )}
              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn-submit btn-green" style={{ flex: '1', padding: '0.8rem', fontSize: '0.9rem' }}>Lanjut</button>
              ) : (
                <button type="button" onClick={handleKirimClick} disabled={status === 'loading'} className="btn-submit btn-green" style={{ flex: '1', padding: '0.8rem', fontSize: '0.9rem' }}>{status === 'loading' ? 'Mengirim...' : 'Kirim'}</button>
              )}
            </div>
          </form>
        )}
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

      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26, 32, 44, 0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="animate-fade-in" style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem 1.5rem', width: '85%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>🤔</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#111827', fontWeight: 800 }}>Sudah Yakin?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>Pastikan jawaban yang Anda berikan adalah benar dan sejujur-jujurnya.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowConfirm(false)} className="btn-submit" style={{ flex: '1', background: '#e5e7eb', color: '#111827', padding: '0.8rem' }}>Cek Lagi</button>
              <button onClick={executeSubmit} className="btn-submit btn-green" style={{ flex: '1', padding: '0.8rem' }}>Ya, Kirim!</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
