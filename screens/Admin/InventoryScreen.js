import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import {API_URL} from '@env'

export default function InventoryScreen({setisLogin}) {

    const {logout} = useContext(AuthContext)

    const [medicine, setmedicine] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const handdle_logout = () =>{
        logout()
        setisLogin(false)
    }

    const get_all_medicine = async () =>{
      setisLoading(true)
      try {
        const response = await axios.get(API_URL + '/medicine/get_all_medicine')
        console.log(response.data)
        setmedicine(response.data)
        setisLoading(false)
      } catch (error) {
        console.log(error)
        setisLoading(false)
      }
    }

    useEffect(() => {
      get_all_medicine()
    
      return () => {
        
      }
    }, []);


  return (
    <SafeAreaView style={styles.contianer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handdle_logout}><Text>Sign out</Text></TouchableOpacity>
      </View>
      <View style={styles.body}>
        <ScrollView>
          {
            medicine.map((item , index)=>{
              return (
                <View key={index}>
                  <Text>{item.name}</Text>
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
        padding : 10

    },

    body : {
      flex : 1,
      marginBottom : 60
    }


})