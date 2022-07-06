import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'react-native-gesture-handler';

import {ThemeProvider} from 'styled-components'

import { Routes } from './src/routes';

import { LogBox } from "react-native";

import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';

import { AuthProvider, useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

export default function App() {
  SplashScreen.preventAutoHideAsync()

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { userStorageLoading } = useAuth()

  if(!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }
  SplashScreen.hideAsync()

  return (
      <ThemeProvider theme={theme}>

          {/* <AppRoutes /> */}
        <AuthProvider>
          <Routes />
        </AuthProvider>

          <StatusBar 
            animated={true}
            translucent
            barStyle={'light-content'}
            backgroundColor = {theme.colors.primary}
          />
       
      </ThemeProvider>
  );
}


