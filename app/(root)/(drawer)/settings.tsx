import { ColorSchemeName, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import Colors from '@/constants/Colors'
import ThemedText from '@/components/ThemedText'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { auth, db } from '@/firebaseConfig';
import { toast, ToastContainer } from "react-toastify";
import { RadioButton } from 'react-native-paper';
import "react-toastify/dist/ReactToastify.css";
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const Settings = () => {

  const {t} = useTranslation()

  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [textColor, setTextColor] = useState<any>()
  const [backgroundColor, setbackgroundColor] = useState<any>()
  const systemColorScheme = useColorScheme()

  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
      setTextColor(Colors[themeToSet ?? 'light'].text)
      setbackgroundColor(Colors[themeToSet ?? 'light'].background)
    }

     fetchColorTheme()
  }, [])

  async function handleChangeThemeDark() {
    await AsyncStorage.setItem('theme','dark')
    router.navigate("/(auth)/sign-up")
    
  };
  
  async function handleChangeThemelight() {
     await AsyncStorage.setItem('theme','light')
     router.navigate("/(auth)/sign-up")
  };
  
  async function handleChangeThemeAuto() {
    await AsyncStorage.setItem('theme','auto')
    router.navigate("/(auth)/sign-up")
  };
  
  return (    
  <View className='w-full h-full' style={{backgroundColor: backgroundColor}}>
  <ToastContainer closeOnClick pauseOnHover={false} className={'pt-16'}/>
  <SafeAreaView 
    className="w-fit h-full px-12 pt-0 pr-12 flex-row flex-wrap place-self-center" 
    style={{backgroundColor: backgroundColor}}>
    <ScrollView className='shadow-xl border-1 border-secondary-800 w-[100%] h-[100%] place-self-end'
      style={{backgroundColor: backgroundColor}}>

      <View className='flex-row px-40'>
        <Text className='flex-1 text-center text-xl font-JakartaBold p-4' style={{color: textColor}}>{t("settingTheme")}</Text>
      </View>
      <View className='flex-row items-center justify-center p-1'>
        <View style={{backgroundColor: backgroundColor}} 
              className='flex p-4 px-20 rounded-xl self-center justify-center m-auto gap-6'>
              
              <View className='gap-4'>
                <TouchableOpacity className='flex-row gap-4 justify-left items-center' onPress={handleChangeThemelight}>
                  <MaterialIcons name="brightness-5" size={24} color={theme === 'dark' ? "white" : "black"} />
                  <Text style={{color: textColor}}>{t("settingLight")}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-row gap-4 justify-left items-center' onPress={handleChangeThemeDark}>
                  <MaterialIcons name="brightness-4" size={24} color={theme === 'dark' ? "white" : "black"} />
                  <Text style={{color: textColor}}>{t("settingDark")}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-row gap-4 justify-left items-center' onPress={handleChangeThemeAuto}>
                  <MaterialIcons name="brightness-auto" size={24} color={theme === 'dark' ? "white" : "black"} />
                  <Text style={{color: textColor}}>{t("settingAuto")}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>

    </ScrollView>
  </SafeAreaView>
  </View>
  )
}

export default Settings
