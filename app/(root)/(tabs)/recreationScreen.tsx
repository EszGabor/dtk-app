import { StyleSheet, useColorScheme, View, ScrollView, FlatList, Image, Text, TouchableOpacity, ActivityIndicator, RefreshControl, ColorSchemeName } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Colors from '@/constants/Colors'
import { router } from 'expo-router';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiJson from '@/assets/api/api'
import { Checkbox } from 'react-native-paper';
import { FlashList } from "@shopify/flash-list";
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import * as Location from 'expo-location';
import getDistance from '@/utils/haversineDistance';

const recreationScreen = () => {
  const {t} = useTranslation();
  
  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const [textColor, setTextColor] = useState<any>()
  const [button, setButton] = useState<any>()
  const [cardbackground, setCardbackground] = useState<any>()
  const [backgroundColor, setbackgroundColor] = useState<any>()
  const systemColorScheme = useColorScheme()

  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
      setTextColor(Colors[themeToSet ?? 'light'].text)
      setButton(Colors[themeToSet ?? 'light'].button)
      setCardbackground(Colors[themeToSet ?? 'light'].cardBackground)
      setbackgroundColor(Colors[themeToSet ?? 'light'].background)
    }

     fetchColorTheme()
  }, [])
  /*
    useEffect(()=>{
      getProducts()
    }, [])
  
    const handleRefresh = () => {
      setRefreshing(true)
      getProducts()
      setRefreshing(false)
    }
  
    const getProducts = () => {
      //ide jön az iganzi api majd
      const URL = "https://fakestoreapi.com/products"
  
      fetch(URL).then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong")
        }
        return res.json()
      }).then((data) => {
        setProducts(data)
        setIsLoading(false)
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    }
  */
  
  //const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  //api json items
  interface Item {
    title: string
    location: string
    date: string
    shortDesc: string
    description: string
    image: string
    agegroup: string
    latitude: string
    longitude: string
  }  
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string[]>([])

  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null)
  
  const [sortByDistance, setSortByDistance] = useState<boolean>(false)

  const [visibleItems, setVisibleItems] = useState<Item[]>([])
  
  const [page, setPage] = useState(1)

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    )
  }
  const toggleAgeGroup = (ageGroup: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(ageGroup)
        ? prev.filter((item) => item !== ageGroup)
        : [...prev, ageGroup]
    )
  }
  const toggleLocation = (location: string) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    )
  }
  const toggleSortByDistance = (value: string) => {
    if (value === "nearest") {
      setSortByDistance((prev) => !prev)
    }
  }

  let filteredApiJson = apiJson.filter((item: Item) => {

    const categoryMatch = selectedCategories.length
      ? selectedCategories.includes(item.shortDesc.toLowerCase())
      : true
  
    const ageGroupMatch = selectedAgeGroups.length
      ? selectedAgeGroups.includes(item.agegroup.toLowerCase())
      : true
      
    const locationMatch = selectedLocation.length
      ? selectedLocation.includes(item.location)
      : true
  
    return categoryMatch && ageGroupMatch && locationMatch
  })

  if (sortByDistance && location) {
    filteredApiJson = filteredApiJson.sort((a, b) => {
      const distanceA = getDistance(location.latitude, location.longitude, parseFloat(a.latitude), parseFloat(a.longitude))
      const distanceB = getDistance(location.latitude, location.longitude, parseFloat(b.latitude), parseFloat(b.longitude))
      return distanceA - distanceB
    })
  }

  //infinite scroll
  useEffect(() => {
    setPage(1)
    setVisibleItems(filteredApiJson.slice(0, 6))
  }, [selectedCategories, selectedAgeGroups, selectedLocation, sortByDistance])
  
  const loadMoreItems = () => {
    if (visibleItems.length < filteredApiJson.length) {
      setPage((prevPage) => prevPage + 1)
      setVisibleItems((prevItems) => [
        ...prevItems,
        ...filteredApiJson.slice(prevItems.length, prevItems.length + 6),
      ])
    }
  }
  //inf scroll

  //accordion
  const SECTIONS = [
    {
      title: t("events"),
      content: [
        { label: "Sport", value: "sport" },
        { label: "Programozás", value: "programozás" },
        { label: "Verseny", value: "verseny" },
        { label: "Nyílt nap", value: "nyílt nap" },
        { label: "Látnivalók", value: "látnivalók" },
      ],
      type: "category",
    },
    {
      title: t("ageGroup"),
      content: [
        { label: "10-12", value: "10-12" },
        { label: "13-14", value: "13-14" },
        { label: "15-16", value: "15-16" },
        { label: "17-19", value: "17-19" },
        { label: "20-25", value: "20-25" },
        { label: "25+", value: "25+" },
      ],
      type: "ageGroup",
    },
    {
      title: t("location"),
      content: [
        { label: "Szeged", value: "Szeged" },
        { label: "Pécs", value: "Pécs" },
        { label: "Visegrád", value: "Visegrád" },
        { label: "Esztergom", value: "Esztergom" },
        { label: "Budapest", value: "Budapest" },
        { label: "Székesfehérvár", value: "Székesfehérvár" },
        { label: "Debrecen", value: "Debrecen" },
        { label: "Szombathely", value: "Szombathely" },
        { label: "Veszprém", value: "Veszprém" },
        { label: "Győr", value: "Győr" },
      ],
      type: "location",
    },
    {
      title: t("sort"),
      content: [
        { label: t("sortCloseEvents"), value: "nearest" },
      ],
      type: "sortByDistance",
    }
  ]
  
  const [activeSections, setActiveSections] = useState<number[]>([])
  
  const renderHeader = (section: any, _: any, isActive: boolean) => (
    <View style={{ backgroundColor: cardbackground, padding: 10, borderBottomWidth: 1, borderBottomColor: "gray" }}>
      <Text className='font-JakartaSemiBold text-center' style={{ color: textColor }}>{section.title}</Text>
    </View>
  )
  
  const renderContent = (section: any) => (
    <View className='p-4 flex-wrap' style={{ backgroundColor: cardbackground }}>
      {section.content.map((item: any) => (
        <View key={item.value} className="flex-row items-center flex-wrap">
          <Checkbox
            status={
              section.type === "category" && selectedCategories.includes(item.value)
                ? "checked"
                : section.type === "ageGroup" && selectedAgeGroups.includes(item.value)
                ? "checked"
                : section.type === "location" && selectedLocation.includes(item.value)
                ? "checked"
                : section.type === "sortByDistance" && sortByDistance && item.value === "nearest"
                ? "checked"
                : "unchecked"
            }
            onPress={() => {
              if (section.type === "category") toggleCategory(item.value)
              else if (section.type === "ageGroup") toggleAgeGroup(item.value)
              else if (section.type === "location") toggleLocation(item.value)
              else if (section.type === "sortByDistance") toggleSortByDistance(item.value)
            }}
          />
          <Text style={{ color: textColor }}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
  //end of accordion

  //location
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        toast.warn(t("locationReq"))
        return
      }

      const userLocation = await Location.getCurrentPositionAsync({})
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude
      })

    }

    getLocation()
  }, [])
  //end of location

  if(isLoading){
    return (
      <ActivityIndicator color="black" size="large"/>
    )
  } else {
    return (
    <View className='flex-1 w-full h-full' style={{backgroundColor: backgroundColor}} /*refreshControl={<RefreshControl refreshing={refreshing}*/ /*onRefresh={handleRefresh}/>}*/>
    <ToastContainer closeOnClick pauseOnHover={false} limit={1} className={''}/>
    <View className='flex-1 h-full w-full grid grid-cols-1 lg:grid-cols-3 p-4' style={{backgroundColor: backgroundColor}}>
      
      {/*filters*/}
      <View className='flex-1 w-full h-full flex-grow border-1 border-slate-800 pb-4' style={{backgroundColor: cardbackground }}> 
        <Accordion
          renderAsFlatList={true}
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={setActiveSections}
        />
      </View>
      {/*end of filters*/}

      <View className='flex-1 h-full w-full col-span-2 border-1 border-slate-800 p-4' style={{backgroundColor: backgroundColor}}>

        <FlashList showsVerticalScrollIndicator={false} data={visibleItems} renderItem={({ item })=>
          <View className='flex-col lg:flex-row place-self-center lg:place-self-start border-1 border-slate-800'>
            <Image source={ item.image /*{ uri: item.image }*/} style={{ width: 300, height: 300 }} className='place-self-center'/>
            <View className='flex-1'>
              <Text className='text-2xl font-JakartaBold p-4' style={{color: textColor}}>{item.title} [{item.shortDesc}]</Text>
              
              {location ? (
                <Text className='text-1xl font-JakartaSemiBold px-5' style={{color: textColor}}>
                  {item.location} - {Math.round(getDistance(location.latitude, location.longitude, Number(item.latitude), Number(item.longitude)))} km
                </Text>
              ) : (
                <Text className='text-1xl font-JakartaSemiBold px-5' style={{color: textColor}}>
                  {item.location}
                </Text>
              )}

              <Text className='text-1xl font-JakartaSemiBold px-5' style={{color: textColor}}>{item.date}</Text>
              <Text className='text-1xl font-JakartaSemiBold px-5' style={{color: textColor}}>{t("ageGroup")}: {item.agegroup}</Text>
              <Text className='text-1xl font-JakartaLight p-5' style={{color: textColor}}>{item.description}</Text>
              <TouchableOpacity className='h-10 m-10 justify-center rounded-lg' style={{backgroundColor: button}}>
                <Text className='text-1xl font-JakartaMedium text-center' style={{color: textColor}}>{t("goToEvent")}</Text>
              </TouchableOpacity>
            </View>
          </View>}
          estimatedItemSize={100}
          scrollEnabled={true}
          onEndReachedThreshold={1}
          onEndReached={loadMoreItems}
          ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="black" /> : null}
        /> {/*end of FlatList*/}
        
      </View>
    </View>
    </View>
  )
}
}

export default recreationScreen