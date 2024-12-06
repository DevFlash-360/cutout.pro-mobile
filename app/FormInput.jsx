import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList, ToastAndroid } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import TextInput_ from '../components/FormInput/TextInput_';
import ImageUploadComponent from '../components/FormInput/ImageUploadComponent';
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import {UserDetailContext} from './../context/UserDetailContext';
import GlobalApi from '../services/GlobalApi';
import {Cloudinary} from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';

export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState();
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [loading, setLoading] = useState(false); // Loading state
  const router=useRouter();

  const {userDetail, setUserDetail}=useContext(UserDetailContext);

  useEffect(() => {
    console.log('Current aiModelName: ', params.aiModelName);
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name
    });
  }, []);

  const OnGenerate = async () => {

    if(userDetail?.credits <= 0) {
      ToastAndroid.show('You dont have enough credits', ToastAndroid.LONG);
      return;
    }

    console.log('AI model name: ', aiModel?.aiModelName)
    console.log('User Image Upload: ', aiModel?.userImageUpload)

    if(aiModel?.userImageUpload=='false' || aiModel?.userImageUpload == false){
      TextToImage()
    }
    else {
      ImageToAiImage()
    }
    
  };

  const TextToImage = () => {
    if (!userInput) {
      alert("Please select an image first.");
      return;
    }
    
    router.push({
      pathname:'viewAiImage',
      params:{
        imageUrl:'fake url',
        prompt:userInput
      }
    })

  }

  const ImageToAiImage = async() =>{

    console.log('ImageToAiImage')
    if (!userImage) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true); // Start loading

    // Upload picked image to cloudinary.

    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_NAME
      },
      url: {
        secure: true
      }
    });
  
    const options = {
      upload_preset: process.env.EXPO_PUBLIC_CLOUDINARY_PRESET,
      unsigned: true,
    }
  
      await upload(cld, {file: userImage , options: options, callback: (error, response) => {
          //.. handle response
          console.log('picked image uploaded to cloudinary: ', response?.url)
      }})


    // Generate AI Image.

    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(userImage);
  
      if (!fileInfo.exists) {
        Alert.alert('Error', 'File does not exist');
        return;
      }

      // const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      const file = {
        uri: userImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://www.cutout.pro/api/v1/matting2?mattingType=6',  // Replace with actual API endpoint
        formData,
        {
          headers: {
            'APIKEY': process.env.EXPO_PUBLIC_CUTOUT_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
          // responseType: 'blob',  // Expect binary data (image)
        }
      );
      const AIImage =  response.data.data.imageUrl;
      console.log('AI generated image url: ', AIImage)

        
      // To update user Credit
      const updatedResult = await GlobalApi.UpdateUserCredits(userDetail?.documentId,
        {credits:Number(userDetail?.credits)-1})
      console.log('credit update result ', updatedResult.data.data.userEmail, updatedResult.data.data.credits)
      setUserDetail(updatedResult?.data.data);

      // // save generated image url

      const SaveImageData={
        imageUrl:AIImage,
        userEmail: userDetail?.userEmail
      }
      const SaveImageResult = await GlobalApi.AddAiImageRecord(SaveImageData)
      console.log(SaveImageResult.data.data.userEmail, 'added a new image record')

      router.push({
        pathname:'viewAiImage',
        params:{
          imageUrl:AIImage,
          prompt:aiModel?.aiModelName
        }
      })

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }

    // const response = await axios.post('http://192.168.130.196:8081/aimodel', {
    //   formData
    // });

  }

  return (
    <FlatList
      data={[1]}
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: '100%'
      }}
      nestedScrollEnabled={true}
      renderItem={({item})=>(
        <View>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold'
          }}>{aiModel?.name}</Text>

          <View>
            {aiModel?.userImageUpload !== 'true' ?
              <TextInput_ userInputValue={(value) => setUserInput(value)} /> :
              <ImageUploadComponent uploadedImage={(value) => setUserImage(value)} />}

            <Text style={{
              color: Colors.GRAY,
              marginVertical: 5
            }}>NOTE: 1 Credit will be used to generate AI Image</Text>
          </View>

          <TouchableOpacity 
            onPress={OnGenerate}
            disabled={loading}
            style={{
              padding: 12,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 15,
              marginVertical: 15,
              width: '100%',
            }}>
            {loading ? <ActivityIndicator size={'large'} color={'#fff'} /> :
              <Text style={{
                textAlign: 'center',
                color: Colors.WHITE,
                fontSize: 20
              }}>Generate</Text>
            }
          </TouchableOpacity>
        </View>
      )}
    />
  );
}