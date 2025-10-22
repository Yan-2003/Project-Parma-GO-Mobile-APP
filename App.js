import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavBar from './components/NavBar';
import HomeScreen from './screens/HomeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';



export default function App() {

  const [isScreen, setisScreen] = useState('Home');





  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
          {
            isScreen == 'Home' ? (<HomeScreen />)
            :
            isScreen ==  'Scan' ? (<CameraScreen />)
            :
            isScreen == 'Map' ? (<MapScreen />)
            :
            <><Text>Loading</Text></>
            
          }
      </View>
        <NavBar Buttun={isScreen} setButton={setisScreen} />
    </SafeAreaView>
  );
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
