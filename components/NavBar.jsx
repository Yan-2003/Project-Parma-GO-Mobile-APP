import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'


export default function NavBar({Buttun , setButton}) {


  return (
     <View style={styles.navbar}>
           <TouchableOpacity style={Buttun == "Home" ? styles.setButton : styles.Button } onPress={()=>setButton('Home')}>
            <Image style={styles.icon} source={require('../assets/imgs/home.png')} />
           </TouchableOpacity>

           <TouchableOpacity style={Buttun == "Scan" ? styles.setButton : styles.Button } onPress={()=>setButton('Scan')}>
            <Image style={styles.icon} source={require('../assets/imgs/scan.png')} />
           </TouchableOpacity>
           
           <TouchableOpacity style={Buttun == "Map" ? styles.setButton : styles.Button } onPress={()=>setButton('Map')}>
            <Image style={styles.icon} source={require('../assets/imgs/map.png')} />
           </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
    navbar : {
        width : '80%',
        alignSelf : 'center',
        backgroundColor : 'rgb(161, 52, 235)',
        height : 70,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        padding : 20,
        borderRadius: 50,
        margin : 20,   
        position : 'absolute',
        bottom : 0,     
    },

    icon : {
        width : 25,
        height: 25,
    },

    Button : {
        padding : 10,
    },

    setButton : {
        backgroundColor : 'rgba(168, 97, 219, 1)',
        padding : 10,
        borderRadius : 10,
    }

})




