import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { TabNavigator } from "./TabNavigator"
import type { TabParamList } from "./TabNavigator"

export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  MainTabs: NavigatorScreenParams<TabParamList> | undefined
  NewTodo: undefined
  TodoDetail: undefined
  NewCategory: undefined
  EditCategory: undefined
  EditTodo: undefined
  NotificationDetail: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
    >
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
          <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="NewTodo" component={Screens.NewTodoScreen} />
          <Stack.Screen name="TodoDetail" component={Screens.TodoDetailScreen} />
          <Stack.Screen name="NewCategory" component={Screens.NewCategoryScreen} />
          <Stack.Screen name="EditCategory" component={Screens.EditCategoryScreen} />
          <Stack.Screen name="EditTodo" component={Screens.EditTodoScreen} />
          <Stack.Screen name="NotificationDetail" component={Screens.NotificationDetailScreen} />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
