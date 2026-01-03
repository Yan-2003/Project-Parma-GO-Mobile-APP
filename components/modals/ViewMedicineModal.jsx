import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {API_URL} from '@env';
import * as Location from 'expo-location'

export default function ViewMedicineModal({setisMedModal , isMedModal, medID, setisScreen, setRouteCoords }) {

  const [Medicine, setMedicine] = useState();

  const [Pharmacies, setPharmacies] = useState([]);

  const [isLoading, setisLoading] = useState(false); 

  const [userLocation, setuserLocation] = useState(null);


  const getUserLocation = async () =>{
    let {status} = await Location.requestForegroundPermissionsAsync()
    if(status !== 'granted'){
      alert('Permission to access location was denied')
      return
    }

    let location = await Location.getCurrentPositionAsync({})
    setuserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // Earth radius in KM

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // distance in KM
  };


  const getMedByID = async () => {

    try {
      
      const med = await axios.get(API_URL + '/medicine/get_medby_id/' + medID)
      setMedicine(med.data[0])
      getPharmacies(med.data[0].name)
      setisLoading(false)

      } catch (error) {
          console.log(error)
      }

  }

  const getPharmacies = async (name) =>{
    try {
     const response  = await axios.get(API_URL + '/medicine/get_meds_pharma/' +  name)

     if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      console.log("❌ User location missing:", userLocation);
      return;
    }

     let data = response.data
     console.log(response.data)

      //sorting algorithm

      if(userLocation){
        data = data.map(p =>{
          const lat  = parseFloat(p.latitude)
          const lon = parseFloat(p.longitude)


          return {
            ...p,
            latitude : lat,
            longitude : lon,
            distance : userLocation ? calculateDistance(userLocation.latitude , userLocation.longitude, lat, lon) : null
          }
        })

        data.sort((a, b)=> a.distance - b. distance)
      }

      console.log("sorted data: " , data)
     setPharmacies(data)


    } catch (error) {
      console.log(error)
    }
  }


  const gotoPharmacy = async (lat , lon) =>{

    try { 
      const start = `${userLocation.longitude},${userLocation.latitude}`;
      const end = `${lon},${lat}`;
      const response = await fetch(
       `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
      );
      const data = await response.json(); 
      console.log("fetching data from routing: " , data)

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude,
        }));
        setRouteCoords(coords);
      } else {
        Alert.alert("No Route Found", "Could not find a route between points.");
      }
    } catch (error) {
        console.error("Error fetching route:", error);
        Alert.alert("Error", "Failed to fetch route data.");
    }
    setisMedModal(false)
    setisScreen('Map')
  }

  useEffect(() => {
    setisLoading(true)
    getUserLocation()
    if (isMedModal) getMedByID()
  
    return () => {
      
    }
  }, [isMedModal]);

  return (
    <Modal
        visible={isMedModal}
        transparent={true}
        animationType='fade'
        onRequestClose={()=> setisMedModal(false)}
    >
    <View style={styles.overlay}>
        <View style={styles.modal_container}>
            <View style={styles.modal_header}>
                <Text style={{ fontSize : 15, fontWeight : 'bold' }}>View Medicine</Text>
            </View>
            <View style={styles.display_body}>
              {
                !isLoading ? (
                  <>
                    <Text style={{ fontSize : 20, fontWeight : 'bold', marginBottom : 10  }}>{Medicine?.name}</Text>
                    <Text>Description: {Medicine?.description}</Text>
                    <Text>Brand: {Medicine?.brand}</Text>
                    <Text>Dosage: {Medicine?.dosage_form}</Text>
                    <Text>Strength: {Medicine?.strength}</Text>
                    <Text>Price: <Text style={{ fontWeight : 'bold' }}>₱{Medicine?.price}</Text></Text>
                    <View style={{ marginTop : 20 }}>
                      <Text style={{ fontSize : 15 , fontWeight : 'bold' }}>Available Stores</Text>
                      <ScrollView style={{ height : 200 }}>
                        {
                          !isLoading ? 
                          (
                            Pharmacies.map((pharmacies, index)=>{
                              
                                return (
                                  <TouchableOpacity onPress={()=>gotoPharmacy(pharmacies.latitude , pharmacies.longitude)} style={styles.pharma_avail} key={index}>
                                      <Text>{pharmacies.name}</Text>
                                      <Text style={styles.km_tag}>{pharmacies.distance.toFixed(2)} KM <Text style ={{ fontSize : 10 , fontWeight : 'regular'}}>away</Text></Text>
                                  </TouchableOpacity>
                                )
                            })
                          )
                          : null
                        }
                      </ScrollView>
                    </View>
                  </>
                  )
                : null
              }
            </View>
            <View style={styles.close_btn_cotainer} >
                <TouchableOpacity onPress={()=>setisMedModal(false)} style={styles.close_btn}><Text style={{ color : 'white' }}>Close</Text></TouchableOpacity>
            </View>
        </View>
    </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modal_container : { 
        padding : 10,
        borderRadius : 10,
        alignSelf :'center',
        width : '80%',
        height : 500,
        backgroundColor : 'white',
        zIndex : 100,
        flexDirection : 'column',
        justifyContent : 'space-between',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
  },

  pharma_avail : { 
    marginTop : 10,
    marginBottom : 1,
    padding : 20, 
    backgroundColor : 'rgba(171, 171, 171, 1)', 
    borderRadius : 10, 
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },

  close_btn : {
    backgroundColor: 'rgb(161, 52, 235)',
    padding : 10,
    borderRadius : 10,
  },

  close_btn_cotainer : {
    width : '100%',
    alignItems : 'center'
  },

  modal_header  : {
    borderBottomWidth : 1,
    borderColor : 'gray',
    paddingTop : 10,
    paddingBottom : 10,
  },

  display_body  :{
    flex : 1, 
    margin : 10,

  },

  km_tag  : {
    backgroundColor: 'rgb(161, 52, 235)',
    color : 'white',
    padding : 10,
    borderRadius : 10,
    fontWeight : 'bold'
  },
    

})