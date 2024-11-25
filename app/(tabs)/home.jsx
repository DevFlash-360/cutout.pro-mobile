import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Banner from '../../components/Home/Banner'
import AiFeaturedModel from '../../components/Home/AiFeaturedModel'
import AiModels from '../../components/Home/AiModels'

export default function Home() {
  return (
    <FlatList 
      data={[1]}
      style={{
        padding: 20,
        marginTop: 20
      }}
      nestedScrollEnabled={true}
      renderItem={({item})=>(
        <View>

          {/* header */}
          <Header />

          {/* Banner */}
          <Banner />

          {/* Featured List */}
          <AiFeaturedModel />

          {/* Ai Models */}
          <AiModels type={'avatar'} />
          <AiModels type={'style'} />

          <View style={{ height: 100 }}>

          </View>
        </View>
      )}
    >
    </FlatList>
  )
}