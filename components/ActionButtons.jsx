import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import AdminViewMedicineModal from './modals/AdminViewMedicineModal'
import AdminEditMedicineModal from './modals/AdminEditMedicineModal';
import AdminDeleteMedicineModal from './modals/AdminDeleteMedicineModal';

export default function ActionButtons({data, refresh_data}) {


    const [viewModal, setviewModal] = useState(false);
    const [editModal, seteditModal] = useState(false);
    const [deleteModal, setdeleteModal] = useState(false);



  return (
    <>
    <AdminViewMedicineModal data={data} isModal={viewModal} setisModal={setviewModal} />
    <AdminEditMedicineModal data={data} isModal={editModal} setisModal={seteditModal} />
    <AdminDeleteMedicineModal data={data} isModal={deleteModal} setisModal={setdeleteModal} refresh_data={refresh_data} />

    <View style={styles.contianer}>
      <TouchableOpacity onPress={()=>setviewModal(true)}><Image style={styles.icon} source={require('../assets/imgs/eye.png')}/></TouchableOpacity>
      <TouchableOpacity onPress={()=>seteditModal(true)}><Image style={styles.icon} source={require('../assets/imgs/edit.png')}/></TouchableOpacity>
      <TouchableOpacity onPress={()=>setdeleteModal(true)}><Image style={styles.icon} source={require('../assets/imgs/delete.png')}/></TouchableOpacity>
    </View>
    
    </>
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