import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { apiController as api } from '../api/api_controller';
import { Post } from '../models/Post';
import axios from 'axios';
import { formatImagePath } from '../utils/FormatImagePath';

const EditPost = ({ route, navigation }: { route: any, navigation: any }) => {
  const { post, onGoBack } = route.params;
  const [text, setText] = useState(post.text);
  const [image] = useState(post.img);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!text && !image) {
      Alert.alert("Error", "Either text or image must be provided.");
      return;
    }

    const updatedPost: Post = { ...post, text, img: image };

    try {
      setLoading(true);
      const response = await api.updatePost(updatedPost);
      Alert.alert('Success', 'Post updated successfully.');
      navigation.navigate('Feed', { updatedPost });
      if (onGoBack) onGoBack();
    } catch (error) {
      let errorMessage = 'An error occurred while updating the post.';

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Error updating post:', error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Post</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Post text"
        style={styles.textInput}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      {image && <Image source={{ uri: formatImagePath(image) }} style={styles.image} />}
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
    textAlignVertical: 'top',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
});

export default EditPost;
