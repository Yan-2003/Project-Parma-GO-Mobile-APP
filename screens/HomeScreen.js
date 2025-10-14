import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import NavBar from '../components/NavBar'

export default function HomeScreen() {
  return (
    <View style={styles.container} >
      <Text>You are in Home</Text>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  
})