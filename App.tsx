import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'react-native-gesture-handler';

import {ThemeProvider} from 'styled-components'

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';
import { Register } from './src/screens/Register';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  SplashScreen.preventAutoHideAsync()

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  if(!fontsLoaded) {
    return null
  }
  SplashScreen.hideAsync()

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AppRoutes />

          <StatusBar 
            animated={true}
            translucent
            barStyle={'light-content'}
            backgroundColor = {theme.colors.primary}
          />
        </NavigationContainer>
      </ThemeProvider>
    // </GestureHandlerRootView> 
  );
}


