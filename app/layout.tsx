import type { Metadata } from "next";
import "./globals.css";
import { Galindo } from 'next/font/google'
import Header from './components/Header';


export const metadata: Metadata = {
  title: 'Brainrot - Browserbase Meme Generator',
  description: 'Generate memes using AI and browser automation',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ]
  }
};

const galindo = Galindo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-galindo',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${galindo.variable} font-galindo antialiased bg-[#FFF5E1] dark:bg-[#1a1b1e] text-[#1a1b1e] dark:text-white`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
