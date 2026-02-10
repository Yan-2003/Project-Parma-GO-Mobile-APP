import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios';
import {API_URL} from '@env'
import Card from '../components/Card';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';

export default function HomeScreen({setisLogin}) {

  const {full_name, logout} = useContext(AuthContext)


  const [isProfile, setisProfile] = useState(false);
  const [countMed, setcountMed] = useState(0);
  const [countPharma, setcountPharma] = useState(0);
  const [openPharma, setopenPharma] = useState(0);
  const [userLocation, setuserLocation] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [nearestPharmacy, setNearestPharmacy] = useState(null);


  const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // meters
  };


  const nearest_pharmacy = async () => {
    if (!userLocation) return;

    setisLoading(true);
    try {
      const result = await axios.get(`${API_URL}/pharmacy/get_pharmacies`);
      const pharmacies = result.data;

      const withDistance = pharmacies.map(pharma => ({
        ...pharma,
        distance: getDistance(
          userLocation.latitude,
          userLocation.longitude,
          pharma.latitude,
          pharma.longitude
        )
      }));

      // Sort by nearest
      withDistance.sort((a, b) => a.distance - b.distance);

      // Nearest pharmacy
      console.log("nearest pharmacy", withDistance[0])

      setNearestPharmacy(withDistance[0]);

    } catch (error) {
      console.log('Error fetching pharmacies:', error);
    } finally {
      setisLoading(false);
    }
  };

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

  const get_all_open_pharma_count = async () =>{
    try {
      const request = await axios.get(API_URL + '/dashboard/get_all_open_pharma_count')
      console.log(request.data)
      return setopenPharma(request.data[0].open_pharmacies)
    } catch (error) {
      console.log(error)
    }
  }

  const handdle_logout = async () =>{
    await logout()
    setisLogin(false)
  }

  useEffect(() => {
    get_all_med_count()
    get_all_pharma_count()
    get_all_open_pharma_count()
    return () => {
      
    }
  }, []);

  useEffect(() => {
      (async () => {
        setisLoading(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert('Permission Denied', 'Please enable location permissions in settings.');
          return;
        }
  
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setuserLocation(currentLocation.coords);
        setisLoading(false)
      })();
    }, []);


  useEffect(() => {
      if(userLocation) {
        nearest_pharmacy()
      }  
    return () => {
      
    }
  }, [userLocation]);

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
              <Card title={"Medicine Available 💊"} data={countMed} size='65%' color='rgb(255, 153, 89)' textColor='white' /> 
              <Card title={"Pharmacies"} data={countPharma} size='30%' color='rgb(86, 86, 214)' textColor='white'/> 
            </View>

            <View style={{ width : '100%' , flexDirection : 'row', gap : 10 , justifyContent : 'space-between' , marginBottom : 10}}>
              <Card title={"Still Open Pharamcies 👨🏻‍⚕️"} data={openPharma} size='100%' color='rgb(240, 132, 198)' /> 
            </View>
            <View style={{ gap : 10, marginTop : 10 }}>
              <Text style={{ fontSize : 15 , fontWeight : 'bold' }}>Nearest Pharmacy In Your Location</Text>
             {/*  {
                isLoading || !nearestPharmacy ? <Text>Loading Map....</Text>
                :
                <MapView
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  initialRegion={{
                    latitude: nearestPharmacy.latitude,
                    longitude: nearestPharmacy.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  style={{ width : '100%' , height : 200 , borderRadius : 20}}>
                    <Marker
                        coordinate={{
                          latitude: parseFloat(nearestPharmacy.latitude),
                          longitude: parseFloat(nearestPharmacy.longitude),
                        }}
                        title={nearestPharmacy.name}
                        description={nearestPharmacy.address || 'Pharmacy location'}
                      >
                      <Image
                        source={require('../assets/imgs/drugstore.png')}
                        style={{ width: 40, height: 40 }} 
                        resizeMode="contain"
                      />
                    </Marker>
                  </MapView> 
                  } */}
            </View>
          </ScrollView>
          :
          <View style={styles.profile_content}>
            <Image style={{ width : 250, height : 250}} source={require("../assets/imgs/bussiness-man.png")} />
            <Text style={{ fontSize : 20 }}>{full_name || 'Bypass Access'}</Text>
            <View style={{ gap : 10 }}>
              <TouchableOpacity onPress={()=>setisProfile(false)} ><Text style={styles.back_button}>Back to Home</Text></TouchableOpacity>
              <TouchableOpacity onPress={handdle_logout} ><Text style={styles.sign_out}>Sign Out</Text></TouchableOpacity>
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