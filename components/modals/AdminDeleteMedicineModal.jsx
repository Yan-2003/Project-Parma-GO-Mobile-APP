import { Modal, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '@env'

export default function AdminDeleteMedicineModal({data , isModal , setisModal, refresh_data}) {


    const handle_delete = async () =>{
        try {
            const delete_med = await axios.delete(API_URL + '/medicine/delete_medicine/' + data.id)

            console.log(delete_med.data)

            if(delete_med.data.data == "DELETE"){
                setisModal(false)
                refresh_data()
                Alert.alert("Successfully Deleted Medicine")
            }else{
                Alert.alert("Failed To Deleted Medicine")
            }

        } catch (error) {
            console.log(error)
        }

    }



  return (
    <Modal
            visible={isModal}
            transparent={true}
            animationType='fade'
            onRequestClose={()=>setisModal(false)}
        
        >
        <View style={styles.overlay}>
            <View style={styles.modal_container}>
                <View style={{ marginBottom : 20 }}>
                    <Text style={{ fontWeight : "bold", color : 'red' }}>Delete {data.name}</Text>
                    <Text style={{ fontSize : 12 }}>Are you sure you want to delete this data?</Text>
                </View>
                <View style={styles.close_btn_cotainer} >
                    <TouchableOpacity onPress={handle_delete} style={styles.btn_submit}><Text style={{ color : 'white' }}>Delete</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setisModal(false)} style={styles.close_btn}><Text style={{ color : 'white' }}>Close</Text></TouchableOpacity>
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

    close_btn_cotainer : {
        flexDirection : 'row',
        gap : 10,
        width : '100%',
        alignItems : 'center',
        justifyContent : 'center'
    },

    close_btn : {
        backgroundColor: 'rgb(161, 52, 235)',
        padding : 10,
        borderRadius : 10,
    },

    btn_submit  : {
        backgroundColor: 'rgba(235, 52, 52, 1)',
        padding : 10,
        borderRadius : 10,
    }
})