import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { user, deductBalance } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('KantinPay');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Format currency
  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const finalTotal = cartTotal * 0.9; // 10% student discount applied
  const isBalanceInsufficient = user && paymentMethod === 'KantinPay' && user.balance < finalTotal;

  const handleCheckout = async () => {
    if (!user) return;
    
    if (isBalanceInsufficient) {
      setErrorMessage('Saldo KantinPay tidak mencukupi');
      return;
    }

    setIsCheckingOut(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          npm: user.npm,
          items: cartItems.map(item => ({
            idMeal: item.idMeal,
            strMeal: item.strMeal,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod,
          total: finalTotal
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses checkout pesanan');
      }

      // Success
      if (paymentMethod === 'KantinPay') {
        deductBalance(finalTotal);
      }
      setCheckoutSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setCheckoutSuccess(false);
      setErrorMessage('');
    }, 300);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAndReset}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900">Keranjang Belanja</h2>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeAndReset}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors active:scale-90"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-grow overflow-y-auto p-5">
          {checkoutSuccess ? (
            /* Checkout Success State */
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-5 border border-emerald-100">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pesanan Berhasil!</h3>
              <p className="text-sm text-slate-600 max-w-xs leading-relaxed mb-6 font-medium">
                Pesanan Anda telah dikirim ke kantin. Silakan ambil makanan Anda sesuai dengan nomor antrean yang diberikan.
              </p>
              <button onClick={closeAndReset} className="btn-primary w-full max-w-[200px]">
                Kembali Belanja
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Keranjang Belanja Kosong</h3>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed mb-6">
                Belum ada makanan pilihanmu. Silakan pilih menu di halaman utama.
              </p>
              <button onClick={closeAndReset} className="btn-secondary text-xs">
                Mulai Cari Makanan
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.idMeal}
                  className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:border-slate-200 transition-colors"
                >
                  {/* Thumb */}
                  <img
                    src={item.strMealThumb}
                    alt={item.strMeal}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-100 border border-slate-150"
                  />
                  
                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm text-slate-800 truncate" title={item.strMeal}>
                      {item.strMeal}
                    </h4>
                    <span className="text-xs text-slate-900 font-bold block mt-0.5">
                      {formatPrice(item.price)}
                    </span>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2.5 mt-2">
                      <button
                        onClick={() => updateQuantity(item.idMeal, item.quantity - 1)}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-700 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.idMeal, item.quantity + 1)}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.idMeal)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    title="Hapus"
                    aria-label="Hapus dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout) */}
        {!checkoutSuccess && cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 space-y-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            
            {/* Pricing Summary */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Diskon Mahasiswa (10%)</span>
                <span className="text-emerald-600 font-semibold">-{formatPrice(cartTotal * 0.1)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Biaya</span>
                <span className="text-base text-emerald-650 font-extrabold">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {user ? (
              /* If Logged In: Show Payment Method Selection & Checkout */
              <div className="space-y-4 pt-2">
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Metode Pembayaran</span>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className={`flex flex-col p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'KantinPay'
                        ? 'bg-white border-blue-500 text-blue-600 shadow-sm'
                        : 'bg-slate-100/50 border-slate-150 text-slate-500 hover:bg-slate-100'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'KantinPay'}
                        onChange={() => setPaymentMethod('KantinPay')}
                        className="sr-only"
                      />
                      <span>KantinPay</span>
                      <span className="text-[10px] font-normal text-slate-400 mt-0.5">Saldo online</span>
                    </label>

                    <label className={`flex flex-col p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-white border-blue-500 text-blue-600 shadow-sm'
                        : 'bg-slate-100/50 border-slate-150 text-slate-500 hover:bg-slate-100'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="sr-only"
                      />
                      <span>Bayar di Kasir</span>
                      <span className="text-[10px] font-normal text-slate-400 mt-0.5">Tunai/COD</span>
                    </label>
                  </div>

                  {paymentMethod === 'KantinPay' && (
                    <div className="flex items-center justify-between text-[11px] font-medium pt-1.5 text-slate-500">
                      <span>Saldo KantinPay Anda:</span>
                      <span className={`font-bold flex items-center gap-1 ${isBalanceInsufficient ? 'text-red-500' : 'text-slate-800'}`}>
                        <Wallet className="w-3 h-3" />
                        {formatPrice(user.balance)}
                      </span>
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {isBalanceInsufficient && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Saldo KantinPay Anda tidak mencukupi untuk pesanan ini!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={clearCart}
                    className="btn-secondary text-xs py-3"
                    disabled={isCheckingOut}
                  >
                    Kosongkan
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || isBalanceInsufficient}
                    className="btn-primary text-xs py-3 relative overflow-hidden"
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Memproses...
                      </span>
                    ) : (
                      <span>Pesan Sekarang</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* If Not Logged In: Prompt to login first */
              <div className="pt-2">
                <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3.5 rounded-xl text-xs space-y-3 leading-relaxed">
                  <p className="font-medium">
                    Silakan **Masuk / Login** sebagai mahasiswa terlebih dahulu menggunakan tombol di kanan atas untuk dapat melakukan pemesanan makanan.
                  </p>
                </div>
                <button
                  disabled
                  className="w-full mt-4 py-3 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed"
                >
                  Pesan Sekarang (Harus Login)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
