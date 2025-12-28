import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, TextInput, TouchableOpacity, Image, ScrollView, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

import axios from 'axios';
import { API_URL } from '@env'
export default function MapScreen({location , setLocation , routeCoords , setRouteCoords}) {
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [Pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [SearchBar, setSearchBar] = useState('');
  const [medicines, setmedicines] = useState([]);
  const [displayMeds, setdisplayMeds] = useState(false);
  const [isLoadingDisplayMeds, setisLoadingDisplayMeds] = useState(false);
  const [displayTitle, setdisplayTitle] = useState('');
  


  const get_all_pharmacies = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`${API_URL}/pharmacy/get_pharmacies`);
      console.log(result.data)
      setPharmacies(result.data);
    } catch (error) {
      console.log('Error fetching pharmacies:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const display_all_medicine = async (pharmacy) =>{
    setdisplayMeds(true)
    setisLoadingDisplayMeds(true)
    try {
        const start = `${location.longitude},${location.latitude}`;
        const end = `${pharmacy.longitude},${pharmacy.latitude}`;
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

          console.log("SET ROUTE: " , routeCoords)

          setRouteCoords(coords);
        } else {
          Alert.alert("No Route Found", "Could not find a route between points.");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        Alert.alert("Error", "Failed to fetch route data.");
      }

    try { 

      const result = await axios.get(`${API_URL}/medicine/get_pharmacy_medicine/${pharmacy.id}`)
      console.log(result.data)
      setmedicines(result.data)
      setisLoadingDisplayMeds(false)
    } catch (error) {
      console.log(error)
      setisLoadingDisplayMeds(false)
    }



  }

  useEffect(() => {
    get_all_pharmacies();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Please enable location permissions in settings.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {
        displayMeds  ? 
          <View style={styles.container_med} >
            <View style={styles.med_top_bar}>
              <Text style={styles.med_title}>{displayTitle}</Text>
              <TouchableOpacity style={styles.close_btn} onPress={()=>setdisplayMeds(false)}><Text>x</Text></TouchableOpacity>
            </View>
            <ScrollView style={styles.meds_list}>
                {
                  !isLoadingDisplayMeds ? 
                    medicines.map((med, index)=>{
                      return (
                        <TouchableOpacity style={styles.med_item} key={index}> 
                          <Text>{med.name}</Text>
                          <Text>{med.stock}</Text>
                          <Text>₱{med.price}</Text>
                        </TouchableOpacity>
                      ) 
                    })

                  : <View><Text>Loading......</Text></View>
                }
            </ScrollView>
          </View>

        : <></>
      }
      {
        !isLoading ? 
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={false}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
              {!isLoading ?
                Pharmacies.map((pharmacy, index) =>
                (
                  <Marker
                  onPress={()=>{
                    console.log(pharmacy.id)
                    display_all_medicine(pharmacy)
                    setdisplayTitle(pharmacy.name)
                  }}
                    key={index}
                    coordinate={{
                      latitude: parseFloat(pharmacy.latitude),
                      longitude: parseFloat(pharmacy.longitude),
                    }}
                    title={pharmacy.name}
                    description={pharmacy.address || 'Pharmacy location'}
                  >
                    <Image
                      source={require('../assets/imgs/drugstore.png')}
                      style={{ width: 30, height: 30 }} 
                      resizeMode="contain"
                    />
                  </Marker>
                )) : <></>
              }

            <Polyline coordinates={routeCoords} strokeColor='red' strokeWidth={5} /> 
            <View style={styles.search_bar}>
              <TextInput
                value={SearchBar}
                onChangeText={text => setSearchBar(text)}
                style={styles.search_bar_input}
                placeholder="Search for Pharmacies"
              />
              <TouchableOpacity style={styles.search_btn}>
                <Image style={styles.icon} source={require('../assets/imgs/search.png')} />
              </TouchableOpacity>
            </View> 
          </MapView>

            : <></>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: { 
    width: 400,
    height: 900,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search_bar: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: '10%',
    alignSelf: 'center',
    height: 45,
    width: '90%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 16,
    elevation: 5,
    zIndex: 9999,
  },
  search_bar_input: {
    width: '90%',
  },
  icon: {
    width: 24,
    height: 24,
  },
  search_btn: {
    padding: 10,
  },

  container_med : {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    width : '80%',
    height : 300,
    position : 'absolute',
    alignSelf : 'center',
    top : 100,
    borderRadius : 20,
    padding : 10,
    zIndex : 100000000000,
  },


  close_btn : {
    backgroundColor : 'gray',
    width : 20,
    height : 20,
    borderRadius : 10,
    justifyContent : 'center',
    alignItems : 'center',
    alignSelf : 'flex-end'
  },

  med_top_bar : {
    alignItems : 'center',
    flexDirection : 'row',
    width : '100%',
    justifyContent : 'space-between',
    marginBottom : 20,
  },

  med_title : {
    fontSize : 20,
    fontWeight : 700,
  },

  med_item : { 
    width : "95%",
    alignSelf : 'center',
    justifyContent : 'space-between',
    alignItems : 'center',
    padding : 10,
    backgroundColor : 'rgba(212, 212, 212, 1)',
    margin : 1,
    flexDirection : 'row',
    borderRadius : 10,
  }

});
