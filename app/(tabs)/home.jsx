import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Banner from '../../components/Home/Banner'
import AiFeaturedModel from '../../components/Home/AiFeaturedModel'
import AiModels from '../../components/Home/AiModels'

export default function Home() {
  return (
    <View style={{
      padding: 20,
      marginTop: 20
    }}>
      {/* header */}
      <Header />

      {/* Banner */}
      <Banner/>

      {/* Featured List */}
      <AiFeaturedModel />

      {/* Ai Models */}
      <AiModels type={'isFeatured'} />
    </View>
  )
}