import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { UserDetailContext } from '../context/UserDetailContext'
import { useState } from "react";
import { tokenCache } from '@/cache'

export default function RootLayout() {

  const [userDetail, setUserDetail] = useState()
    
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen
            name='login/index'
          />
          <Stack.Screen name="FormInput" />
        </Stack>
        </UserDetailContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
