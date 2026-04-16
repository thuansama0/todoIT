import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { TodoScreen, ProfileScreen, NotificationsScreen, CategoriesScreen } from "../screens"
import { useNavigation } from "@react-navigation/native"
export type TabParamList = {
    Todo : undefined
    Profile: undefined
    Notifications: undefined
    Categories: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

// 2. Tạo Component chứa các Tabs
export function TabNavigator() {
  return (
    <Tab.Navigator 
      initialRouteName="Todo"
      screenOptions={{
        headerShown: false, // Ẩn header của mỗi tab
      }}
    >
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ tabBarLabel: "Categories" }} 
      />
      <Tab.Screen 
        name="Todo" 
        component={TodoScreen} 
        options={{ tabBarLabel: "Todos" }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ tabBarLabel: "Notifications" }}  
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: "Profile" }} 
      />
    </Tab.Navigator>
  )
}