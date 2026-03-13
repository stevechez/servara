import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Or whatever font you were using
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ZidroPro | The AI-First Field Service Command Center',
  description:
    'Instant lead routing, AI dispatching, and automated revenue tracking for elite contractors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-[#0B0E14]`}>
        {children}
        <Toaster expand={false} richColors />
      </body>
    </html>
  );
}
