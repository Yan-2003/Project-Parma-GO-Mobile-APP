import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/AuthContext'

export default function InventoryScreen({setisLogin}) {

    const {logout} = useContext(AuthContext)

    const handdle_logout = () =>{
        logout()
        setisLogin(false)
    }


  return (
    <SafeAreaView style={styles.contianer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handdle_logout}><Text>Sign out</Text></TouchableOpacity>
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

    }


})