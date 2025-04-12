import { ScrollView, StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Alert, Platform, useColorScheme, ColorSchemeName } from 'react-native'
import React, { useEffect, useState } from 'react';
import dtkLogo from '../../assets/images/dtk-logo.png'
import { Redirect, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { collection, addDoc } from "firebase/firestore"; 
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedTextInput from '@/components/ThemedTextInput';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from '@/services/i18n';
import HU from '@/assets/images/HU_med.png';
import UK from '@/assets/images/UK_med.png';

const Sing_in = () => {

  const [email, setEmail] = useState('')
  const [password, setPass] = useState('')

  const {t, i18n} = useTranslation()
  
  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [textColor, setTextColor] = useState<any>()
  const [touchableOpColor, setTouchableOpColor] = useState<any>()
  const [inputColor, setInputColor] = useState<any>()
  const [backgroundColor, setbackgroundColor] = useState<any>()
  const systemColorScheme = useColorScheme()

  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
      setTextColor(Colors[themeToSet ?? 'light'].text)
      setTouchableOpColor(Colors[themeToSet ?? 'light'].button)
      setInputColor(Colors[themeToSet ?? 'light'].input)
      setbackgroundColor(Colors[themeToSet ?? 'light'].background)
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

  const handleSignUp = () => {
    
    return router.push("/(auth)/sign-up")

  }
  const handleSignIn = async () => {
    try {

      if(!email){
        toast.info(t("fillinEmail"))
        return
      }
      if(!password){
        toast.info(t("fillinPassword"))
        return
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if(user) {
        await AsyncStorage.setItem('userId', user.uid);
        
        router.replace("/(root)/(drawer)/menu")
      }
    } catch {
        toast.warn(t("badEmailPassword"))
    } finally {}
  }

  return (
    <ScrollView style={{backgroundColor: backgroundColor}}>
      <ToastContainer closeOnClick pauseOnHover={false} limit={1}/>
      <View className='bg-[#232048] p-3'>
        <View className='flex-row gap-2 w-full'>
          <View className='w-1/2 h-full place-items-start justify-center'>
            <View className='p-5 felx-1'>
              <Image source={dtkLogo} className='h-auto w-auto'/>
              <Text className='color-white text-xl font-JakartaBold'>{t("logToAcount")}</Text>
            </View>
          </View>
          <View className='w-1/2 h-full place-items-end justify-center'>
            <View className='p-5 felx-1 '>
              <View className='flex-row gap-2 p-4 '>
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
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView className='p-3 justify-center items-center gap-2' >
        <Text className='text-lg font-JakartaSemiBold' style={{color: textColor}}>{t("email")}</Text>
        <TextInput 
          className='rounded-full p-4 font-JakartaSemiBold flex-1 w-4/5 max-w-sm' 
          style={{color: textColor, backgroundColor: inputColor}}
          placeholder='...@gmail.com' 
          keyboardType='email-address'
          onChangeText={setEmail} value={email}/> 

        <Text className='text-lg font-JakartaSemiBold' style={{color: textColor}}>{t("password")}</Text>
        <TextInput 
          className='rounded-full p-4 font-JakartaSemiBold flex-1 w-4/5 max-w-sm' 
          style={{color: textColor, backgroundColor: inputColor}}
          placeholder='***'
          secureTextEntry 
          onChangeText={setPass} value={password}/>  
          
      </KeyboardAvoidingView>

      <View className='p-3 justify-center items-center gap-4'>
        <TouchableOpacity 
          style={{ backgroundColor: touchableOpColor}}
          className='rounded-full  p-4 font-JakartaSemiBold flex-1 w-3/5 max-w-xs'
          onPress={handleSignIn}>
          <Text className='text-lg font-JakartaSemiBold text-center' style={{color: textColor}}>{t("login")}</Text>
        </TouchableOpacity>

        <Text className='font-JakartaSemiBold mt-safe-offset-5' style={{color: textColor}}>{t("dontHaveAcc")}</Text>

        <TouchableOpacity 
          style={{ borderColor: touchableOpColor}}
          className='rounded-full  p-4 font-JakartaSemiBold flex-1 w-3/5 max-w-xs border-2'
          onPress={handleSignUp}>
          <Text className='text-lg font-JakartaSemiBold text-center' style={{color: textColor}}>{t("signUp")}</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

export default Sing_in
