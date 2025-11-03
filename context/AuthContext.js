// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState(null); // ✅ store username
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const savedUsername = await AsyncStorage.getItem('username'); // ✅ load username
      if (token) setUserToken(token);
      if (savedUsername) setUsername(savedUsername);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (username, password) => {
    if (username === 'admin' && password === '1234') {
      const fakeToken = 'example-token';
      await AsyncStorage.setItem('userToken', fakeToken);
      await AsyncStorage.setItem('username', username); // ✅ save username
      setUserToken(fakeToken);
      setUsername(username); // ✅ update state
      return true;
    } else {
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    setUserToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};