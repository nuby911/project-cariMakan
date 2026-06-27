import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('carimakan_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync user profile state with local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('carimakan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('carimakan_user');
    }
  }, [user]);

  const login = async (nama, npm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, npm }),
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal login');
      }

      const data = await response.json();
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const deductBalance = (amount) => {
    if (!user) return;
    setUser((prevUser) => {
      const newBalance = Math.max(0, prevUser.balance - amount);
      return {
        ...prevUser,
        balance: newBalance,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, deductBalance }}>
      {children}
    </AuthContext.Provider>
  );
};
