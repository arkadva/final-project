import React, { useState } from 'react';
import { Alert, View, TextInput, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { apiController as api } from '../api/api_controller';
import { User } from '../models/User';
import axios from 'axios';

const EditProfile = ({ route, navigation }: { route: any, navigation: any }) => {
  const { user } = route.params;
  const [name, setUsername] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileImg] = useState(user.profileImg);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const updatedUser: Partial<User> = { name, email, profileImg };

    try {
      setLoading(true);
      const response = await api.editUser(user._id, updatedUser);
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      let errorMessage = 'An error occurred while updating the profile.';

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error updating profile:', error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Profile</Text>
      <TextInput 
        value={name} 
        onChangeText={setUsername} 
        placeholder="Name" 
        style={styles.textInput} 
      />
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Email" 
        style={styles.textInput} 
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Save" onPress={handleSave} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  textInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});

export default EditProfile;
