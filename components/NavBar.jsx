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
        width : '90%',
        backgroundColor : 'rgb(161, 52, 235)',
        height : 80,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        padding : 20,
        borderRadius: 50,
        margin : 10,   
        position : 'absolute',
        bottom : 0,     
    },

    icon : {
        width : 34,
        height: 34,
    }

})




