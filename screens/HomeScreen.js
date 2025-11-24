import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import NavBar from '../components/NavBar'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {

  const [isProfile, setisProfile] = useState(false);


  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.header}>
          <View>
            <Text style={{ color : 'white', fontWeight :'bold', fontSize : 20 }} >Pharma Go</Text>
            <Text style={{ color : 'white' , fontSize : 10, marginLeft : 10 }}>v0.0.1 Prototype 1 </Text>
          </View>
          <View>
            <TouchableOpacity onPress={()=>setisProfile(true)}>
              <Image style={{ width : 34, height : 34 }} source={require("../assets/imgs/account.png")} />
            </TouchableOpacity>
          </View>
      </View>
      <View style={styles.body}>
        {
          !isProfile ?
          <Text>You are in Home</Text>
          :
          <View style={styles.profile_content}>
            <Image style={{ width : 250, height : 250}} source={require("../assets/imgs/bussiness-man.png")} />
            <Text style={{ fontSize : 20 }}>Julliane J. Tampus</Text>
            <View style={{ gap : 10 }}>
              <TouchableOpacity onPress={()=>setisProfile(false)} ><Text style={styles.back_button}>Back to Home</Text></TouchableOpacity>
              <TouchableOpacity ><Text style={styles.sign_out}>Sign Out</Text></TouchableOpacity>
            </View>
          </View>
        }
      </View>
 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },


  body  : { 
    flex : 1, 
    justifyContent : 'center',
    alignItems : 'center'


  },

  header : {
    padding : 20,
    width : '90%',
    alignSelf : 'center',
    borderRadius : 20,
    backgroundColor : ' rgb(161, 52, 235)',
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },

  back_button : {
    padding : 10,
    color : 'white',
    borderRadius : 10,
    backgroundColor: 'rgb(161, 52, 235)',
    textAlign : 'center'
  },

  sign_out : {
    padding : 10,
    color : 'white',
    borderRadius : 10,
    backgroundColor: 'rgba(235, 52, 52, 1)',
    textAlign : 'center'
  },

  profile_content : {
    alignItems : 'center',
    gap : 20,
  },
  
})