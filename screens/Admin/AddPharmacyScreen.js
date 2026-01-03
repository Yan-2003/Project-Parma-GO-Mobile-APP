import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {API_URL} from '@env'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function AddPharmacyScreen() {

    const [name, setname] = useState();
    const [address, setaddress] = useState();
    const [email, setemail] = useState();
    const [openningHours, setopenningHours] = useState();
    const [contactNumber, setcontactNumber] = useState();
    const [Latitude, setLatitude] = useState();
    const [Longitude, setLongitude] = useState();
    const [opentime, setopentime] = useState(new Date());
    const [closetime, setclosetime] = useState(new Date());

    const [showOpenning, setshowOpenning] = useState(false);
    const [showClosing, setshowClosing] = useState(false);


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


    function formatTime(date = new Date()) {
      let hours = date.getHours();
      let minutes = date.getMinutes();

      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      minutes = minutes.toString().padStart(2, "0");

      return `${hours}:${minutes}${ampm}`;
    }


    const onChangeOpening = (event , selectTime) =>{
      setshowOpenning(false)
      if(selectTime){
        setopentime(selectTime)
      }
    }

    const onChangeClosing = (event , selectTime) =>{
      setshowOpenning(false)
      if(selectTime){
        setclosetime(selectTime)
      }
    }

    function formatTimeRangeIntl(start, end) {
      const fmt = (d) =>
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }).replace(" ", "");

      return `${fmt(start)}-${fmt(end)}`;
    }

    useEffect(() => {
      setopenningHours(formatTimeRangeIntl(opentime , closetime))
      
      return () => {
        
      }
    }, [opentime, closetime]);




  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
        <Text>Register a Pharmacy</Text>
        <View style={styles.form}>
          <TextInput value={name} onChangeText={e => setname(e)} style={styles.input_style} placeholder='Pharmacy Name'  />
          <TextInput value={address} onChangeText={e=> setaddress(e)} style={styles.input_style} placeholder='Pharmacy Address'  />
          <TextInput value={email} onChangeText={e=>setemail(e)} style={styles.input_style} placeholder='Email'  />
          <TouchableOpacity
              style={styles.input_style}
              onPress={() => setshowOpenning(true)}
          >
              <Text>Open Time: {formatTime(opentime)}</Text>
          </TouchableOpacity>
          {
            showOpenning ? 
            <DateTimePicker
              value={opentime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeOpening}
            />
            :null
          }
          <TouchableOpacity
              style={styles.input_style}
              onPress={() => setshowClosing(true)}
          >
              <Text>Close Time: {formatTime(closetime)}</Text>
          </TouchableOpacity>
          {
            showClosing ? 
            <DateTimePicker
              value={closetime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeClosing}
            />
            :null
          }
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