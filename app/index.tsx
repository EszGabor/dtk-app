import React from 'react'
import { Redirect } from 'expo-router'
import '../services/i18n';


const index = () => {
  
  return <Redirect href={"/(auth)/sign-up"}/>
}

export default index
