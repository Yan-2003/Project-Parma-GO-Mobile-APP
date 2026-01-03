import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import {API_URL} from '@env'
import ActionButtons from '../../components/ActionButtons'
import DropDown from '../../components/DropDown'

export default function InventoryScreen({setisLogin}) {

    const {logout} = useContext(AuthContext)

    const [medicine, setmedicine] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [Pharmacies, setPharmacies] = useState([{name : "Clear" , id : null}]);
    const [PharmacieID, setPharmacieID] = useState(null);

    const handdle_logout = () =>{
        logout()
        setisLogin(false)
    }

    const get_all_medicine = async () =>{
      setisLoading(true)
      try {
        const response = await axios.get(API_URL + '/medicine/get_all_medicine')
        setmedicine(response.data)
        setisLoading(false)
      } catch (error) {
        console.log(error)
        setisLoading(false)
      }
    }

    const get_all_medicine_filter = async (id) =>{
      setisLoading(true)
      try {
        const response = await axios.get(API_URL + '/medicine/get_all_medicine/' + id)
        setmedicine(response.data)
        setisLoading(false)
      } catch (error) {
        console.log(error)
        setisLoading(false)
      }
    }

    const get_all_pharma = async () =>{
      setisLoading(true)
      try {
          const response = await axios.get(API_URL + "/pharmacy/get_pharmacies")
          setPharmacies(prev => [...prev, ...response.data])
          console.log("all pharmacies: ", Pharmacies)
          setisLoading(false)
      } catch (error) {
          console.log(error)
          setisLoading(false)
      }

    }

    useEffect(() => {
      get_all_medicine()
      get_all_pharma()
    
      return () => {
        
      }
    }, []);


    useEffect(() => {
      if(PharmacieID != null){
        get_all_medicine_filter(PharmacieID)
      }
    
      return () => {
        
      }
    }, [PharmacieID]);


  return (
    <SafeAreaView style={styles.contianer}>
      <View style={styles.header}>
        <Text style={{ color : 'white', fontWeight: 'bold' }}>Admin Panel</Text>
        <TouchableOpacity style={styles.logout} onPress={handdle_logout}><Text>Sign out</Text></TouchableOpacity>
      </View>
      <View style={styles.body}>
        <DropDown data={Pharmacies} setvalue={setPharmacieID} />
        <Text style={{ fontSize : 20, fontWeight : 'bold', marginBottom : 10, }}>Medicine List</Text>
        <ScrollView>
          {
            isLoading ? <Text>Loading.....</Text>
            :
            medicine.map((item , index)=>{
              return (
                <View key={index} style={styles.med_item}>
                  <Text>{item.name}</Text>
                  <ActionButtons data={item} refresh_data={get_all_medicine} />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    contianer : {
        flex : 1,
        alignItems : 'center'
    },

    header  : {
        width : '90%',
        backgroundColor : 'rgba(168, 97, 219, 1)',
        height : 60,
        borderRadius :10,
        padding : 10,
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between'
    },

    body : {
      marginTop : 20,
      width : '90%',
      flex : 1,
      marginBottom : 60
    },

    med_item : { 
      padding : 10,
      borderWidth : 1,
      marginBottom : 5,
      borderRadius : 10,
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      borderColor : 'gray',
    }, 

    logout : {
      padding : 5,
      backgroundColor : 'white',
      borderRadius : 5,
    },


})