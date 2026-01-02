import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import {API_URL} from '@env'

export default function AddPharmacyScreen() {

    const [name, setname] = useState();
    const [address, setaddress] = useState();
    const [email, setemail] = useState();
    const [openningHours, setopenningHours] = useState();
    const [contactNumber, setcontactNumber] = useState();
    const [Latitude, setLatitude] = useState();
    const [Longitude, setLongitude] = useState();


    const register_pharmacy =  async () =>{

        try {
        const response = await axios.post( API_URL + "/pharmacy/add_pharmacy", {
            'name' : name,
            'address' : address,
            'email' : email,
            'openning_hours' : openningHours,
            'contact_number' : contactNumber,
            'latitude' : Latitude,
            'longitude' : Longitude
        })
    
        console.log(response)
        if(response.status == 200){
            Alert.alert("Successfully Registered Pharmacy!")
        }else{
          Alert.alert("Unable to register Pharmacy")
        }
        } catch (error) {
            console.log(error)
            Alert.alert("Unable to register Pharmacy")
        }
    }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
        <Text>Register a Pharmacy</Text>
        <View style={styles.form}>
          <TextInput value={name} onChangeText={e => setname(e)} style={styles.input_style} placeholder='Pharmacy Name'  />
          <TextInput value={address} onChangeText={e=> setaddress(e)} style={styles.input_style} placeholder='Pharmacy Address'  />
          <TextInput value={email} onChangeText={e=>setemail(e)} style={styles.input_style} placeholder='Email'  />
          <TextInput value={openningHours} onChangeText={e=>setopenningHours(e)} style={styles.input_style} placeholder='Openning Hours'  />
          <TextInput value={contactNumber} onChangeText={e=>setcontactNumber(e)} style={styles.input_style} placeholder='Contact Number'  />
          <TextInput keyboardType='numeric' value={Latitude} onChangeText={e=>setLatitude(e)} style={styles.input_style} placeholder='Latitude'  />
          <TextInput keyboardType='numeric' value={Longitude} onChangeText={e=>setLongitude(e)} style={styles.input_style} placeholder='Longitude'  />
          <TouchableOpacity onPress={register_pharmacy} style={styles.btn_submit}><Text style={styles.textwhite}>Submit</Text></TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  content : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  },

  form : {
    width : 300,

  },

  input_style : {
    borderWidth : 1,
    borderColor : 'gray',
    padding : 15,
    width : "100%",
    margin : 5,
    borderRadius : 10,
  },

  btn_submit : { 
    padding : 20,
    width : "100%",
    margin : 5,
    borderRadius : 10,
    backgroundColor : 'rgba(168, 97, 219, 1)',
    justifyContent : 'center',
    alignItems : 'center',
  },

  btn_signout : { 
    padding : 20,
    width : "100%",
    margin : 5,
    borderRadius : 10,
    backgroundColor : 'gray',
    justifyContent : 'center',
    alignItems : 'center',
  },

  textwhite : {
    color : 'white'
  },


})