import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '@env'
export default function AdminViewMedicineModal({data , isModal , setisModal}) {


    const [pharmacy, setpharmacy] = useState();
    const [isLoading, setisLoading] = useState(true);
    
    const get_pharmacy = async (id) =>{
        setisLoading(true)
        try {
            const response = await axios.get(API_URL + '/pharmacy/get_pharmacy_by_id/' + id)
            console.log(response.data)
            setpharmacy(response.data[0])
            setisLoading(false)
        } catch (error) {
            console.log(error)
            setisLoading(false)
        }
    }

    useEffect(() => {
        get_pharmacy(data.pharmacy_id)
    
        return () => {
            
        }
    }, []);

  return (
    <Modal
        visible={isModal}
        transparent={true}
        animationType='fade'
        onRequestClose={()=>setisModal(false)}
    
    >
    <View style={styles.overlay}>
        <View style={styles.modal_container}>
            {
                isLoading ? <Text>Loading....</Text>
                :
                (
                    <>
                        <Text style={{ fontSize : 20, fontWeight : 'bold', marginBottom : 10  }}>{data?.name}</Text>
                        <Text>Description: {data?.description}</Text>
                        <Text>Brand: {data?.brand}</Text>
                        <Text>Dosage: {data?.dosage_form}</Text>
                        <Text>Strength: {data?.strength}</Text>
                        <Text>Price: <Text style={{ fontWeight : 'bold' }}>₱{data?.price}</Text></Text>
                        <Text>Pharmacy: <Text>{pharmacy.name}</Text></Text>
                    </>
                )
            }
            <View style={styles.close_btn_cotainer} >
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
        height : 300,
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
        width : '100%',
        alignItems : 'center'
    },

    close_btn : {
        backgroundColor: 'rgb(161, 52, 235)',
        padding : 10,
        borderRadius : 10,
    },

})