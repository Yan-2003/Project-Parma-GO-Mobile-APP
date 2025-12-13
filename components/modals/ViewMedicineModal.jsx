import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {API_URL} from '@env';

export default function ViewMedicineModal({setisMedModal , isMedModal, medID}) {

  const [Medicine, setMedicine] = useState();

  const getMedByID = async () => {

    try {
      
      const med = await axios.get(API_URL + '/medicine/get_medby_id/' + medID)
      console.log("MED ID: " + medID)

      console.log("Displaying Meds Data: ", med.data)
      setMedicine(med.data[0])

      } catch (error) {
          console.log(error)
      }

  }


  useEffect(() => {
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
              <Text style={{ fontSize : 20, fontWeight : 'bold'  }}>{Medicine?.name}</Text>
              <Text>Description: {Medicine?.description}</Text>
              <Text>Brand: {Medicine?.brand}</Text>
              <Text>Dosage: {Medicine?.dosage_form}</Text>
              <Text>Strength: {Medicine?.strength}</Text>
              <Text>Price: {Medicine?.price}</Text>
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
    

})