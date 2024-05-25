import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiController as api } from '../api/api_controller';
import { Post } from '../models/Post';
import { useFocusEffect } from '@react-navigation/native';
import PostItem from '../components/PostItem';

const MyPosts = ({ navigation }: { navigation: any }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      if (userId) {
        const userPosts = await api.getPostsByUserId(userId);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      Alert.alert('Error', 'Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchPosts();
      }
    }, [userId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create New Post" onPress={() => navigation.navigate('CreatePost', { userId, onGoBack: fetchPosts })} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            userId={userId}
            onPress={() => navigation.navigate('PostDetail', { post: item, loggedInUserId: userId })}
            onEditPress={() => navigation.navigate('EditPost', { post: item, onGoBack: fetchPosts })}
          />
        )}
      />
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
    padding: 10,
  },
});

export default MyPosts;
