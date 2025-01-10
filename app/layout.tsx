import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from 'next/font/google'


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
