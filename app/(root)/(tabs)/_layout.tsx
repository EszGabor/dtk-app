import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ColorSchemeName, useColorScheme } from 'react-native';
import "@/global.css";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  
  const {t} = useTranslation();
  
  const [theme, setTheme] = useState<"dark" | "light" | ColorSchemeName>();
  const systemColorScheme = useColorScheme()

  useEffect(() => {
    const fetchColorTheme = async () => {
      const currentTheme = await AsyncStorage.getItem('theme')
      const themeToSet = currentTheme === 'dark' || currentTheme === 'light' ? currentTheme : systemColorScheme;
      setTheme(themeToSet)
      
    }

     fetchColorTheme()
  }, [])

  return (
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="recreationScreen" options={{ headerTitle: t("recTitle") }} />
        <Stack.Screen name="socialScreen" options={{ headerTitle: "" }} />
        <Stack.Screen name="mapScreen" options={{ headerTitle: "" }} />
        <Stack.Screen name="helpScreen" options={{ headerTitle: "" }} />
      </Stack>
      </ThemeProvider>
  );
}

export default Layout