import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Fintech MVP',
  description: 'Gestión de finanzas personales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-50 min-h-screen antialiased selection:bg-cyan-500/30">
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
