import { StyleSheet, Text, View , TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropDown from '../../components/DropDown'
import {API_URL} from '@env'
import axios from 'axios'

export default function AddMedicineScreen() {

    const [Pharmacies, setPharmacies] = useState([]);

    const [med_name, setmed_name] = useState();
    const [med_descirption, setmed_descirption] = useState();
    const [med_pharmacy, setmed_pharmacy] = useState();
    const [med_brand, setmed_brand] = useState();
    const [med_dosage_form, setmed_dosage_form] = useState();
    const [med_strength, setmed_strength] = useState();
    const [med_price, setmed_price] = useState();
    const [med_stock, setmed_stock] = useState();
    const [med_expiration_date, setmed_expiration_date] = useState();


    const add_med = async () =>{
        try {
            const pass_data = {
                name : med_name,
                description : med_descirption,
                brand : med_brand,
                dosage_from : med_dosage_form,
                strength : med_strength,
                price : med_price,
                stock : med_stock,
                pharmacy_id : med_pharmacy,
                expiration_date : med_expiration_date
            }

            const response = await axios.post("", pass_data)

            console.log(response)

        } catch (error) {
            console.log(error)
        }




    }



    const get_all_pharma = async () =>{
        try {
            const response = await axios.get(API_URL + "/pharmacy/get_pharmacies")
            console.log(response.data)
            setPharmacies(response.data)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        get_all_pharma()
    
        return () => {
            
        }
    }, []);





  return (
    <SafeAreaView style={styles.container}>
      <Text>Add Medicine</Text>
        <ScrollView style={styles.form}>
            <TextInput style={styles.input_style} placeholder='Medicine Name' />
            <TextInput style={styles.input_style } placeholder='Description' />
            <DropDown data={Pharmacies} /> 
            <TextInput style={styles.input_style } placeholder='Brand' />
            <TextInput style={styles.input_style } placeholder='Dosage Form' />
            <TextInput style={styles.input_style } placeholder='Strength' />
            <TextInput style={styles.input_style } placeholder='Price' />
            <TextInput style={styles.input_style } placeholder='Stock' />
            <TextInput style={styles.input_style } placeholder='Expiration Date' />
            <TouchableOpacity style={styles.btn_submit}><Text style={styles.textwhite}>Submit</Text></TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        width : '90%',
        alignSelf : 'center',
        alignItems : 'center',
        justifyContent : 'center'
    },

    form : {
        width : 350,
        padding  :10,
    },

    input_style : {
        borderWidth : 1,
        borderColor : 'gray',
        padding : 15,
        width : "100%",
        margin : 5,
        borderRadius : 10,
    },
    
    textwhite : {
        color : 'white'
    },

    btn_submit : { 
        padding : 20,
        width : "100%",
        margin : 5,
        borderRadius : 10,
        backgroundColor : 'rgba(168, 97, 219, 1)',
        justifyContent : 'center',
        alignItems : 'center',
    },
})