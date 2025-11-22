import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { API_URL} from '@env'

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedText, setCapturedText] = useState('');
  const [isSearchMed, setisSearchMed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch {
        setHasPermission(false);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setLoading(true);

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const localUri = photo.uri;

      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const apiUrl = `${API_URL}/ocr`;

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCapturedText(response.data.text || 'No text detected.');
    } catch (error) {
      console.error(error);
      setCapturedText('Error processing image.');
    } finally {
      setLoading(false);
      setisSearchMed(true);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(161, 52, 235)" />
          <Text>Processing image...</Text>
        </View>
      ) : !isSearchMed ? (
        <>
          <View style={styles.camera_container}>
            <Image style={styles.scan_animation} source={require('../assets/Scan Matrix.gif')} />
            <CameraView ref={cameraRef} style={styles.camera} />
          </View>
          <View style={styles.buttonContainer}>

            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <Image style={styles.captureButtonLogo} source={require('../assets/imgs/camera.png')}  />
            </TouchableOpacity>
          </View>
        </>
      ) : 
      
      <>
        <View style={styles.searchMedContainer} >
          <View style={styles.searcMedContent}>
            <ScrollView style={styles.textContainer}>
              <Text style={styles.textOutput}>{capturedText}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.search_med_btn}><Text style={styles.text_light}>Search Scan Text</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.searched_meds_container} >
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(161, 52, 235)" />
              <Text>Searching Medicine....</Text>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={()=>setisSearchMed(false)}  style={styles.scan_again_btn} ><Text style={styles.text_light} >Scan Again</Text></TouchableOpacity>
        </View>
      </>      
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent : 'center',
    alignItems : 'center',
  },
  centered: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: { 
    backgroundColor: 'rgb(161, 52, 235)',
    padding: 15,
    borderRadius: 50,
    margin : 40,
  },
  captureButtonLogo : {
    width : 34,
    height : 34,
  },
  textContainer: { 
    padding: 10, 
    maxHeight: 100,
    borderWidth : 1,
    borderRadius : 10,
  },
  textOutput: { 
    fontSize: 16, 
    color: '#333' 
  },
  loadingContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  camera_container : {
    width: 350,
    height: 400,
    borderColor: 'rgb(161, 52, 235)',
    borderWidth: 2,
  },

  camera: {  
    width : '100%',
    height : '100%',  
  },
  scan_animation : {
    width : '100%',
    height : '100%',
    position : "absolute",
    zIndex : 99999,
    backgroundColor : 'rgba(0, 0, 0, 0.56)'
  },

  scan_again_btn : {
    position : 'absolute',
    width : '100%',
    padding : 10,
    borderRadius : 20,
    backgroundColor : 'rgb(161, 52, 235)',
    bottom : 100,
    alignItems : 'center',
    justifyContent : 'center'
  },
  
  text_light : {
    color : 'white'
  },

  searchMedContainer : {
    flex : 1,
    paddingTop: 20,
    width : 300,
  },
  search_med_btn : {
    backgroundColor : 'rgb(161, 52, 235)',
    padding : 10,
    marginTop : 10,
    borderRadius : 10,
    justifyContent : 'center',
    alignItems : 'center'
  },
  searcMedContent : {
    height : 150,
  },
  searched_meds_container : {
    padding : 5,
    borderWidth : 1,
    borderColor : 'black',
    borderRadius : 10,
    maxHeight : " 60%",
  }
});
  