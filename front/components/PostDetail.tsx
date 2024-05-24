import React from 'react';
import { View } from 'react-native';
import { Post } from '../models/Post';
import PostItem from '../components/PostItem';

const PostDetail = ({ route, navigation }: { route: any, navigation: any }) => {
  const { post, loggedInUserId } = route.params;

  const handleDeletePress = () => {
    navigation.goBack();
  }

  return (
    <View>
      <PostItem
        post={post}
        userId={loggedInUserId}
        onDeletePress={handleDeletePress}
        displayMode={true}
      />
    </View>
  );
};

export default PostDetail;
