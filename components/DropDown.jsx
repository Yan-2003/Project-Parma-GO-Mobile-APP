import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'


export default function DropDown({data}) {

    const [inputValue, setinputValue] = useState();

    const [showDropDown, setshowDropDown] = useState(false);

    const show = () =>{
        setshowDropDown( !showDropDown ? true  : false)
    }

    const handleSelection = (value) =>{
        setinputValue(value)
        show()
    }

  return (
    <>
        <View style={styles.input_style}>
            <TextInput value={inputValue} onChange={e => setinputValue(e)} placeholder='Pharmacy' style={{ width : '90%' }} />
            <TouchableOpacity onPress={show}><Image style={{ width : 20, height : 20 }} source={require('../assets/imgs/down.png')}/></TouchableOpacity>
        </View>
        {
            showDropDown ? 
            (
                <View style={styles.dropdownContent}>
                    {
                        data?.map((item , index)=>{
                            return (
                                <TouchableOpacity onPress={()=>handleSelection(item.name)} style={styles.dropdownItems} key={index}><Text>{item?.name}</Text></TouchableOpacity>
                            )
                        })
                    }

                </View>
            )
            : null
        }
     
    </>
  )
}

const styles = StyleSheet.create({
    input_style : {
        borderWidth : 1,
        borderColor : 'gray',
        padding : 15,
        width : "100%",
        margin : 5,
        borderRadius : 10,
        flexDirection : 'row',
        justifyContent  : "space-between",
        alignItems : 'center'
    },

    dropdownContent  : {
        width : '100%',
        borderWidth : 1,
        borderColor :'gray',
        alignSelf : 'center',
        marginLeft : 10,
    },

    dropdownItems : {
        borderBottomWidth : 1, 
        borderColor : 'gray',
        padding : 10,
    }

})

