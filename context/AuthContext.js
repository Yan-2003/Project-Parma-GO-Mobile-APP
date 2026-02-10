import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [full_name, setFullName] = useState(null);
  const [user_role, setUserRole] = useState(null);
  const [user_id, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ===========================
     LOAD SAVED SESSION
  =========================== */
  useEffect(() => {

    const loadSession = async () => {
      try {

        const token = await AsyncStorage.getItem('userToken');
        const savedUsername = await AsyncStorage.getItem('username');
        const savedName = await AsyncStorage.getItem('full_name');
        const savedRole = await AsyncStorage.getItem('user_role');
        const savedId = await AsyncStorage.getItem('user_id');

        if (token) setUserToken(token);
        if (savedUsername) setUsername(savedUsername);
        if (savedName) setFullName(savedName);
        if (savedRole) setUserRole(savedRole);
        if (savedId) setUserId(Number(savedId));

      } catch (err) {
        console.log("Load session error:", err);
      }

      setLoading(false);
    };

    loadSession();

  }, []);


  /* ===========================
     LOGIN
  =========================== */
  const login = async (inputUsername, password) => {

    try {

      /* ---------- ADMIN LOGIN ---------- */
      if (inputUsername === 'admin' && password === '1234') {

        const token = 'admin_token';

        await AsyncStorage.multiSet([
          ['userToken', token],
          ['username', inputUsername],
          ['full_name', 'Administrator'],
          ['user_role', 'admin'],
          ['user_id', '0'],
        ]);

        setUserToken(token);
        setUsername(inputUsername);
        setFullName('Administrator');
        setUserRole('admin');
        setUserId(0);

        return true;
      }


      /* ---------- API LOGIN ---------- */

      console.log("Logging in:", inputUsername);

      const response = await axios.post(
        `${API_URL}/user/login`,
        {
          username: inputUsername,
          password: password,
        },
        {
          timeout: 10000, // ⬅ prevents Android hang
        }
      );


      /* ---------- VALIDATE RESPONSE ---------- */

      if (!response.data) {
        console.log("Empty API response");
        return false;
      }

      const data = response.data;

      if (!data.id || !data.username) {
        console.log("Invalid login response:", data);
        return false;
      }


      /* ---------- SAVE SESSION ---------- */

      const token = 'user_token'; // You can replace later with real JWT

      await AsyncStorage.multiSet([
        ['userToken', token],
        ['username', String(data.username)],
        ['full_name', String(data.name || '')],
        ['user_role', String(data.user_role || 'user')],
        ['user_id', String(data.id)],
      ]);


      /* ---------- UPDATE STATE ---------- */

      setUserToken(token);
      setUsername(data.username);
      setFullName(data.name || '');
      setUserRole(data.user_role || 'user');
      setUserId(data.id);

      return true;

    } catch (error) {

      console.log("Login error:", error?.response?.data || error.message);
      return false;

    }
  };


  /* ===========================
     LOGOUT
  =========================== */
  const logout = async () => {

    try {

      await AsyncStorage.multiRemove([
        'userToken',
        'username',
        'full_name',
        'user_role',
        'user_id',
      ]);

    } catch (e) {
      console.log("Logout error:", e);
    }

    setUserToken(null);
    setUsername(null);
    setFullName(null);
    setUserRole(null);
    setUserId(null);
  };


  /* ===========================
     PROVIDER
  =========================== */
  return (

    <AuthContext.Provider
      value={{
        userToken,
        user_id,
        username,
        user_role,
        full_name,
        login,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}