import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'react-native-gesture-handler';

import {ThemeProvider} from 'styled-components'

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';

import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import { SignIn } from './src/screens/Signin';

import { AuthProvider } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'



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
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          {/* <AppRoutes /> */}
        <AuthProvider>
          <SignIn />
        </AuthProvider>

          <StatusBar 
            animated={true}
            translucent
            barStyle={'light-content'}
            backgroundColor = {theme.colors.primary}
          />
        </NavigationContainer>
      </ThemeProvider>
  );
}


