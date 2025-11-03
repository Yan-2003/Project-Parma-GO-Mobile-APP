import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from './components/NavBar';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';
import {API_URL} from '@env'
import LoginScreen from './screens/LoginScreen';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminScreen from './screens/AdminScreen';

function AppContent() {

  const [isScreen, setisScreen] = useState('Home');

  const [isLogIn, setisLogIn] = useState(false);

  const { username } = useContext(AuthContext)



  console.log("READING API END POINT: ", API_URL)



  return (
    <SafeAreaView style={styles.container}>
        {
          isLogIn ? 
          <>
          <View style={styles.body}>
              {
                
                username == 'admin' ? <AdminScreen / >

                :  
                
                <>
                
                  {
                    isScreen == 'Home' ? (<HomeScreen />)
                    :
                    isScreen ==  'Scan' ? (<CameraScreen />)
                    :
                    isScreen == 'Map' ? (<MapScreen />)
                    :
                    <><Text>Loading</Text></>
                  }
                
                
                </>
                

              }

          </View>
            <NavBar Buttun={isScreen} setButton={setisScreen} />
          
          </>

          : <LoginScreen setisLogin={setisLogIn} />
        }
    </SafeAreaView>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent : "space-between"

  },
  body : {
    flex : 1,
  }
});
