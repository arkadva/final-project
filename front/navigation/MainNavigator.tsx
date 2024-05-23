import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../components/Login';
import Register from '../components/Register';
import PostFeed from '../components/PostFeed';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  function MainTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={PostFeed} />
      </Tab.Navigator>
    );
  }
};

export default MainNavigator;
