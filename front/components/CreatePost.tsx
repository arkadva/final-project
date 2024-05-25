import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { apiController as api } from '../api/api_controller';
import { Post } from '../models/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CreatePost = ({ navigation, route }: { navigation: any, route: any }) => {
  const { onGoBack } = route.params;
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          throw new Error('User ID not found');
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
        Alert.alert('Error', 'Failed to fetch user ID. Please try again.');
      }
    };

    fetchUserId();
  }, []);

  const handleSave = async () => {
    if (!image) {
      Alert.alert("Error", "Image is required.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    const newPostData = new FormData();
    newPostData.append('text', text);
    newPostData.append('owner', userId);
    newPostData.append('createdAt', new Date().toISOString());

    const uriParts = image.split('.');
    const fileType = uriParts[uriParts.length - 1];

    newPostData.append('img', {
      uri: image,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    try {
      setLoading(true);
      await api.createPost(newPostData);
      if (onGoBack) onGoBack();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
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
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Post</Text>
      <TextInput
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
        style={styles.textInput}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Save" onPress={handleSave} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    borderRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default CreatePost;
