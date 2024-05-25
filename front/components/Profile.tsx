import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback } from 'react';
import { View, Text, Image, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { apiController as api } from '../api/api_controller';
import { User } from '../models/User';
import { formatImagePath } from '../utils/FormatImagePath';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const userProfile = await api.getUserProfile(userId);
        setUser(userProfile);
      } else {
        throw new Error('User ID not found');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUser();
      };
      loadData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['jwtToken', 'refreshToken', 'userId']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
        <Button title="Retry" onPress={fetchUser} />
      </View>
    );
  }

  const profilePictureUri = user.profileImg ? formatImagePath(user.profileImg) : null;

  return (
    <View style={styles.container}>
      {profilePictureUri && (
        <Image source={{ uri: profilePictureUri }} style={styles.profilePicture} />
      )}
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile', { user })} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    marginBottom: 8,
  },
});

export default Profile;
