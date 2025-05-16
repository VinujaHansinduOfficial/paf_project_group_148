import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token')); // Use localStorage
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user'); // Use localStorage
    return userData ? JSON.parse(userData) : null;
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Use localStorage
    localStorage.setItem('token', jwtToken); // Use localStorage
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user'); // Use localStorage
    localStorage.removeItem('token'); // Use localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
