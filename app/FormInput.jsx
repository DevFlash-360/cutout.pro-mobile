import { View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Colors from '../constants/Colors';
import TextInput_ from '../components/FormInput/TextInput_';
import ImageUploadComponent from '../components/FormInput/ImageUploadComponent';
import axios from "axios";
import * as FileSystem from 'expo-file-system';

export default function FormInput() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const [aiModel, setAiModel] = useState();
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // State for generated image URL
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    console.log('Current aiModelName: ', params.aiModelName);
    setAiModel(params);
    navigation.setOptions({
      headerShown: true,
      headerTitle: params?.name
    });
  }, []);

  const OnGenerate = async () => {
    if (!userImage) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true); // Start loading

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
      console.log('response from cutout: ', response.data.data.imageUrl)
      setGeneratedImageUrl(response.data.data.imageUrl);
    } catch (error) {
      console.log(error)
    }

    // const response = await axios.post('http://192.168.130.196:8081/aimodel', {
    //   formData
    // });
  };

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
            style={{
              padding: 12,
              backgroundColor: Colors.PRIMARY,
              borderRadius: 15,
              marginVertical: 15,
              width: '100%',
            }}>
            <Text style={{
              textAlign: 'center',
              color: Colors.WHITE,
              fontSize: 20
            }}>Generate</Text>
          </TouchableOpacity>

          {/* Show loading indicator while fetching */}
          {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} />}

          {/* Render the generated AI image if available */}
          {generatedImageUrl && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Generated Image:</Text>
              <Image 
                source={{ uri: generatedImageUrl }} 
                style={{ width: '100%', height: 300, borderRadius: 10 }} 
                resizeMode="contain" 
              />
            </View>
          )}
        </View>
      )}
    />
  );
}