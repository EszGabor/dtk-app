import { Alert, ColorSchemeName, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { auth, db } from '@/firebaseConfig';
import { getAuth, updateEmail, verifyBeforeUpdateEmail, updateCurrentUser, revokeAccessToken, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { collection, addDoc, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import ThemedText from '@/components/ThemedText';
import dtkColors from '@/constants/dtkColors';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/Colors';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from 'validator';

const Account = () => {

  const {t} = useTranslation();
  
  const [email, setEmail] = useState('')
  const [newemail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [newpassword, setNewPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  const [isEmailModalVisible, setEmailModalVisible] = useState(false)
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false)
  const sessionUserId = auth.currentUser?.uid
  const [loading, setLoading] = useState(false)

  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [textColor, setTextColor] = useState<any>()
  const [inputColor, setInputColor] = useState<any>()
  const [touchableOpColor, setTouchableOpColor] = useState<any>()
  const [sendButtonColor, setSendButtonColor] = useState<any>()
  const [deleteColor, setDeleteColor] = useState<any>()
  const [backgroundColor, setbackgroundColor] = useState<any>()
  const systemColorScheme = useColorScheme()
  
  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
      setTextColor(Colors[themeToSet ?? 'light'].text)
      setInputColor(Colors[themeToSet ?? 'light'].input)
      setTouchableOpColor(Colors[themeToSet ?? 'light'].input)
      setSendButtonColor(Colors[themeToSet ?? 'light'].button)
      setDeleteColor(Colors[themeToSet ?? 'light'].delete)
      setbackgroundColor(Colors[themeToSet ?? 'light'].background)
    }

     fetchColorTheme()
  }, [])
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const userId = await AsyncStorage.getItem('userId')
        if (!userId) {
          toast.warn(t("somethingWentWrong"))
          return
        }

        const docRef = doc(db, 'users', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()

          setEmail(data.email || '')
          setAgeGroup(data.ageGroup || '')
          setDateOfBirth(data.dateOfBirth || '')
        } else {
          toast.warn(t("somethingWentWrong"))
        }
      } catch (error: any) {
        toast.warn(t("somethingWentWrong"))
      } finally {
        setLoading(false);
      }
    }

    fetchUserData()
  }, [])
  
  if(!loading){

    async function handleUpdateEmail() {

      if (!sessionUserId || !newemail || !auth.currentUser) {
        return
      }

      if(!validator.isEmail(newemail)){
        toast.warn(t("invalidEmail"))
        return
      }

      try{    
        setEmail(newemail);
        await updateEmail(auth.currentUser, newemail)

        const userDocRef = doc(db, 'users', sessionUserId);
        await setDoc(userDocRef, { email: newemail },  { merge: true } )
        setEmailModalVisible(false);
        
        setNewEmail('');
        await AsyncStorage.removeItem('userId')
        auth.signOut()
        router.navigate("/(auth)/sign-in")
      } catch(error: any) {
        if (error.code === "auth/email-already-in-use"){
          toast.error(t("usersExists"))
        }
        else if (error.code === "auth/invalid-email"){
          toast.error(t("invalidEmail"))
        }
        else if (error.code === "auth/weak-password"){
          toast.error(t("invalidPassword"))
        } else {
          toast.warn(t("somethingWentWrong"))
        }
      } finally {}
    }
    
    async function handleUpdatePassword() {
      
      if (!sessionUserId || !newpassword || !auth.currentUser) {
        return
      }

      try{    
        setPassword(newpassword);
        setPasswordModalVisible(false);
        await updatePassword(auth.currentUser, newpassword)
        setNewPassword('');
        await AsyncStorage.removeItem('userId')
        router.navigate("/(auth)/sign-in")
      } catch(error: any){
        if (error.code === "auth/weak-password"){
          toast.error(t("invalidPassword"))
        } else {
          toast.warn(t("somethingWentWrong"))
        }
      }

    }

    async function handleAccountDeletetion(){

      try{
        if (!sessionUserId || !auth.currentUser) {
          return
        }

        const userDocRef = doc(db, 'users', sessionUserId);
        await deleteDoc(userDocRef);
        await auth.currentUser.delete();
        await AsyncStorage.removeItem('userId')
        auth.signOut()
        router.navigate("/(auth)/sign-up")

      } catch {
        toast.error(t("somethingWentWrong"))
      }
    }

  return (
    <View className='w-full h-full' style={{backgroundColor: backgroundColor}}>
    <ToastContainer closeOnClick pauseOnHover={false} limit={1} className={'pt-16'}/>
    <SafeAreaView 
      className="w-fit h-full px-12 pt-4 pr-12 flex-row flex-wrap place-self-center" 
      style={{backgroundColor: backgroundColor}}>
      <View className='h-[20%] w-[100%] gap-1 justify-center'>
        <Text className='font-JakartaBold' style={{color: textColor}}>{t("email")} : {email}</Text>
        <Text className='font-JakartaBold' style={{color: textColor}}>{t("ageGroup")} : {ageGroup}</Text>
        <Text className='font-JakartaBold' style={{color: textColor}}>{t("dateOfBirth")} : {dateOfBirth}</Text>
      </View>
      <ScrollView className='shadow-lg border-1 border-secondary-800 w-[100%] h-[80%] place-self-end'
        style={{backgroundColor: backgroundColor}}>
        <View className='flex-row p-4'>
          <Text className='flex-1 text-center text-xl font-JakartaBold p-4' style={{color: textColor}}>{t("userData")}</Text>
        </View>
        <View className='flex-row items-center justify-center p-1'>
          <TouchableOpacity 
            className='felx-1 w-[90%] h-10 rounded-full items-center justify-center' 
            style={{backgroundColor: touchableOpColor}}
            onPress={() => setEmailModalVisible(true)}>
            <Text style={{color: textColor}} className='font-JakartaMedium'>{t("emailMod")}</Text>
          </TouchableOpacity>

          <Modal 
            visible={isEmailModalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setEmailModalVisible(false)}>
            <View 
              style={{backgroundColor: backgroundColor}}
              className='flex p-4 rounded-xl shadow-2xl shadow-black self-center justify-center m-auto w-200 h-200 gap-6'>
              <Text style={{color: textColor}}>{t("email")}</Text>
              <TextInput 
                style={{backgroundColor: inputColor, color: textColor}}
                value={newemail} 
                onChangeText={setNewEmail} 
                keyboardType='email-address'
                className='text-lg font-JakartaSemiBold'/>
              <View className='justify-center items-center gap-4'>
                <TouchableOpacity 
                  style={{backgroundColor: sendButtonColor}} 
                  onPress={handleUpdateEmail}
                  className='p-2 rounded-full w-[50%] items-center'>
                  <Text style={{color: textColor}}>{t("send")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setEmailModalVisible(false)}
                  style={{backgroundColor: deleteColor}}
                  className='p-2 rounded-full w-[50%] items-center'>
                  <Text style={{color: textColor}}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal 
            visible={isPasswordModalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setPasswordModalVisible(false)}>
            <View 
              style={{backgroundColor: backgroundColor}}
              className='flex p-4 rounded-xl shadow-2xl shadow-black self-center justify-center m-auto w-200 h-200 gap-6'>
              <Text style={{color: textColor}}>{t("password")}</Text>
              <TextInput 
                style={{backgroundColor: inputColor, color: textColor}}
                value={newpassword} 
                secureTextEntry 
                onChangeText={setNewPassword} 
                className='text-lg font-JakartaSemiBold'/>
              <View className='justify-center items-center gap-4'>
                <TouchableOpacity 
                  style={{backgroundColor: sendButtonColor}} 
                  onPress={handleUpdatePassword}
                  className='p-2 rounded-full w-[50%] items-center'>
                  <Text style={{color: textColor}}>{t("send")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{backgroundColor: deleteColor}}
                  onPress={() => setPasswordModalVisible(false)}
                  className='bg-red-400 p-2 rounded-full w-[50%] items-center'>
                  <Text style={{color: textColor}}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
        <View className='flex-row items-center justify-center p-1'>
          <TouchableOpacity 
            style={{backgroundColor: inputColor}}
            onPress={() => setPasswordModalVisible(true)}
            className='felx-1 w-[90%] h-10 rounded-full  items-center justify-center'>
            <Text style={{color: textColor}} className='font-JakartaMedium'>{t("passMod")}</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row items-center justify-center p-1'>
          <TouchableOpacity 
            className='felx-1 w-[90%] h-10 rounded-full items-center justify-center'
            style={{backgroundColor: inputColor}}
            >
            <Text style={{color: textColor}} className='font-JakartaMedium'>{t("ageGroupChoose")}</Text>
          </TouchableOpacity>
        </View>
        <View className='flex-row items-center justify-center p-4'>
          <Text className='flex-1 text-center text-xl font-JakartaBold' style={{color: textColor}}>{t("accountData")}</Text>
        </View>
        <View className='flex-row items-center justify-center p-1'>
          <TouchableOpacity 
            style={{backgroundColor: deleteColor}}
            className='felx-1 w-[90%] h-10 rounded-full items-center justify-center'
            onPress={ handleAccountDeletetion }>
            <Text style={{color: textColor}} className='font-JakartaMedium'>{t("deleteAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  )
}
}

export default Account