import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios';
import {API_URL} from '@env'
import Card from '../components/Card';

export default function HomeScreen() {

  const [isProfile, setisProfile] = useState(false);
  const [countMed, setcountMed] = useState(0);
  const [countPharma, setcountPharma] = useState(0);
  const [openPharma, setopenPharma] = useState(0);

  const get_all_med_count = async () =>{
    try {
      const request = await axios.get(API_URL + '/dashboard/get_all_med_count')
      console.log(request.data)
      return setcountMed(request.data[0].count_med)
    } catch (error) {
      console.log(error)
    }
  }


    const get_all_pharma_count = async () =>{
    try {
      const request = await axios.get(API_URL + '/dashboard/get_all_pharma_count')
      console.log(request.data)
      return setcountPharma(request.data[0].count_pharma)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    get_all_med_count()
    get_all_pharma_count()
  
    return () => {
      
    }
  }, []);


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
          <ScrollView style={{ flex : 1 , padding : 10 , width : '95%' , marginTop : 20}}>
            <View style={{ width : '100%' , flexDirection : 'row', gap : 10 , justifyContent : 'space-between' , marginBottom : 10}}>
              <Card title={"Medicine Available "} data={countMed} size='65%' color='rgb(255, 153, 89)' textColor='white' /> 
              <Card title={"Pharmacies "} data={countPharma} size='30%' color='rgb(86, 86, 214)' textColor='white'/> 
            </View>

            <View style={{ width : '100%' , flexDirection : 'row', gap : 10 , justifyContent : 'space-between' , marginBottom : 10}}>
              <Card title={"Still Open Pharamcies "} data={openPharma} size='100%' /> 
            </View>
            <View style={{ gap : 10 }}>
              <Text style={{ fontSize : 15 , fontWeight : 'bold' }}>Recent Pharmacy</Text>
              <MapView style={{ width : '100%' , height : 200 , borderRadius : 20}} /> 
            </View>
          </ScrollView>
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