import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../services/GlobalApi'
import Colors from '../../constants/Colors'

export default function AiFeaturedModel() {

  const [aiModelList, setAiModelList] = useState([])

  useEffect(() => {
    GetAiModelFeaturedList()
  }, [])

  const GetAiModelFeaturedList = async() => {
    const result = await GlobalApi.GetFeaturedCategoryList()
    console.log(result.data.data)
    setAiModelList(result.data.data)
  }

  return (
    <View style={{
      marginTop: 20
    }}>
      <Text style={{
        fontSize:18,
        fontWeight:'bold'
      }}>Featured </Text>

      <FlatList
        data={aiModelList}
        numColumns={5}
        style={{
          marginTop:5
        }}
        renderItem={({item,index})=>(
          <View style={{
            flex:1,
            alignItems:'center'
          }}>
            <View style={{
              padding:10,
              borderRadius:8,
              backgroundColor:Colors.LIGHT_GRAY,
              
            }}>
              <Image source={{uri: item?.icon?.url}} 
                style={{
                  width:35,
                  height:35
                }}
              />
            </View>
            <Text style={{
              fontSize:11,
              textAlign:'center',
              color:Colors.PRIMARY,
              marginTop:2
            }}>{item?.name}</Text>
          </View>
        )}
      />
    </View>
  )
}