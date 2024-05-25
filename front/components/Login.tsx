import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { CodeChallengeMethod, useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiController as api } from '../api/api_controller';

WebBrowser.maybeCompleteAuthSession();

interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

const Login = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const discovery = {
    authorizationEndpoint: `https://accounts.google.com/o/oauth2/v2/auth`,
    tokenEndpoint: `https://oauth2.googleapis.com/token`,
    revocationEndpoint: `https://oauth2.googleapis.com/revoke`
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '53136314046-aaoed1156rc7sj196qqjju2f48p1030l.apps.googleusercontent.com',
      redirectUri: makeRedirectUri({
        scheme: 'finalprojectfront',
      }),
      scopes: ['email', 'profile'],
      responseType: 'code'
    },
    discovery
  );

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        navigation.navigate('Main');
      }
    };

    checkToken();
  }, [navigation]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleGoogleSignIn(access_token);
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await api.login(email, password);
      const decoded: DecodedToken = jwtDecode<DecodedToken>(data.token);
      console.log(data);

      await AsyncStorage.setItem('jwtToken', data.token);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('userId', decoded.userId);

      navigation.navigate('Main');
    } catch (error: any) {
      console.error('Login Error', error);
      Alert.alert('Login Error', 'Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (token: string) => {
    try {
      setLoading(true);
      const data = await api.googleLogin(token);
      const decoded: DecodedToken = jwtDecode<DecodedToken>(data.token);

      await AsyncStorage.setItem('jwtToken', data.token);
      await AsyncStorage.setItem('userId', decoded.userId);

      navigation.navigate('Main');
    } catch (error: any) {
      console.error('Google Sign-In Error', error);
      Alert.alert('Google Sign-In Error', 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
      <Button title="Sign In with Google" disabled={!request} onPress={() => promptAsync()} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  );
};

export default Login;
