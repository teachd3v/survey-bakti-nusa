import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Evaluasi Publik BAKTI NUSA',
  description: 'Form evaluasi publik untuk awardee BAKTI NUSA',
};

import ScrollToTop from '@/components/ScrollToTop';

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
