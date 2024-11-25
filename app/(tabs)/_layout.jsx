import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import Colors from '../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import GlobalApi from '../../services/GlobalApi'
import { UserDetailContext } from '../../context/UserDetailContext'

export default function TabLayout() {

  const {user} = useUser()
  const {userDetail, setUserDetail}=useContext(UserDetailContext)

  useEffect(()=>{
    user&&VerifyUser()
  }, [user])

  const VerifyUser = async() => {
    const result = await GlobalApi.GetUserInfo(user?.primaryEmailAddress)
    console.log(result.data.data)

    // if user data is already exist..
    if (result.data.data.length != 0) {
      setUserDetail(result.data.data[0])
      return;
    }

    //  append the created on to the db
    try {
      const data = {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName
      }
      const result = await GlobalApi.CreateNewUser(data);
      console.log(result?.data.data)
      setUserDetail(result.data.data[0])

    } catch(e) {

  }
    return;
  }


  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:Colors.PRIMARY
    }}>
      <Tabs.Screen name='home'
        options={{
          title:'Home',
          tabBarIcon:({color}) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen name='collection' 
        options={{
          title:'Collection',
          tabBarIcon:({color}) => <Ionicons name="folder-open" size={24} color={color} />
        }}
        />
      <Tabs.Screen name='profile' 
        options={{
          title:'Profile',
          tabBarIcon:({color}) => <Ionicons name="people-circle" size={24} color={color} />
        }}/>
    </Tabs>
  )
}