import { ColorSchemeName, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { ToastContainer, toast } from 'react-toastify';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardUpload = () => {

  const {t} = useTranslation();
  
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

  return (
    <View className='w-full h-full' style={{backgroundColor: backgroundColor}}>
    <ToastContainer closeOnClick pauseOnHover={false} className={'pt-16'}/>
      
    </View>
  )
}

export default CardUpload