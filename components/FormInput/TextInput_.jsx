import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function TextInputComponent({userInputValue}) {
  return (
    <View>
      <Text style={{
        marginTop:10
      }}>Enter your prompt</Text>
      <TextInput placeholder='Enter your prompt here...'
        numberOfLines={5}
        multiline={true}
        textAlignVertical='top'
        onChangeText={(value)=>userInputValue(value)}
        style={{
          padding:15,
          backgroundColor:Colors.LIGHT_GRAY,
          borderRadius:15,
          marginTop:10
        }}
      />
    </View>
  )
}