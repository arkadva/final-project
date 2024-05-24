import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiController as api } from '../api/api_controller';
import { Post } from '../models/Post';
import { useFocusEffect } from '@react-navigation/native';
import PostItem from '../components/PostItem';

const PostFeed = ({ navigation }: { navigation: any }) => {
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
      Alert.alert('Error', 'Failed to fetch user ID. Please try again.');
    }
  };

  const fetchPosts = async () => {
    try {
      const posts = await api.getPosts();
      setPosts(posts);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts. Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUserId();
        await fetchPosts();
        setLoading(false);
      };
      loadData();
    }, [])
  );

  const handleDeletePost = (deletedPostId: string) => {
    setPosts((prevPosts) => prevPosts.filter(post => post._id !== deletedPostId));
  };


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
            onDeletePress={() => handleDeletePost(item._id)}
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

export default PostFeed;
