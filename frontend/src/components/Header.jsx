import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Wallet, Home, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onCartClick, onLoginClick }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Format balance
  const formatBalance = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }, 1800);
  };

  return (
    <>
      <header className="glass-header sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand / Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <img 
                src="/logo.png" 
                alt="CariMakan Logo" 
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
              />
            </Link>
            <nav className="hidden sm:flex items-center gap-2">
              <Link 
                to="/" 
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:text-blue-650 hover:bg-slate-50'
                }`}
              >
                Beranda
              </Link>
              <Link 
                to="/restaurants" 
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/restaurants' || location.pathname.startsWith('/restaurant')
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:text-blue-650 hover:bg-slate-50'
                }`}
              >
                Daftar Kantin
              </Link>
            </nav>
          </div>

          {/* Navigation & Action */}
          <div className="flex items-center gap-3">
            {/* Wallet Balance Badge (if logged in) */}
            {user && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded-xl text-xs font-bold shadow-sm">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                <span>{formatBalance(user.balance)}</span>
              </div>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onCartClick}
              className="hidden sm:block relative p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all duration-200 active:scale-95 group"
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Vertical Divider separating actions from user session */}
            <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1"></div>

            {/* User Session Block */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Profile Card */}
                <div className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
                  {/* Circular avatar badge */}
                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-[10px] sm:text-xs shadow-inner flex-shrink-0">
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                  {/* Name and NPM column */}
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 tracking-wide truncate max-w-[60px] sm:max-w-[120px]">
                      {user.nama.split(' ')[0]}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      NPM {user.npm}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="hidden sm:flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-colors active:scale-95"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
              >
                <User className="w-4 h-4 text-white" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation for Mobile Devices */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-150 flex justify-around items-center py-2 sm:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <Link 
          to="/" 
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-650 transition-colors p-1"
        >
          <Home className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] font-bold">Beranda</span>
        </Link>

        <Link 
          to="/restaurants" 
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-650 transition-colors p-1"
        >
          <Utensils className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] font-bold">Kantin</span>
        </Link>

        <button 
          onClick={onCartClick}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-650 transition-colors p-1 relative"
        >
          <ShoppingCart className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] font-bold">Keranjang</span>
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-blue-600 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {user ? (
          <button 
            onClick={handleLogoutClick}
            className="flex flex-col items-center gap-0.5 text-slate-550 hover:text-red-500 transition-colors p-1"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] font-bold">Keluar</span>
          </button>
        ) : (
          <button 
            onClick={onLoginClick}
            className="flex flex-col items-center gap-0.5 text-slate-550 hover:text-blue-650 transition-colors p-1"
          >
            <User className="w-5 h-5 text-slate-600" />
            <span className="text-[10px] font-bold">Masuk</span>
          </button>
        )}
      </nav>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-slate-900/40 backdrop-blur-sm">
          {/* Modal Card */}
          <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-sm p-6 overflow-hidden animate-scale-up">
            
            {!isLoggingOut ? (
              <div className="space-y-6 text-center">
                {/* Visual Icon Alert */}
                <div className="relative flex justify-center mt-2">
                  <div className="absolute inset-0 bg-red-100 rounded-full w-16 h-16 mx-auto animate-pulse-border"></div>
                  <div className="relative bg-red-50 text-red-500 border border-red-100 rounded-full w-16 h-16 flex items-center justify-center shadow-inner">
                    <LogOut className="w-7 h-7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-slate-900">Keluar Akun?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-4">
                    Apakah Anda yakin ingin keluar dari akun Anda? Anda harus masuk kembali untuk memesan makanan.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-1/2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-all active:scale-[0.98] border border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    className="w-1/2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] shadow-md shadow-red-500/10 hover:shadow-red-500/20 flex items-center justify-center gap-1.5"
                  >
                    <span>Ya, Keluar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4">
                {/* Visual Leaving Animation */}
                <div className="flex justify-center">
                  <div className="relative bg-blue-50 text-blue-600 border border-blue-100 rounded-full w-16 h-16 flex items-center justify-center shadow-inner overflow-hidden">
                    <LogOut className="w-7 h-7 animate-door-slide" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-slate-900">Sampai Jumpa!</h3>
                  <p className="text-xs text-slate-550">
                    Sedang mengeluarkan Anda dengan aman...
                  </p>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full animate-progress"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
