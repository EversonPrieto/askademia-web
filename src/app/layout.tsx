import type { Metadata } from "next";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'sonner';
import "./globals.css";

import { Inter, Inknut_Antiqua } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const inknut = Inknut_Antiqua({
  subsets: ['latin'], variable: '--font-inknut',
  weight: "300"
});

export const metadata: Metadata = {
  title: "Askademia",
  description: "Askademia é uma plataforma de perguntas e respostas",
  keywords: ["askademia", "monitorias", "DevQ&A", "perguntas", "respostas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${inknut.variable}`}>
      <body>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"/>
        
        <AuthProvider>
          <Header />
          <main className="main-content">
            {children}
          </main>
          
          <Toaster richColors position="top-center" />

        </AuthProvider>
      </body>
    </html>
  );
}