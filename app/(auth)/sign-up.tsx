import { ScrollView, StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Platform, ColorSchemeName } from 'react-native'
import React, { ErrorInfo, useEffect, useState } from 'react';
import dtkLogo from '../../assets/images/dtk-logo.png'
import { Redirect, router } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, setDoc, doc, FirestoreError } from "firebase/firestore"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu'
import dtkColors from '@/constants/dtkColors';
import Toast from 'react-native-toast-message';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HU from '@/assets/images/HU_med.png';
import UK from '@/assets/images/UK_med.png';

const Sing_up = () => {

  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [password2, setPass2] = useState('');
  const [date, setDate] = useState(dayjs());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
  
  useEffect(() => {
    const loadSession = async () => {
      
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        router.replace("/(root)/(drawer)/menu");
      }
    };
    loadSession();
  }, []);

  
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

  const handleSignUp = async () => {
    try {
      if(!email){
        toast.info(t("fillinEmail"))
        return
      }
      if(!password){
        toast.info(t("fillinPassword"))
        return
      }
      if(password != password2){
        toast.warn(t("passwordDontMatch"))
        return
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        email: email,
        ageGroup: '',
        dateOfBirth: date.year() +"-"+ (Number.parseInt(date.month().toString())+1) +"-"+ (Number.parseInt(date.day().toString())+1),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('theme', 'auto');

      router.replace("/(root)/(drawer)/menu");

    } catch (error: any) {
      if (error.code === "auth/email-already-in-use"){
        toast.error(t("usersExists"))
      }
      else if (error.code === "auth/invalid-email"){
        toast.error(t("invalidEmail"))
      }
      else if (error.code === "auth/weak-password"){
        toast.error(t("invalidPassword"))
      }
    } finally {}
  };
  const handleSignIn = () => {
    
    return router.push("/(auth)/sign-in")
  }

  function handerDatePicker() {
    setShowDatePicker(true)
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

      <KeyboardAvoidingView className='p-3 justify-center items-center gap-2'>
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
        <TextInput 
          className='rounded-full p-4 font-JakartaSemiBold flex-1 w-4/5 max-w-sm' 
          style={{color: textColor, backgroundColor: inputColor}}
          placeholder='***'
          secureTextEntry 
          onChangeText={setPass2} value={password2}/> 

        <Text className='text-lg font-JakartaSemiBold' style={{color: textColor}}>{t("dateOfBirth")}</Text>
        
        <TouchableOpacity 
          className='rounded-full p-4 flex-1 w-4/5 max-w-sm'
          style={{ backgroundColor: inputColor}} 
          onPress={handerDatePicker}>
          <Text 
            className='font-JakartaSemiBold'
            style={{color: textColor}}>
              { date.year() +"-"+ (Number.parseInt(date.month().toString())+1) +"-"+ (Number.parseInt(date.day().toString())+1)}
          </Text>
        </TouchableOpacity>

        <View className='flex-row'>
        {showDatePicker && (
          <DateTimePicker
            mode="single"
            date={date}
            headerButtonsPosition='around'
            headerButtonColor={dtkColors.dtk_main_light}
            headerTextStyle={{color: textColor}}
            weekDaysTextStyle={{color: textColor}}
            monthContainerStyle={{backgroundColor: backgroundColor}}
            yearContainerStyle={{backgroundColor: backgroundColor}}
            selectedItemColor={dtkColors.dtk_main_light}
            calendarTextStyle={{color: textColor}}
            maxDate={dayjs()}
            firstDayOfWeek={1}
            todayContainerStyle={{borderWidth: 1}}
            locale={hu}
            onChange={(params) => { setDate(params.date as dayjs.Dayjs); setShowDatePicker(false)}}/>
          )
        }
        </View>
          
      </KeyboardAvoidingView>

      <View className='p-3 justify-center items-center gap-4'>
        <TouchableOpacity 
          style={{ backgroundColor: touchableOpColor}}
          className='rounded-full p-4 font-JakartaSemiBold flex-1 w-3/5 max-w-xs '
          onPress={handleSignUp}>
          <Text className='text-lg font-JakartaSemiBold text-center' style={{color: textColor}}>{t("create")}</Text>
        </TouchableOpacity>

        <Text className='font-JakartaSemiBold mt-safe-offset-5' style={{color: textColor}}>{t("haveAcc")}</Text>

        <TouchableOpacity 
          style={{ borderColor: touchableOpColor}}
          className='rounded-full  p-4 font-JakartaSemiBold flex-1 w-3/5 max-w-xs border-2'
          onPress={handleSignIn}>
          <Text className='text-lg font-JakartaSemiBold text-center' style={{color: textColor}}>{t("signIn")}</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}
export default Sing_up
