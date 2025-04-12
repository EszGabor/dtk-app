import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Children, useState, Text } from "react";
import { View } from "react-native";
import { DrawerLayout, Switch } from "react-native-gesture-handler";

const Drawer = createDrawerNavigator()

export default function CustomDrawerContent(props: any){
    
    const [switchState, setSwitchState] = useState(false);
    
    return (
        
    <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <View className="flex-row">
            {/* <MaterialIcons name="invert-colors" size={24} style={{ opacity: 0.5 }}/> */}
            <Switch value={switchState} onValueChange={() => setSwitchState(!switchState)} />
        </View>
    </DrawerContentScrollView>
    )
}