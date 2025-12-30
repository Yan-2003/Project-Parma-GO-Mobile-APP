import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState(null); 
  const [full_name, setfull_name] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const savedUsername = await AsyncStorage.getItem('username'); 
      if (token) setUserToken(token);
      if (savedUsername) setUsername(savedUsername);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (username, password) => {

    if (username === 'admin' && password === '1234') {
      const fakeToken = 'secret_token';
      await AsyncStorage.setItem('userToken', fakeToken);
      await AsyncStorage.setItem('username', username); 
      setUserToken(fakeToken);
      setUsername(username); 
      return true;
    } else {
      console.log("Checking username: " + username)
      try {
          console.log("user data: ", {
            username : username,
            password : password
          })

        const request = await axios.post(API_URL + '/user/login', { username : username, password : password})
        const fakeToken = 'secret_token';
        console.log("result: ", request.data)

        if(request.status == 401) return false

        await AsyncStorage.setItem('userToken', fakeToken);
        await AsyncStorage.setItem('username', request.data.username); 
        await AsyncStorage.setItem('full_name', request.data.name); 
        await AsyncStorage.setItem('user_role', request.data.user_role); 
        setUserToken(fakeToken);
        setUsername(username); 
        setfull_name(request.data.name)
        return true;
      } 
      catch (error) {
        console.log(error)
        return false
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    setUserToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, username, full_name, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};