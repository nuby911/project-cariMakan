import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper function to simulate a consistent price based on meal ID / name
export const getSimulatedPrice = (mealId, _mealName) => {
  // Simple deterministic pricing based on mealId hash or length
  const idNum = parseInt(mealId) || 0;
  const basePrice = 15000; // Rp 15.000 minimum
  const variablePrice = ((idNum % 5) + 1) * 4000; // Rp 4.000 - Rp 20.000
  return basePrice + variablePrice;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('carimakan_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('carimakan_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (meal) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.idMeal === meal.idMeal);
      if (existingItem) {
        return prevItems.map((item) =>
          item.idMeal === meal.idMeal ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          price: getSimulatedPrice(meal.idMeal, meal.strMeal),
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (idMeal) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.idMeal !== idMeal));
  };

  const updateQuantity = (idMeal, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(idMeal);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.idMeal === idMeal ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
