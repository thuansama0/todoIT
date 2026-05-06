import React from "react"
import { View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons" 
import { colors, typography } from "app/theme"


import { TodoScreen, ProfileScreen, NotificationsScreen, CategoriesScreen } from "../screens"

export type TabParamList = {
    Todo: undefined
    Profile: undefined
    Notifications: undefined
    Categories: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

export function TabNavigator() {
  return (
    <Tab.Navigator 
      initialRouteName="Todo"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.palette.info500, 
        tabBarInactiveTintColor: colors.palette.gray500, 
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Categories') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Todo') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline'; 
          }

          if (focused) {
            return (
              <View style={{ 
                backgroundColor: colors.palette.secondary100, 
                width: 56,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarLabelStyle: {
          fontSize: 12, 
          fontFamily: typography.primary.semiBold, 
          marginTop: 5,
        },
        
        tabBarStyle: {
          height: 95, 
          paddingBottom: 35,
          paddingTop: 10, 
        }
      })}
    >
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: "Categories" }} />
      <Tab.Screen name="Todo" component={TodoScreen} options={{ tabBarLabel: "Todos" }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ tabBarLabel: "Notifications" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  )
}