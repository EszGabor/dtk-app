import { View, Text, TextInput, TextProps, useColorScheme, TouchableOpacity, TextInputProps } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'

const ThemedTextInput = ({ style, children, ...rest}: TextInputProps) => {
    const colorScheme = useColorScheme()
    const input = Colors[colorScheme ?? 'light'].input
    const text = Colors[colorScheme ?? 'light'].text

  return (
    <TextInput placeholderTextColor="rgba(0, 0, 0, 0.5)" style={[style, { backgroundColor: input, color: text} ]} {...rest}>
        {children}
    </TextInput>
  )
}

export default ThemedTextInput