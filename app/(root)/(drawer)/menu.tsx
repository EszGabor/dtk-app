import { SafeAreaView, Image, Text, TouchableOpacity, View, useColorScheme, ColorSchemeName } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import menuSocialWeb from '@/assets/images/menuSocial.png';
import menuRecWeb from '@/assets/images/menuRecreation.png';
import menuMapWeb from '@/assets/images/menuMap.png';
import menuHelpWeb from '@/assets/images/menuHelp.png';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = () => {
  
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

  const routToRecreation = () => {
    return router.push("/(tabs)/recreationScreen")
  }
  const routToSocial = () => {
    return router.push("/(tabs)/socialScreen")
  }
  const routToHelp = () => {
    return router.push("/(tabs)/helpScreen")
  }
  const routToMap = () => {
    return router.push("/(tabs)/mapScreen")
  }

    return (
      <SafeAreaView 
        className="w-full h-full p-5 place-content-center"
        style={{backgroundColor: backgroundColor}}>
      <View className='flex-row'>
      <View className="p-4 w-full flex-1">
        <TouchableOpacity 
          className="shadow-lg w-full h-44 justify-center items-center bg-white rounded-md overflow-hidden"
          onPress={routToRecreation}>
          <Image 
          source={menuRecWeb} 
          className="w-full h-full" 
          resizeMode="cover" 
          />
        </TouchableOpacity>
        <Text className="font-JakartaBold p-4 text-center" style={{color: textColor}}>
          {t("recreation")}
        </Text>
      </View>
      <View className="p-4 w-full flex-1">
        <TouchableOpacity 
          className="shadow-lg w-full h-44 justify-center items-center bg-white rounded-md overflow-hidden"
          onPress={routToSocial}>
          <Image 
          source={menuSocialWeb} 
          className="w-full h-full" 
          resizeMode="cover" 
          />
        </TouchableOpacity>
        <Text className="font-JakartaBold p-4 text-center" style={{color: textColor}}>
          {t("social")}
        </Text>
      </View>
      </View>

      <View className='flex-row'>
      <View className="p-4 w-full flex-1">
        <TouchableOpacity 
          className="shadow-lg w-full h-44 justify-center items-center bg-white rounded-md overflow-hidden"
          onPress={routToMap}>
          <Image 
          source={menuMapWeb} 
          className="w-full h-full" 
          resizeMode="cover" 
          />
        </TouchableOpacity>
        <Text className="font-JakartaBold p-4 text-center" style={{color: textColor}}>
          {t("map")}
        </Text>
      </View>
      <View className="p-4 w-full flex-1">
        <TouchableOpacity 
          className="shadow-lg w-full h-44 justify-center items-center bg-white rounded-md overflow-hidden"
          onPress={routToHelp}>
          <Image 
          source={menuHelpWeb} 
          className="w-full h-full" 
          resizeMode="cover" 
          />
        </TouchableOpacity>
        <Text className="font-JakartaBold p-4 text-center" style={{color: textColor}}>
          {t("help")}
        </Text>
      </View>
      </View>
      </SafeAreaView>
    )
}

export default Menu
