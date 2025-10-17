import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedText, setCapturedText] = useState('');

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

      const apiUrl = 'http://192.168.254.3:8000/ocr';

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Read text from JSON response
      setCapturedText(response.data.text || 'No text detected.');
    } catch (error) {
      console.error(error);
      setCapturedText('Error processing image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(161, 52, 235)" />
          <Text>Processing image...</Text>
        </View>
      ) : (
        <>
          <CameraView ref={cameraRef} style={styles.camera} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <Text style={styles.captureText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.textContainer}>
            <Text style={styles.textOutput}>{capturedText}</Text>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: { backgroundColor: 'rgb(161, 52, 235)', padding: 15, borderRadius: 50 },
  captureText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  textContainer: { padding: 10, backgroundColor: '#f5f5f5', maxHeight: 100 },
  textOutput: { fontSize: 16, color: '#333' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  camera: { flex: 1, width: 300, borderRadius: 40, marginTop: 100 },
});
  