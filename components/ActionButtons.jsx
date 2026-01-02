import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import AdminViewMedicineModal from './modals/AdminViewMedicineModal'

export default function ActionButtons({data}) {


    const [viewModal, setviewModal] = useState(false);



  return (
    <View style={styles.contianer}>
    <AdminViewMedicineModal data={data} isModal={viewModal} setisModal={setviewModal} />
      <TouchableOpacity onPress={()=>setviewModal(true)}><Image style={styles.icon} source={require('../assets/imgs/eye.png')}/></TouchableOpacity>
      <TouchableOpacity><Image style={styles.icon} source={require('../assets/imgs/edit.png')}/></TouchableOpacity>
      <TouchableOpacity><Image style={styles.icon} source={require('../assets/imgs/delete.png')}/></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

    contianer : {
        flexDirection : 'row',
        gap : 10,
    },

    icon : {
        width : 20, 
        height : 20
    }
})