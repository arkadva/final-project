import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../components/Login';
import Register from '../components/Register';
import PostFeed from '../components/PostFeed';
import MyPosts from '../components/MyPosts';
import Profile from '../components/Profile';
import EditPost from '../components/EditPost';
import EditProfile from '../components/EditProfile';
import CreatePost from '../components/CreatePost';
import PostDetail from '../components/PostDetail';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="EditPost" component={EditPost} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  function MainTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Feed">
          {props => <PostFeed {...props} />}
        </Tab.Screen>
        <Tab.Screen name="My Posts">
          {props => <MyPosts {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {props => <Profile {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
};

export default MainNavigator;
