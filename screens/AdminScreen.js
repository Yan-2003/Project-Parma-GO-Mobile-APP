import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'

export default function AdminScreen() {

    const [name, setname] = useState();
    const [address, setaddress] = useState();
    const [email, setemail] = useState();
    const [openningHours, setopenningHours] = useState();
    const [contactNumber, setcontactNumber] = useState();
    const [Latitude, setLatitude] = useState();
    const [Longitude, setLongitude] = useState();


    const register_pharmacy =  async () =>{

        try {
        const response = await axios.post("http://localhost:8000/pharmacy/add_pharmacy", {
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
            alert("Successfully Registered Pharmacy!")
        }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <View style={styles.content}>
      <Text>Register a Pharmacy</Text>
      <View style={styles.form}>
        <TextInput style={styles.input_style} placeholder='Pharmacy Name'  />
        <TextInput style={styles.input_style} placeholder='Pharmacy Address'  />
        <TextInput style={styles.input_style} placeholder='Email'  />
        <TextInput style={styles.input_style} placeholder='Openning Hours'  />
        <TextInput style={styles.input_style} placeholder='Contact Number'  />
        <TextInput style={styles.input_style} placeholder='Latitude'  />
        <TextInput style={styles.input_style} placeholder='Longitude'  />
        <TouchableOpacity style={styles.btn_submit}><Text style={styles.textwhite}>Submit</Text></TouchableOpacity>
      </View>
    </View>
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

  textwhite : {
    color : 'white'
  },


})