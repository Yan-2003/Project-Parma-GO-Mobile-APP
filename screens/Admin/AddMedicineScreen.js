import { StyleSheet, Text, View , TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropDown from '../../components/DropDown'
import {API_URL} from '@env'
import axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker'

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
    const [med_expiration_date, setmed_expiration_date] = useState(new Date());
    const [showExpDate, setShowExpDate] = useState(false)

    const onChangeDate = (event, selectedDate) => {
        setShowExpDate(false)
        if (selectedDate) {
        setmed_expiration_date(selectedDate)
        }
    }



    const add_med = async () =>{
        try {
            const pass_data = {
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

            

            console.log(pass_data)

            const response = await axios.post(API_URL + '/medicine/add_medicine', pass_data)

            console.log("POST adding medicine")

            console.log(response.data)

            if(response.data.data.command == "INSERT"){
                Alert.alert("Successfully Added Medicine")
            }else{
                Alert.alert("Their was an error adding the Medicine")
            }
            
            

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
            <TextInput value={med_name} onChangeText={text => setmed_name(text) } style={styles.input_style} placeholder='Medicine Name' />
            <TextInput value={med_descirption} onChangeText={text => setmed_descirption(text)} style={styles.input_style } placeholder='Description' />
            <DropDown data={Pharmacies} setvalue={setmed_pharmacy} /> 
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
            <TouchableOpacity onPress={add_med} style={styles.btn_submit}><Text style={styles.textwhite}>Submit</Text></TouchableOpacity>
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
        flex : 1,
        width : 350,
        marginBottom : 60,
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