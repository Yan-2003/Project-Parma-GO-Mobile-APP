import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import React from 'react'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import {API_URL} from '@env';
import { AuthContext } from '../../context/AuthContext';
import { Image } from 'react-native';

export default function SearchHistoryModal({setshowModal , showModal, searchMed, setcaptureText}) {
    
    const [isLoading, setisLoading] = useState(false); 
    const [search_history, setsearch_history] = useState([]);
    const {user_id} = useContext(AuthContext);

    const get_search_history = async () =>{
        setisLoading(true)
        try {
            const response = await axios.get(API_URL + '/medicine/get_search_history/' + user_id)
            console.log(response.data)
            setsearch_history(response.data)
            setisLoading(false)
        } catch (error) {
            console.log(error)
            setisLoading(false)
        }
    }

    const handle_delete = async (id) =>{
        try {
            const response = await axios.delete(API_URL + '/medicine/delete_search_history/' + id)

            console.log(response.data)

            if(response.data.data == "DELETE"){
                get_search_history()
            }else{
                Alert.alert("Failed To Deleted History")
            }

        } catch (error) {
            console.log(error)
        }

    }

    function formatTimestamp(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);

        const diffMs = now - time;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffMinutes < 1) {
            return "Just Now";
        }

        if (diffMinutes < 60) {
            return diffMinutes === 1
            ? "1 Minute Ago"
            : `${diffMinutes} Minutes Ago`;
        }

        if (diffHours < 24) {
            return diffHours === 1
            ? "1 Hour Ago"
            : `${diffHours} Hours Ago`;
        }

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const month = months[time.getMonth()];
        const day = time.getDate();
        const year = time.getFullYear();

        let hours = time.getHours();
        const minutes = time.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
    }


    const handle_search_from_history = (history) =>{
        setcaptureText(history)
        searchMed()
        setshowModal(false)
    }

    useEffect(() => {
        get_search_history()
    
        return () => {
            
        }
    }, [showModal]);

  return (
    <Modal
            visible={showModal}
            transparent={true}
            animationType='fade'
            onRequestClose={()=> setisMedModal(false)}
        >
        <View style={styles.overlay}>
            <View style={styles.modal_container}>
                <View style={styles.modal_header}>
                    <Text style={{ fontSize : 15, fontWeight : 'bold' }}>Search History</Text>
                </View>
                <View style={styles.display_body}>
                  {
                    !isLoading ? (
                      <>
                        <View style={{ marginTop : 20 }}>
                          <ScrollView style={{ height : 200 }}>
                            {
                                isLoading ? <Text>Loading.....</Text>
                                :
                                search_history.map((item, index)=>{
                                    return(
                                        <View key={index} style={{ width : '100%', flexDirection : 'row', alignItems  :'center' , justifyContent : 'space-between', padding : 5 }}>
                                            <TouchableOpacity onPress={()=> handle_search_from_history(item.history_name)} style={{ flexDirection : 'column' }}>
                                                <Text style={{ fontSize : 15, fontWeight : 'bold' }}>{item.history_name}</Text>
                                                <Text style={{ fontSize : 10 }}>{formatTimestamp(item.created_at)}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={()=>handle_delete(item.id)} ><Image style={{ width : 20, height : 20 }} source={require('../../assets/imgs/delete.png')} /></TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                          </ScrollView>
                        </View>
                      </>
                      )
                    : null
                  }
                </View>
                <View style={styles.close_btn_cotainer} >
                    <TouchableOpacity onPress={()=>setshowModal(false)} style={styles.close_btn}><Text style={{ color : 'white' }}>Close</Text></TouchableOpacity>
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
        borderRadius : 10, 
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
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

    km_tag  : {
        backgroundColor: 'rgb(161, 52, 235)',
        color : 'white',
        padding : 10,
        borderRadius : 10,
        fontWeight : 'bold'
    },

})