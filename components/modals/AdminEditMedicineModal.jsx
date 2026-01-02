import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Platform, Alert } from 'react-native'
import { useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '@env'
import DropDown from '../DropDown';

export default function AdminEditMedicineModal({data , isModal , setisModal}) {

    console.log("data stock", data.stock)

    const [pharmacy, setpharmacy] = useState();
    const [isLoading, setisLoading] = useState(true);
    const [Pharmacies, setPharmacies] = useState([]);

    const [med_name, setmed_name] = useState(data.name);
    const [med_descirption, setmed_descirption] = useState(data.description);
    const [med_pharmacy, setmed_pharmacy] = useState(data.pharmacy_id);
    const [med_brand, setmed_brand] = useState(data.brand);
    const [med_dosage_form, setmed_dosage_form] = useState(data.dosage_form);
    const [med_strength, setmed_strength] = useState(data.strength);
    const [med_price, setmed_price] = useState(data.price);
    const [med_stock, setmed_stock] = useState(data.stock.toString());
    const [med_expiration_date, setmed_expiration_date] = useState(new Date(data.expiration_date));
    const [showExpDate, setShowExpDate] = useState(false)


    const onChangeDate = (event, selectedDate) => {
        setShowExpDate(false)
        if (selectedDate) {
        setmed_expiration_date(selectedDate)
        }
    }
    
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

    const handle_update = async () =>{
        try {

             const pass_data = {
                id: data.id,
                name : med_name.toString(),
                description : med_descirption.toString(),
                brand : med_brand.toString(),
                dosage_from : med_dosage_form.toString(),
                strength : med_strength.toString(),
                price : parseFloat(med_price),
                stock : parseInt(med_stock),
                pharmacy_id : parseInt(med_pharmacy),
                expiration_date : med_expiration_date.toString()
            }

            const response = await axios.post(API_URL + '/medicine/update_medicine', pass_data)

            console.log(response.data)
            
            if(response.data.data == 'UPDATE'){
                Alert.alert("Succesesfully Updated Medicine")
            }else{
                 Alert.alert("Failed to Updated Medicine")
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const get_all_pharma = async () =>{
        setisLoading(true)
        try {
            const response = await axios.get(API_URL + "/pharmacy/get_pharmacies")
            console.log(response.data)
            setPharmacies(response.data)
            setisLoading(false)
        } catch (error) {
            console.log(error)
            setisLoading(false)
        }

    }

    useEffect(() => {
        setisLoading(true)
        get_pharmacy(data.pharmacy_id)
        get_all_pharma()
    
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
                        <ScrollView style={styles.form}>
                            <TextInput value={med_name} onChangeText={text => setmed_name(text) } style={styles.input_style} placeholder='Medicine Name' />
                            <TextInput value={med_descirption} onChangeText={text => setmed_descirption(text)} style={styles.input_style } placeholder='Description' />
                            <DropDown data={Pharmacies} setvalue={setmed_pharmacy} value={pharmacy?.name}/> 
                            <TextInput value={med_brand} onChangeText={text => setmed_brand(text)} style={styles.input_style } placeholder='Brand' />
                            <TextInput value={med_dosage_form} onChangeText={text => setmed_dosage_form(text) } style={styles.input_style } placeholder='Dosage Form' />
                            <TextInput value={med_strength} onChangeText={text => setmed_strength(text) } style={styles.input_style } placeholder='Strength' />
                            <TextInput value={med_price} onChangeText={text => setmed_price(text)  } keyboardType='numeric' style={styles.input_style } placeholder='Price' />
                            <TextInput value={med_stock} onChangeText={text => setmed_stock(text) } keyboardType='numeric' style={styles.input_style } placeholder='Stock' />
                            <Text style={{ marginLeft : 10 }}>Expiration Date:</Text>
                            <TouchableOpacity
                                style={styles.input_style}
                                onPress={() => setShowExpDate(true)}
                            >
                                <Text>{med_expiration_date.toDateString()}</Text>
                            </TouchableOpacity>

                            {showExpDate && (
                                <DateTimePicker
                                value={med_expiration_date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangeDate}
                                />
                            )}
                        </ScrollView>
                    )
                }
                <View style={styles.close_btn_cotainer} >
                    <TouchableOpacity onPress={handle_update} style={styles.btn_submit}><Text style={{ color : 'white' }}>Update</Text></TouchableOpacity>
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
        width : '100%',
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

    input_style : {
      borderWidth : 1,
      borderColor : 'gray',
      padding : 15,
      width : "100%",
      margin : 5,
      borderRadius : 10,
    },

    btn_submit  : {
        backgroundColor: 'rgb(161, 52, 235)',
        padding : 10,
        borderRadius : 10,
    }
})