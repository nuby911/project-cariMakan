import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo and Tagline */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-50/50 rounded-xl flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            CariMakan
          </span>
          <span className="text-slate-200">|</span>
          <p className="text-xs text-slate-500 font-medium">Layanan Pemesanan Makanan Kantin Kampus.</p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} CariMakan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
