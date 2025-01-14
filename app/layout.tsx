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
  },
  openGraph: {
    title: 'Your Meme Generator',
    description: 'Create AI-powered memes in minutes',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Meme Generator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Meme Generator',
    description: 'Create AI-powered memes in minutes',
    creator: '@alexdphan',
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`],
  },
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
      <body className={`${galindo.variable} font-galindo antialiased bg-[#FFF5E1] dark:bg-[#1a1b1e] text-[#1a1b1e] dark:text-white flex flex-col overflow-x-hidden overflow-y-auto`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
