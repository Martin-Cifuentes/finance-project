"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
    router.refresh();
  };

  if (!mounted) return null;

  // Don't show navbar on login/signup
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 animate-pulse shadow-lg shadow-cyan-500/30"></div>
            <span className="text-white font-bold text-xl tracking-tight">Fintech<span className="text-cyan-400">MVP</span></span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/transactions" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${pathname.startsWith('/transactions') ? 'bg-white/10 text-cyan-300 shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                Transacciones
              </Link>
              <Link href="/categories" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${pathname.startsWith('/categories') ? 'bg-white/10 text-cyan-300 shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                Categorías
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 p-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  U
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="p-1">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
