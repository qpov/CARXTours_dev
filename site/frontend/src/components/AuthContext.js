import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [token, isLoggedIn]);

  return (
    <AuthContext.Provider value={{ token, setAuthToken, isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};
