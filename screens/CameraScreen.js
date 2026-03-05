import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import { API_URL } from '@env'
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewMedicineModal from '../components/modals/ViewMedicineModal';
import { AuthContext } from '../context/AuthContext';
import SearchHistoryModal from '../components/modals/SearchHistoryModal';

/* ---------------- AXIOS INSTANCE WITH LONG TIMEOUT ---------------- */
const api = axios.create({
  baseURL: API_URL,
  timeout: 180000, // 3 minutes
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function CameraScreen({ setisScreen , setRouteCoords }) {

  const {user_id} = useContext(AuthContext)
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [capturedText, setCapturedText] = useState('');
  const [isSearchMed, setisSearchMed] = useState(false);
  const [meds, setmeds] = useState([]);
  const [isMedModal, setisMedModal] = useState(false);
  const [medsID, setmedsID] = useState();
  const [isSearchModal, setisSearchModal] = useState(false);
  const [photo, setphoto] = useState();

  const add_search_history = async (search_history) =>{
    if((search_history.trim()).length > 0){
      try {
        await api.post('/medicine/add_search_history', {
          user_id : user_id,
          search : search_history
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        });

        setphoto(photoData.uri);
        UploadImageToModel(photoData)

      } catch (error) {
        console.log("Camera Error:", error);
      }
    }
  };

  const UploadImageToModel = async (photo) =>{
    setLoading(true)

    try {

      let Photo = photo
      let localUri = Photo.uri;

      if (previewSize.width && previewSize.height) {

        const overlayW = Math.round(previewSize.width * 0.6);
        const overlayH = Math.round(overlayW * 0.3);
        const overlayLeft = Math.round((previewSize.width - overlayW) / 2);
        const overlayTop = Math.round((previewSize.height - overlayH) / 2);

        const scaleX = Photo.width / previewSize.width;
        const scaleY = Photo.height / previewSize.height;

        const crop = {
          originX: Math.max(0, Math.round(overlayLeft * scaleX)),
          originY: Math.max(0, Math.round(overlayTop * scaleY)),
          width: Math.max(0, Math.round(overlayW * scaleX)),
          height: Math.max(0, Math.round(overlayH * scaleY)),
        };

        try {

          const manipulated = await ImageManipulator.manipulateAsync(
            localUri,
            [{ crop }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
          );

          localUri = manipulated.uri;

        } catch (err) {
          console.log('Image manipulation failed, uploading full photo', err);
        }
      }

      const formData = new FormData();

      formData.append('image', {
        uri: localUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const response = await api.post('/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000
      });
      console.log("OUTPUT: ", response.data)
      if(response.data.text != null){
        setCapturedText(response.data.text || ' ');
        searchMed(response.data.text)
      }else{
        Alert.alert("Please Try to Scan Again")
      }

    } catch (error) {

      console.log(error)
      Alert.alert("OCR Error", error.message)

    } finally {
      setisSearchMed(true);
      setLoading(false);
    }
  }

  const viewMedByItem = (id) =>{
    setisMedModal(true)
    setmedsID(id)
  }

  const searchMed = async (text) => {

    setLoading(true)
    setmeds([])

    try {

      const response = await api.get(
        "/medicine/get_pharmacy_meds/search?input=" + text,
        { timeout: 180000 }
      )

      add_search_history(text)
      setmeds(response.data)

    } catch (error) {

      console.log(error)
      Alert.alert("Search Error", error.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {hasPermission === null ? (
        <View style={styles.centered}>
          <Text>Requesting camera permission...</Text>
        </View>
      ) : hasPermission === false ? (
        <View style={styles.centered}>
          <Text>No access to camera</Text>
        </View>
      ) : (
        <>
          <ViewMedicineModal setisMedModal={setisMedModal} isMedModal={isMedModal} medID={medsID} setisScreen={setisScreen} setRouteCoords={setRouteCoords}/>
          <SearchHistoryModal setshowModal={setisSearchModal} showModal={isSearchModal} setcaptureText={setCapturedText} searchMed={searchMed} />

          <View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(161, 52, 235)" />
                <Text>Processing... please wait</Text>
              </View>
            ) : !isSearchMed ? (

              <>
                <View
                  style={styles.camera_container}
                  onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setPreviewSize({ width, height });
                  }}
                >

                  <Image style={styles.scan_animation} source={require('../assets/Scan Matrix.gif')} />

                  <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing='back'
                    autofocus='on'
                  />

                  {previewSize.width > 0 && (() => {

                    const overlayW = Math.round(previewSize.width * 0.6);
                    const overlayH = Math.round(overlayW * 0.3);
                    const overlayLeft = Math.round((previewSize.width - overlayW) / 2);
                    const overlayTop = Math.round((previewSize.height - overlayH) / 2);

                    return (
                      <>
                        <View style={[styles.overlay,{ top:0,left:0,right:0,height:overlayTop }]} />
                        <View style={[styles.overlay,{ top:overlayTop+overlayH,left:0,right:0,bottom:0 }]} />
                        <View style={[styles.overlay,{ top:overlayTop,left:0,width:overlayLeft,height:overlayH }]} />
                        <View style={[styles.overlay,{ top:overlayTop,left:overlayLeft+overlayW,right:0,height:overlayH }]} />

                        <View
                          style={[
                            styles.cropBox,
                            { width:overlayW,height:overlayH,left:overlayLeft,top:overlayTop }
                          ]}
                        />
                      </>
                    )

                  })()}

                </View>

                <View style={styles.buttonContainer}>

                  <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                    <Image style={styles.captureButtonLogo} source={require('../assets/imgs/camera.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=> setisSearchMed(true)} style={styles.search_med_button_capcutre}>
                    <Text style={styles.text_light}>Search Medicine</Text>
                  </TouchableOpacity>

                </View>
              </>

            ) : (

              <>
                <View style={styles.searchMedContainer}>

                  <View style={styles.searcMedContent}>

                    <View style={{ flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center' }}>
                      <TextInput
                        style={styles.textContainer}
                        value={capturedText}
                        onChangeText={(text)=> setCapturedText(text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />

                      <TouchableOpacity onPress={()=>setisSearchModal(true)}>
                        <Image style={{ width:30,height:30 }} source={require('../assets/imgs/history.png')} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={()=> searchMed(capturedText)} style={styles.search_med_btn}>
                      <Text style={styles.text_light}>Search Scan Text</Text>
                    </TouchableOpacity>

                  </View>

                  <ScrollView style={styles.searched_meds_container}>

                    {loading ? (

                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="rgb(161, 52, 235)" />
                        <Text>Searching Medicine...</Text>
                      </View>

                    ) : meds.map((medicine , index)=>{

                      return(
                        <TouchableOpacity
                          onPress={()=>viewMedByItem(medicine.id)}
                          style={styles.item_medicine}
                          key={index}
                        >

                          <View>

                            <Text style={{ fontSize:15,fontWeight:'bold' }}>{medicine.name}</Text>
                            <Text style={{ fontSize:10 }}>{medicine.strength}</Text>
                            <Text>{medicine.dosage_form}</Text>

                            <Text style={{
                              backgroundColor:'rgb(161, 52, 235)',
                              color:'white',
                              padding:2,
                              borderRadius:5,
                              fontSize : 10,
                            }}>
                              {medicine.pharma_name}
                            </Text>

                          </View>

                          <View style={styles.price}>
                            <Text style={styles.price_text}>₱{medicine.price}</Text>
                          </View>

                        </TouchableOpacity>
                      )
                    })}

                  </ScrollView>

                  <TouchableOpacity onPress={()=>setisSearchMed(false)} style={styles.scan_again_btn}>
                    <Text style={styles.text_light}>Scan Again</Text>
                  </TouchableOpacity>

                </View>
              </>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1,justifyContent:'center',alignItems:'center' },
  centered:{ flex:1,justifyContent:'center',alignItems:'center' },
  buttonContainer:{ justifyContent:'flex-end',alignItems:'center' },

  captureButton:{
    backgroundColor:'rgb(161, 52, 235)',
    padding:15,
    borderRadius:50,
    margin:40,
  },

  captureButtonLogo:{ width:34,height:34 },

  textContainer:{
    width:'90%',
    padding:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:'gray'
  },

  loadingContainer:{ flex:1,alignItems:'center',justifyContent:'center' },

  camera_container:{
    width:350,
    height:400,
    borderColor:'rgb(161, 52, 235)',
    borderWidth:2
  },

  camera:{ width:'100%',height:'100%' },

  scan_animation:{
    width:'100%',
    height:'100%',
    position:'absolute',
    zIndex:99999
  },

  overlay:{
    position:'absolute',
    backgroundColor:'rgba(0,0,0,0.45)'
  },

  cropBox:{
    position:'absolute',
    borderWidth:2,
    borderColor:'rgb(161, 52, 235)',
    borderRadius:8
  },

  scan_again_btn:{
    position:'absolute',
    width:'100%',
    padding:10,
    borderRadius:20,
    backgroundColor:'rgb(161, 52, 235)',
    bottom:100,
    alignItems:'center'
  },

  text_light:{ color:'white' },

  searchMedContainer:{ flex:1,width:340 },

  search_med_btn:{
    backgroundColor:'rgb(161, 52, 235)',
    padding:10,
    marginTop:10,
    borderRadius:10,
    alignItems:'center'
  },

  searcMedContent:{ marginTop:30 },

  searched_meds_container:{
    marginTop:10,
    borderRadius:10,
    maxHeight:'65%'
  },

  item_medicine:{
    width:'100%',
    backgroundColor:'rgba(245,233,253,1)',
    padding:10,
    marginTop:5,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },

  search_med_button_capcutre:{
    backgroundColor:'rgb(161, 52, 235)',
    padding:20,
    borderRadius:20
  },

  price:{
    backgroundColor:'rgba(68,37,88,1)',
    padding:10,
    borderRadius:10
  },

  price_text:{
    color:'white',
    fontSize:15,
    fontWeight:'bold'
  }
});