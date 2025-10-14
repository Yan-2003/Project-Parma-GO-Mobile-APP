import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


export default function NavBar({setButton}) {


  return (
     <View style={styles.navbar}>
           <TouchableOpacity onPress={()=>setButton('Home')}>
            <Image style={styles.icon} source={require('../assets/imgs/home.png')} />
           </TouchableOpacity>

           <TouchableOpacity onPress={()=>setButton('Scan')}>
            <Image style={styles.icon} source={require('../assets/imgs/scan.png')} />
           </TouchableOpacity>
           
           <TouchableOpacity onPress={()=>setButton('Map')}>
            <Image style={styles.icon} source={require('../assets/imgs/map.png')} />
           </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
    navbar : {
        width : '100%',
        backgroundColor : 'rgb(161, 52, 235)',
        height : '10%',
        flexDirection : 'row',
        justifyContent : 'space-around',
        padding : 20,
    },

    icon : {
        width : 34,
        height: 34,
    }

})




