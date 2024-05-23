import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, Alert } from 'react-native';
import { apiController as api } from '../api/api_controller';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const Register = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username || !email || !password || !profilePicture) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', username);
    formData.append('email', email);
    formData.append('password', password);

    const uriParts = profilePicture.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('profileImg', {
      uri: profilePicture,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await api.register(formData);
      //console.log('Server Response:', response);
      Alert.alert('Success', 'Registration successful. Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration Error Response:', error.response?.data);
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        Alert.alert('Error', errorMessage);
      } else {
        console.error('Registration Error:', error);
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Upload Profile Picture" onPress={pickImage} />
      {profilePicture && <Image source={{ uri: profilePicture }} style={{ width: 100, height: 100 }} />}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
