import axios from 'axios';
import { Platform } from 'react-native';

// Expo API route handler (assuming you are using expo-serverless or a similar setup)
export async function POST(request) {
  // console.log('API called!')
  // try {
    // Parse the incoming JSON request body
    const { formData } = await request.json();

    // try {
    //   const response = await axios.post(
    //     'https://www.cutout.pro/api/v1/matting?mattingType=6',  // Replace with actual API endpoint
    //     formData,
    //     {
    //       headers: {
    //         'APIKEY': process.env.EXPO_PUBLIC_CUTOUT_API_KEY,
    //         'Content-Type': 'multipart/form-data',
    //       },
    //       responseType: 'blob',  // Expect binary data (image)
    //     }
    //   );
    //   console.log('response from cutout: ', response)
    // } catch (error) {
    //   console.log('err from the cutout: ', error)
    // }

    // return new Response(
    //   JSON.stringify({ success: true, formData: formData }),
    //   { status: 200 }
    // );
}
