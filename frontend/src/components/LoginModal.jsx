import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  
  const [nama, setNama] = useState('');
  const [npm, setNpm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim() || !npm.trim()) {
      setErrorMsg('Nama dan NPM wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await login(nama, npm);
    
    setIsLoading(false);
    if (res.success) {
      // Clear inputs and close
      setNama('');
      setNpm('');
      onClose();
    } else {
      setErrorMsg(res.error || 'Terjadi kesalahan saat masuk');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-md p-6 z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors active:scale-90"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-1.5 bg-blue-50/50 rounded-2xl border border-blue-50 mb-1">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="font-extrabold text-lg text-slate-900">Masuk Akun Mahasiswa</h2>
          <p className="text-xs text-slate-555">
            Gunakan Nama Lengkap dan NPM Anda untuk mengakses pemesanan makanan kantin.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Form input: Nama */}
          <div className="space-y-1.5">
            <label htmlFor="nama" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nama Lengkap</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white rounded-xl transition-all">
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Form input: NPM */}
          <div className="space-y-1.5">
            <label htmlFor="npm" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NPM (Nomor Pokok Mahasiswa)</label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white rounded-xl transition-all">
              <input
                id="npm"
                type="text"
                value={npm}
                onChange={(e) => setNpm(e.target.value)}
                placeholder="Masukkan NPM Anda"
                className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-3 rounded-xl leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-xs font-bold"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5 justify-center">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Masuk...
              </span>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
