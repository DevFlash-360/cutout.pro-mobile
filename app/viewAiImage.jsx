import { View, Text, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import Colors from '../constants/Colors';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function ViewAiImage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const [status, requestPermission]= MediaLibrary.usePermissions();

  useEffect(()=> {
    // console.log(params)
    navigation.setOptions({
      headerShown: true,
      headerTitle:'AI Generated Image'
    })
  }, [])

  const downloadImage= async()=> {
    console.log('Downloading AI Generated Image..')
    // Permission
    try {
      console.log('permission: ', status)
      if(!status?.granted) {
        const permissionResp = await requestPermission();
        if (!permissionResp?.granted) {
          ToastAndroid.show('No Permission to download the image', ToastAndroid.SHORT);
          return ;
        }
      }

      // Download image
      const fileUri=FileSystem.documentDirectory+Date.now()+'_PhotoSaveAi.jpg';
      const {uri}=await FileSystem.downloadAsync(params?.imageUrl, fileUri);
      // Used to Save in Gallery
      const asset = await MediaLibrary.createAssetAsync(uri);

      if(asset) {
        ToastAndroid.show('Image Downloaded!!!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Internal Server Error', ToastAndroid.SHORT);
      }

    } catch (error) {
      
    }

  }

  return (
    <View style={{
      padding: 20,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <Image source={{uri: params?.imageUrl}} style={{
        width:'100%',
        height:400,
        borderRadius:20
      }} />

      <Text style={{
        marginVertical:10,
        fontSize:16,
        color:Colors.PRIMARY
      }}>Prompt: {params?.prompt}</Text>

      <View style={{
        display:'flex',
        flexDirection:'row',
        gap:10,
        marginTop:50
      }}>
        <TouchableOpacity 
        onPress={downloadImage}
        style={{
          padding: 15,
          backgroundColor:Colors.PRIMARY,
          borderRadius:10,
          width:'50%'
        }}>
          <Text style={{
            color:Colors.WHITE,
            textAlign:'center',
            fontSize:18
          }}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          padding: 15,
          backgroundColor:Colors.YELLOW,
          borderRadius:10,
          width:'50%'
        }}>
          <Text style={{
            color:Colors.WHITE,
            textAlign:'center',
            fontSize:18
          }}>Share</Text>
        </TouchableOpacity>
      </View>

      
      <Text style={{
        marginVertical:10,
        fontSize:13,
        color:Colors.GRAY
      }}>Note: Image will available only for next 30 min</Text>

    </View>
  )
}