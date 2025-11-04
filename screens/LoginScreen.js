import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {API_URL} from '@env'

export default function LoginScreen({setisLogin}) {

  const [username, setusername] = useState();
  const [password, setpassword] = useState();
  const [confirmPassword, setconfirmPassword] = useState();
  const [FullName, setFullName] = useState();
  const { login } = useContext(AuthContext);
  const [registering, setregistering] = useState(false);


  const handdle_register = async () =>{

      console.log("Regsiter user")

      try {
        const request = await axios.post(API_URL + '/user/register', {
          username : username,
          name : FullName,
          password : password
        })

        console.log(request)

        if(request.status == 200){
          Alert.alert("Successfully Registered.")
        }else{
          Alert.alert("There was something wrong registering the account")
        }


      } catch (error) {
          console.log(error)
      }



  }

  const handdle_login =  async () =>{
    console.log("Login: " + username)
    try {
      const success =  await login(username, password)
      console.log(success)
      if(success){
        setisLogin(true)
      }else{
        Alert.alert("Failed to Login Please try again.")
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {
      !registering ? 
      <>
          <View style={styles.container}>
            <View style={styles.form}>
              <Text style={styles.title}>Welcome To Pharma Go</Text>
              <TextInput value={username} onChangeText={e=>setusername(e)} style={styles.input_style} placeholder='Username' />
              <TextInput secureTextEntry={true} value={password} onChangeText={e=>setpassword(e)} style={styles.input_style} placeholder='Password' />
              <TouchableOpacity onPress={handdle_login} style={styles.btn_login}><Text style={styles.textwhite}>Login</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setregistering(true)}  style={{ alignSelf : 'center', marginTop : 10 }}><Text>Click Here to Register.</Text></TouchableOpacity>
            </View>
          </View>
      </>
      : 
      <>
            <View style={styles.container}>
            <View style={styles.form}>
              <Text style={styles.title}>Welcome To Pharma Go</Text>
              <TextInput value={username} onChangeText={e=>setusername(e)} style={styles.input_style} placeholder='Username' />
              <TextInput value={FullName} onChangeText={e=>setFullName(e)} style={styles.input_style} placeholder='Full Name' />
              <TextInput secureTextEntry={true} value={password} onChangeText={e=>setpassword(e)} style={styles.input_style} placeholder='Password' />
              <TextInput secureTextEntry={true} value={confirmPassword} onChangeText={e=>setconfirmPassword(e)} style={styles.input_style} placeholder='Confirm Password' />
              <TouchableOpacity onPress={handdle_register} style={styles.btn_login}><Text style={styles.textwhite}>Register</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setregistering(false)}  style={{ alignSelf : 'center', marginTop : 10 }}><Text>Click Here to Login.</Text></TouchableOpacity>
            </View>
          </View>
      </>
      }
  
    </>

  )
}

const styles = StyleSheet.create({
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
    width : "100%",
    margin : 5,
    borderRadius : 10,
  },

  btn_login : { 
    padding : 20,
    width : "100%",
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
  }

})