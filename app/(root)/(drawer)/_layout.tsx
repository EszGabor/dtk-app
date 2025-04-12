import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import 'react-native-reanimated';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Account from './account';
import CardUpload from './cardUpload';
import Settings from './settings';
import Menu from './menu';
import 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import "@/global.css";
import HU from '@/assets/images/HU_med.png';
import UK from '@/assets/images/UK_med.png';
import dtkColors from '@/constants/dtkColors';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, useColorScheme, View, Image, ColorSchemeName } from 'react-native';
import Colors from '@/constants/Colors';
import SignOut from './signOut';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator()

const Layout = () => {
  
  const {t, i18n} = useTranslation()
  const colorScheme = useColorScheme()
  
  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [drawerInactiveTextColor, setDrawerInactiveTextColor] = useState<any>()
  const [drawerActiveTextColor, setDrawerActiveTextColor] = useState<any>()
  const [drawerLogoutBgColor, setDrawerLogoutBgColor] = useState<any>()
  const systemColorScheme = useColorScheme()

  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
      setDrawerInactiveTextColor(Colors[themeToSet ?? 'light'].text)
      setDrawerActiveTextColor(Colors[themeToSet ?? 'light'].background)
      setDrawerLogoutBgColor(Colors[themeToSet ?? 'light'].delete)
    }

     fetchColorTheme()
  }, [])
  
  const [selectedLanguage, setSelectedLanguage] = useState('hu')

  const handleEnglish = () => {
    if (selectedLanguage !== 'en') {
      setSelectedLanguage('en')
      i18n.changeLanguage('en')
    }
  }

  const handleHungarian = () => {
    if (selectedLanguage !== 'hu') {
      setSelectedLanguage('hu')
      i18n.changeLanguage('hu')
    }
  }

  return (
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator 
        initialRouteName="menu"
        screenOptions={{
          drawerActiveBackgroundColor: dtkColors.dtk_main_light, 
          drawerActiveTintColor: drawerActiveTextColor,
          drawerInactiveTintColor: drawerInactiveTextColor,
          headerTintColor: theme === 'dark' ? "white" : "black"
        }}>
        <Drawer.Screen 
          name={t("menu")}
          component={Menu} 
          options={{ 
            headerTitle: "",
            drawerIcon: ({}) => (
              <AntDesign name="menufold" size={24} color={theme === 'dark' ? "white" : "black"} style={{ opacity: 0.5 }} />
            ),
            headerRight: () => (
              <View className='flex-row gap-2 p-4'>
                <TouchableOpacity
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'en' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleEnglish}>
                  <Image source={UK}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'hu' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleHungarian}>
                  <Image source={HU}/>
                </TouchableOpacity>
              </View>
            ),
          }} 
        />
        <Drawer.Screen 
          name={t("account")}
          component={Account} 
          options={{ 
            headerTitle: t("account"),
            drawerIcon: ({}) => (
              <AntDesign name="user" size={24} color={theme === 'dark' ? "white" : "black"} style={{ opacity: 0.5 }} />
            ),
            headerRight: () => (
              <View className='flex-row gap-2 p-4'>
                <TouchableOpacity
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'en' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleEnglish}>
                  <Image source={UK}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'hu' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleHungarian}>
                  <Image source={HU}/>
                </TouchableOpacity>
              </View>
            ),
          }} 
        />
        <Drawer.Screen 
          name={t("cardUpload")}
          component={CardUpload} 
          options={{ 
            headerTitle: t("cardUpload"),
            drawerIcon: ({}) => (
              <AntDesign name="idcard" size={24} color={theme === 'dark' ? "white" : "black"} style={{ opacity: 0.5 }}/>
            ),
            headerRight: () => (
              <View className='flex-row gap-2 p-4'>
                <TouchableOpacity
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'en' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleEnglish}>
                  <Image source={UK}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'hu' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleHungarian}>
                  <Image source={HU}/>
                </TouchableOpacity>
              </View>
            ),
          }} 
        />
        <Drawer.Screen 
          name={t("settings")}
          component={Settings} 
          options={{ 
            headerTitle: t("settings") ,
            drawerIcon: ({}) => (
              <AntDesign name="setting" size={24} color={theme === 'dark' ? "white" : "black"} style={{ opacity: 0.5 }} />
            ),
            headerRight: () => (
              <View className='flex-row gap-2 p-4'>
                <TouchableOpacity
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'en' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleEnglish}>
                  <Image source={UK}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  className={`p-1 rounded-md border-2 ${
                    selectedLanguage === 'hu' ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onPress={handleHungarian}>
                  <Image source={HU}/>
                </TouchableOpacity>
              </View>
            ),
          }} 
        />
        <Drawer.Screen 
          name={t("signOut")}
          component={SignOut} 
          options={{ 
            headerShown: false,
            drawerIcon: ({}) => (
              <AntDesign name="logout" size={24} color={theme === 'dark' ? "white" : "black"} style={{ opacity: 0.5 }}/>
            ),
          }} 
        />
      </Drawer.Navigator>
      </ThemeProvider>
  );
}

export default Layout