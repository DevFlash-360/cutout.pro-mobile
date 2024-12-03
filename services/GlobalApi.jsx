import axios from "axios"
const axiosClient=axios.create({
    baseURL:'http://192.168.130.196:1337/api',
    // baseURL:'https://eloquent-treasure-0094d8e836.strapiapp.com/api',
    headers:{
        'Authorization':'Bearer '+process.env.EXPO_PUBLIC_STRAPI_API_KEY
    }
})


const GetUserInfo=(email)=>axiosClient.get('user-lists?filters[userEmail][$eq]='+email)

const CreateNewUser=(data)=>axiosClient.post('/user-lists',{data:data})

const GetFeaturedCategoryList=()=>axiosClient.get('/ai-models?filters[isFeatured][$eq]=true&populate=*');

const GetAiModels=(type)=>axiosClient.get('/ai-models?filters['+type+'][$eq]=true&populate=*')

// const AIGenerateImage=(data)=>axios.post(process.env.EXPO_PUBLIC_AIMODEL_FIREBASE_URL,data);

const AIGenerateImage = (data)=>axios.get('http://192.168.130.196:8081/aimodel')

const UpdateUserCredits=(documentId,data)=>axiosClient.put('/user-lists/'+documentId,{data:data})


// const AddAiImageRecord=(data)=>axiosClient.post('/ai-generated-images',{data:data});

// const GetAllAiImages=(pageSize)=>axiosClient.get('/ai-generated-images?pagination[start]='+(pageSize-5)+'&pagination[limit]='+pageSize+'&pagination[withCount]=true&sort[0]=id:desc')

// const GetUsersAiImages=(pageSize,email)=>axiosClient.get('/ai-generated-images?filters[userEmail][$eq]='+email+'& pagination[start]='+(pageSize-5)+'&pagination[limit]='+pageSize+'&pagination[withCount]=true&sort[0]=id:desc')

export default{
    GetUserInfo,
    CreateNewUser,
    GetFeaturedCategoryList,
    GetAiModels,
    AIGenerateImage,
    UpdateUserCredits,
    // AddAiImageRecord,
    // GetAllAiImages,
    // GetUsersAiImages
}