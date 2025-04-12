import { ColorSchemeName, Keyboard, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Colors from '@/constants/Colors'
import { ToastContainer, toast } from 'react-toastify'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import dtkColors from '@/constants/dtkColors'
import Groq from 'groq-sdk'

const helpScreen = () => {
  
  const {t} = useTranslation()

  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [textColor, setTextColor] = useState<any>()
  const [inputColor, setInputColor] = useState<any>()
  const [touchableOpColor, setTouchableOpColor] = useState<any>()
  const [sendButtonColor, setSendButtonColor] = useState<any>()
  const [deleteColor, setDeleteColor] = useState<any>()
  const [backgroundColor, setbackgroundColor] = useState<any>()
  const systemColorScheme = useColorScheme()
  
  const scrollViewRef = useRef<ScrollView>(null)

  const groq = new Groq({
    apiKey: process.env.EXPO_PUBLIC_GROQ_AI,
    dangerouslyAllowBrowser: true,
  })

  const mentalHealthContacts = [
    {
      name: "Kék Vonal",
      phone: "116 111",
      url: "https://kekvonal.hu/",
      description: "Help for children and young people experiencing bullying, abuse, or emotional distress.",
    },
    {
      name: "Mentalhigiene – Pannon Egyetem",
      url: "mentalhigiene@uni-pannon.hu",
      description: "University-based life counseling service only for students in Veszprém.",
    },
    {
      name: "Lelki Elsősegély Telefonszolgálat",
      phone: "116 123",
      url: "https://sos116123.hu/",
      description: "24/7 emotional support and crisis line across Hungary.",
    },
    {
      name: "Veszprémi Családsegítő és Gyermekjóléti Szolgálat",
      phone: "06 88 402 530",
      url: "https://veszpremcssk.hu/",
      description: "Family and child welfare services in Veszprém.",
    }
  ]
  
  const dummy = [
    {
      role: 'ai',
      content: 'Hi! How can I help you today?',
    }
  ]
  const [messages, setMessages] = useState(dummy)
  const [userMessage, setUserMessage] = useState('')

  //theme
  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme
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
  
  //contacts formating
  const formatContacts = (contacts: typeof mentalHealthContacts) => {
    return contacts.map(contact => {
      return `${contact.name}: ${contact.phone} — ${contact.url} (${contact.description})`
    }).join('\n')
  }

  const contactInstructions = 
  `
  Only provide responses based on the [list] bellow related to the user's mental health concerns.
  
  [list]:${formatContacts(mentalHealthContacts)}

  DO NOT RECOMMEND ANY contacts outside the provided [list]!!!
  `
  //AI
  const handleMessage = async () => {
    
    if (userMessage.trim()) {

      // User messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
      ])
      setUserMessage('')
  
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            //contacts referance for the ai
            { role: 'system', content: contactInstructions },
            
            { role: 'user', content: userMessage },
          ],
          model: 'llama3-8b-8192',
          //model: 'Llama-3.2-11b-text-preview'
        })
  
        //Ai messages
        const responseContent = chatCompletion.choices?.[0]?.message?.content || 'No response'
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'ai', content: responseContent },
        ])
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'ai', content: 'Error fetching AI response.' },
        ])
      }
    }
  }

  return (
    <View className='w-full h-full' style={{backgroundColor: backgroundColor}}>
    <ToastContainer closeOnClick pauseOnHover={false} className={'pt-16'} limit={1}/>
      <SafeAreaView className='flex-1 flex mx-5'>

      {
        messages.length>0? (
          <View className=' flex-1 mb-20'>
            <Text className=' p-4 w-full max-w-2xl place-self-center' style={{color: textColor}}>Assistant</Text>
            <View className='h-[100%] w-full rounded-3xl p-4 max-w-2xl place-self-center' style={{backgroundColor: backgroundColor}}>
              <ScrollView 
                ref={scrollViewRef} // Set ref correctly
                onContentSizeChange={() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true })
                }}
                bounces={false} showsVerticalScrollIndicator={false}>
                <View className='space-y-4'>
                {
                  messages.map((message, index)=> {
                    if(message.role=='ai'){
                      return (  //ai response
                        <View key={index} className='flex-row justify-start '>
                          <View className='rounded-xl rounded-tl-none p-2 w-fit max-w-lg' style={{backgroundColor: dtkColors.dtk_main_light}}>
                            <Text className='font-JakartaLight' style={{color: textColor}}>{message.content}</Text>
                          </View>
                        </View>
                      )
                    } else {
                      return (  //user respone
                        <View key={index} className='flex-row justify-end'>
                          <View className='rounded-xl rounded-tr-none p-2 w-fit max-w-lg'style={{backgroundColor: inputColor}}>
                            <Text className='font-JakartaLight max-w-lg' style={{color: textColor}}>{message.content}</Text>
                          </View>
                        </View>
                      )
                    }
                  })
                }
                </View>
              </ScrollView>
            </View>

          </View>
        ): (
          <View>
              {/*hello screen*/}
          </View>
        )
      }

      <View className='flex pb-4'>
        {/*Text Input*/}
        <TextInput className= 'shadow-lg rounded-xl font-JakartaLight flex-1 w-full max-w-2xl p-4 place-self-center'
          style={{color: textColor, backgroundColor: inputColor}}
          placeholder='...'
          value={userMessage}
          onSubmitEditing={handleMessage}
          onChangeText={setUserMessage}
        />
      </View>

      </SafeAreaView>
  </View>
  )
}

export default helpScreen