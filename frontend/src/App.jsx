import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import RestoList from './pages/RestoList';
import RestoDetail from './pages/RestoDetail';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-950">
          {/* Navigation Bar */}
          <Header 
            onCartClick={() => setIsCartOpen(true)} 
            onLoginClick={() => setIsLoginOpen(true)} 
          />

          {/* Page Content */}
          <main className="flex-grow pb-16 sm:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<FoodDetail />} />
              <Route path="/restaurants" element={<RestoList />} />
              <Route path="/restaurant/:id" element={<RestoDetail />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Shopping Cart Side Drawer */}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

          {/* User Authentication Modal */}
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
