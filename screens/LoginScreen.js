import { StyleSheet, Text, View, TextInput,ActivityIndicator, TouchableOpacity, Alert, TouchableWithoutFeedback, ScrollView, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {API_URL} from '@env'


export default function LoginScreen({setisLogin}) {

  const [username, setusername] = useState('');
  const [check_username_input, setcheck_username_input] = useState(false);
  const [check_password_input, setcheck_password_input] = useState(false);
  const [reg_username, setreg_username] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [FullName, setFullName] = useState('');
  const { login } = useContext(AuthContext);
  const [registering, setregistering] = useState(false);
  const [username_exist, setusername_exist] = useState(false);
  const [message, setmessage] = useState('');
  const [reg_name, setreg_name] = useState(false);
  const [reg_password, setreg_password] = useState(false);
  const [reg_confirm_password, setreg_confirm_password] = useState(false);
  const [isLoading, setisLoading] = useState(false);


  const handdle_register = async () =>{

      if(reg_username.length == 0){
        setmessage("Please input your username.")
        return setusername_exist(true)
      }

      if(FullName.length == 0){
        setmessage("Please input your full name.")
        return setreg_name(true)
      }

      if(password.length < 8){
        setmessage("Password must be 8 charaters or more.")
        return setreg_password(true)
      }

      if(password != confirmPassword){
        setmessage("Password did not match. ")
        return setreg_confirm_password(true)
      }


      console.log("Regsiter user")

      try {
        const request = await axios.post(API_URL + '/user/register', {
          username : reg_username,
          name : FullName,
          password : password
        })

        console.log(request)

        if(request.status == 200){
          Alert.alert("Successfully Registered.")
          setregistering(false)
        }else{
          Alert.alert("There was something wrong registering the account")
        }


      } catch (error) {
          console.log(error)
      }



  }

  const handdle_login =  async () =>{

    setmessage("")

    setisLoading(true)

    if(username.length == 0){
      setmessage("Please input your username.")
      setisLoading(false)
      return setcheck_username_input(true)
    }

    if(password.length == 0){
      setmessage("Please input your password.")
      setisLoading(false)
      return setcheck_password_input(true)
    }

    console.log("Login: " + username)
    try {
      const success =  await login(username, password)
      console.log(success)
      if(success){
        setisLogin(true)
        setisLoading(false)
      }else{
        setmessage("Invalid username and password please try again.")
        setcheck_username_input(true)
        setcheck_password_input(true)
        Alert.alert("Failed to Login Please try again.")
        setisLoading(false)
      }
    } catch (error) {
      console.log(error)
      setisLoading(false)
    }

  }


  const check_username_availability = async () =>{
    console.log("Checking Username: " + reg_username )
    try {
        const request = await axios.get(API_URL + '/user/check_username/'+ reg_username)

        console.log(request.data)

        if(request.data.user_found){
          setmessage("Username already exist.")
          return setusername_exist(true)
        }

        return setusername_exist(false)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    setmessage("")
  
    return () => {
      
    }
  }, [username]);


  useEffect(() => {
    
    check_username_availability()
    setmessage("")
  
    return () => {
      
    }
  }, [reg_username]);

  useEffect(() => {
    setreg_name(false)
  
    return () => {
      
    }
  }, [FullName]);


  useEffect(() => {
    setreg_password(false)
  
    return () => {
      
    }
  }, [password]);
  

  useEffect(() => {
    setreg_confirm_password(false)
  
    return () => {
      
    }
  }, [confirmPassword]);

  useEffect(() => {
    setcheck_username_input(false)
  
    return () => {
      
    }
  }, [username]);

  useEffect(() => {
    setcheck_password_input(false)
  
    return () => {
      
    }
  }, [password]);



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
      <ScrollView contentContainerStyle={styles.scroll}>
        {
        !registering ? 
        <>
            <View style={styles.container} >
              <View style={styles.form}>
                <Text style={styles.title}>Welcome To Pharma Go</Text>
                <Text style={styles.message_log}>{message}</Text>
                <TextInput value={username} onChangeText={e=>setusername(e)} style={check_username_input ? styles.danger_input_style : styles.input_style} placeholder='Username' />
                <TextInput secureTextEntry={true} value={password} onChangeText={e=>setpassword(e)} style={check_password_input ? styles.danger_input_style : styles.input_style} placeholder='Password' />
                  {
                    isLoading ? 
                    <View style={styles.btn_loading}>
                      <ActivityIndicator size="large" color="rgb(161, 52, 235)" /> 
                    </View>
                    :<TouchableOpacity onPress={handdle_login} style={styles.btn_login}><Text style={styles.textwhite}>Login</Text></TouchableOpacity>
                  }
                <TouchableOpacity onPress={()=>setregistering(true)}  style={{ alignSelf : 'center', marginTop : 10 }}><Text>Click Here to Register.</Text></TouchableOpacity>
              </View>
            </View>
        </>
        : 
        <>
              <View style={styles.container}>
              <View style={styles.form}>
                <Text style={styles.title}>Welcome To Pharma Go</Text>
                <Text style={styles.message_log}>{message}</Text>
                <TextInput value={reg_username} onChangeText={e=>setreg_username(e)} style={username_exist ? styles.danger_input_style : styles.input_style} placeholder='Username' />
                <TextInput value={FullName} onChangeText={e=>setFullName(e)} style={reg_name ? styles.danger_input_style : styles.input_style} placeholder='Full Name' />
                <TextInput secureTextEntry={true} value={password} onChangeText={e=>setpassword(e)} style={reg_password ? styles.danger_input_style : styles.input_style} placeholder='Password' />
                <TextInput secureTextEntry={true} value={confirmPassword} onChangeText={e=>setconfirmPassword(e)} style={reg_confirm_password ? styles.danger_input_style : styles.input_style} placeholder='Confirm Password' />
                <TouchableOpacity onPress={handdle_register} style={styles.btn_login}><Text style={styles.textwhite}>Register</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setregistering(false)}  style={{ alignSelf : 'center', marginTop : 10 }}><Text>Click Here to Login.</Text></TouchableOpacity>
              </View>
            </View>
        </>
        }
    
      </ScrollView>
    </TouchableWithoutFeedback>

  )
}

const styles = StyleSheet.create({

  scroll : {
    flex : 1,
  },

  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },

  form : {  
    width : 250,

  },

  input_style : {
    borderWidth : 1,
    borderColor : 'gray',
    padding : 15,
    margin : 5,
    borderRadius : 10,
  },

  danger_input_style : {
    borderWidth : 1,
    borderColor : 'red',
    padding : 15,
    margin : 5,
    borderRadius : 10,
  },

  btn_login : { 
    padding : 20,
    margin : 5,
    borderRadius : 10,
    backgroundColor : 'rgba(168, 97, 219, 1)',
    justifyContent : 'center',
    alignItems : 'center',
  },

  textwhite : {
    color : 'white'
  },

  title : {
    fontSize : 20,
    fontWeight : 'bold',
    alignSelf : 'center',
    marginBottom : 20,
  },

  message_log : {
    color : "red",
    fontSize : 10,
    paddingLeft : 10,
  },

  btn_loading : {
    margin : 5,
  }

})