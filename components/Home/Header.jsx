import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import Colors from '../../constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { UserDetailContext } from '../../context/UserDetailContext'

export default function Header() {
  const {user} = useUser()
  const {userDetail, setUserDetail}=useContext(UserDetailContext)
  return (
    <View>
      <Text style={{
        fontSize:30,
        color:Colors.PRIMARY,
        fontWeight:'bold'
      }}>Cutout.pro</Text>

      <View>
        
        <View>
          <Image source={require('../../assets/images/coin.png')}
            style={{
              width:30,
              height:30
            }}/>
          {/* <Text>{userDetail?.</Text> */}
        </View>
        <Image source={{uri:user?.imageUrl}} style={{
          width:40,
          height:40,
          borderRadius:99
        }}/>
      </View>
    </View>
  )
}