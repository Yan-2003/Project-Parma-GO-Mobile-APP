// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setUserToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (username, password) => {

    
    // Simple check (replace with API call)
    if (username === 'admin' && password === '1234') {
      const fakeToken = 'example-token';
      await AsyncStorage.setItem('userToken', fakeToken);
      setUserToken(fakeToken);
      return true;
    } else {
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};