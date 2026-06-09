'use client';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button 
      onClick={scrollToTop} 
      className="btn-submit btn-green animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        zIndex: 9999,
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        border: '3px solid #111827' // match neo brutalism stroke
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
