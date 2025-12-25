import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {API_URL} from '@env';

export default function ViewMedicineModal({setisMedModal , isMedModal, medID}) {

  const [Medicine, setMedicine] = useState();

  const [Pharmacies, setPharmacies] = useState([]);

  const [isLoading, setisLoading] = useState(false);


  const getMedByID = async () => {

    try {
      
      const med = await axios.get(API_URL + '/medicine/get_medby_id/' + medID)
      console.log("MED ID: " + medID)

      console.log("Displaying Meds Data: ", med.data)
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

     console.log(response.data)

     setPharmacies(response.data)


    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    setisLoading(true)
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
                                  <TouchableOpacity style={styles.pharma_avail} key={index}>
                                      <Text>{pharmacies.name}</Text>
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
    borderRadius : 10 
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