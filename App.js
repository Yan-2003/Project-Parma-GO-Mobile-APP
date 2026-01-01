import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from './components/NavBar';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useEffect, useState } from 'react';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';
import {API_URL} from '@env'
import LoginScreen from './screens/LoginScreen';
import { AuthContext, AuthProvider } from './context/AuthContext';
//import AdminScreen from './screens/AdminScreen';
import AddPharmacyScreen from './screens/Admin/AddPharmacyScreen';
import InventoryScreen from './screens/Admin/InventoryScreen';
import AddMedicineScreen from './screens/Admin/AddMedicineScreen';




function AppContent() { 

  const [isScreen, setisScreen] = useState('Home');

  const [isLogIn, setisLogIn] = useState(false);

  const { username, user_role } = useContext(AuthContext)

  const [routeCoords, setRouteCoords] = useState([]);

  const [location, setLocation] = useState(null);



  console.log("READING API END POINT: ", API_URL)

  useEffect(() => {
    if(isScreen !== 'Map'){
      setRouteCoords([])
    }
  
    return () => {
      
    }
  }, [isScreen]);

  return (
    <SafeAreaProvider style={styles.container}>
        {
          isLogIn ? 
          <>
          <View style={styles.body}>
              {
                  isScreen == 'Home' ? (
                      username == 'admin' ? <InventoryScreen setisLogin={(setisLogIn)} />
                      : <HomeScreen setisLogin={setisLogIn} />
                  )
                  :
                  isScreen ==  'Scan' ? (<CameraScreen setisScreen={setisScreen} setRouteCoords={setRouteCoords} />)
                  :
                  isScreen == 'Map' ? (<MapScreen location={location} setLocation={setLocation} routeCoords={routeCoords} setRouteCoords={setRouteCoords} />)
                  :
                  isScreen == "AddPharmacy" ? (<AddPharmacyScreen />)
                  :
                  isScreen == "AddMedicine" ? (<AddMedicineScreen />)
                  :
                  <View style={{ flex : 1 , justifyContent : 'center', alignItems : 'center' }}><Text>Error While Rendering Content</Text></View>
              }
          </View>
            <NavBar Buttun={isScreen} setButton={setisScreen} userRole={user_role} />
          </>

          : <LoginScreen setisLogin={setisLogIn} />
        }
    </SafeAreaProvider>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}



const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: '#fff',
  },
  body : {
    flex : 1,
  }
});
