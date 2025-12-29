import { View, Text } from 'react-native'
import React from 'react'

export default function Card({data , title , color="gray" , size='100%', textColor="black"}) {
  return (
    <View style={{ backgroundColor : color , padding  : 15 , height : 100 , borderRadius  : 20 ,  width : size}}>
      <Text style={{ color : textColor }}>{title}</Text>
      <Text style={{ fontSize : 45 , fontWeight : 'bold' , textAlign : 'center' , color : textColor }}>{data}</Text>
    </View>
  )
}
