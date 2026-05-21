import React from "react"
import { Platform, StyleSheet, View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { colors, typography } from "app/theme"
import { translate } from "app/i18n"

import { TodoScreen, ProfileScreen, NotificationsScreen, CategoriesScreen } from "../screens"

export type TabParamList = {
  Todo: undefined
  Profile: undefined
  Notifications: undefined
  Categories: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()
const TAB_BAR_HEIGHT = 95
const TAB_BAR_PADDING_BOTTOM = 35

const $focusedTabIconPill = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.palette.primary900,
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 56,
  },
})

export function TabNavigator() {
  return (
    <Tab.Navigator
      // Android mặc định detach tab không focus → unmount màn → useEffect/loadIfNeeded chạy lại mỗi lần vào tab.
      detachInactiveScreens={false}
      initialRouteName="Todo"
      screenOptions={({ route }) => ({
        headerShown: false,
        // lazy: false đã gây mount đồng thời mọi tab ẩn → khung 0px → FlashList cảnh báo / lỗi đo kích thước.
        ...(Platform.OS === "android" ? { freezeOnBlur: false } : {}),
        tabBarActiveTintColor: colors.palette.primary700,
        tabBarInactiveTintColor: colors.palette.gray500,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap
          // todo : su khac nha 2= vaf 3=
          if (route.name === "Categories") {
            iconName = focused ? "pricetag" : "pricetag-outline"
          } else if (route.name === "Todo") {
            iconName = focused ? "checkbox" : "checkbox-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else {
            iconName = "help-outline"
          }

          if (focused) {
            return (
              <View style={$focusedTabIconPill.container}>
                <Ionicons name={iconName} size={size} color={color} />
              </View>
            )
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: typography.primary.bold,
          marginTop: 5,
        },

        tabBarStyle: {
          height: TAB_BAR_HEIGHT,
          paddingBottom: TAB_BAR_PADDING_BOTTOM,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: translate("tabs.categories") }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{ tabBarLabel: translate("tabs.todos") }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: translate("tabs.notifications") }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: translate("tabs.profile") }}
      />
    </Tab.Navigator>
  )
}
