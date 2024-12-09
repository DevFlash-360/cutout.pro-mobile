import { View, Text, FlatList, Dimensions, Image, ActivityIndicator, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalApi from '../../services/GlobalApi'
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function AllUsersCreation() {

    const [pageSize, setPageSize] = useState(4);
    const [loadMoreCount, setLoadMoreCount] = useState(4);
    const [loading, setLoading]=useState(false);
    const [aiImageList, setAiImageList] = useState([])
    const router = useRouter();
    const [metaData, setMetaData] = useState();
    const ColumnWidth = Dimensions.get('screen').width*0.85/2;

  useEffect( ()=> {
    setAiImageList([])
    GetAllAiImages(3);
  },[])

  /**
   * used dto fetch all user images
   */
  const GetAllAiImages = async (size) => {
    if (loading) return; // Prevent duplicate calls.

    setLoading(true);
    try {
        let moreCount=loadMoreCount;
        let fetchSize = size;
        if (moreCount+aiImageList.length>metaData?.total) {
            moreCount = metaData?.total - aiImageList.length
            fetchSize=metaData?.total
        }
        const result = await GlobalApi.GetAllAiImages(fetchSize, moreCount);
        setPageSize(fetchSize)
        const resultData = result.data.data;

        setMetaData(result.data.meta.pagination);
        console.log(result.data.meta.pagination)
        setAiImageList((prev) => [...prev, ...resultData]); // Append new data.
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        setLoading(false); // Reset loading state.
    }
  }

    const handleEndReached = () => {
        console.log('end reached', loading, aiImageList.length, metaData?.total)
        if (loading || aiImageList.length >= (metaData?.total || 0)) {
            return; // Prevent redundant fetches when already loading or no more data to fetch.
        }
        console.log('loading more..')
        const nextPageSize = pageSize + loadMoreCount; // Calculate next page size explicitly.
        // setPageSize(nextPageSize); // Schedule state update.
        GetAllAiImages(nextPageSize); // Pass the calculated value.
    };
    
  const RenderFoot = () => {
    if(loading) {
        return <ActivityIndicator size={'large'} color={Colors.PRIMARY} />
    } else {
        return null
    }
  }

  const onImageClickHandle = (item)=>{
    router.push({
        pathname:'viewAiImage',
        params:{
            imageUrl:item.imageUrl,
            prompt:'Hidden'
        }
    })
  }

    return (
    <View style={{
        marginTop:20,
    }}>
        <Text style={{
            fontSize: 20,
            fontWeight:'bold'
        }}>User's Creation</Text>
        
        <FlatList
            data={aiImageList}
            numColumns={2}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={RenderFoot}
            renderItem={({item,index})=>(
                <TouchableOpacity
                onPress={()=>onImageClickHandle(item)}
                style={{
                    margin:5,
                    backgroundColor:Colors.LIGHT_GRAY,
                    borderRadius:15,
                    padding: 5
                }}>
                    {/* <Text>{item?.imageUrl}</Text> */}
                    <Image source={{uri:item?.imageUrl}}
                    style={{
                        width:ColumnWidth,
                        height: 250,
                        borderRadius:15,
                    }}
                    />
                </TouchableOpacity>
            )}
        />
    </View>
  )
}