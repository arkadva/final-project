import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import * as GoogleSignIn from 'expo-google-sign-in';
import { Platform } from 'react-native';
import MainNavigator from './navigation/MainNavigator';

const App = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
