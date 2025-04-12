import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { auth, db } from '@/firebaseConfig';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignOut = () => {

  useEffect(() => {
    const signOut = async () => {

        try {
          auth.signOut()
          AsyncStorage.removeItem('userId')
          router.replace("/(auth)/sign-up")
          toast.success(t("successfulLogout"))
          
        } catch (error) {
          toast.warn(t("somethingWentWrong"))
        }
    }

    signOut()
  }, [])


  const {t} = useTranslation()

  const colorScheme = useColorScheme()

  const backgroundColor = Colors[colorScheme ?? 'light'].background
  
  return (    
    <View className='w-full h-full' style={{backgroundColor: backgroundColor}}>
    <ToastContainer closeOnClick pauseOnHover={false} />
        
    </View>
  )
}

export default SignOut
