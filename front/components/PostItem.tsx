import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { Post } from '../models/Post';
import { formatImagePath } from '../utils/FormatImagePath';
import { apiController as api } from '../api/api_controller';
import { User } from '../models/User';

interface PostItemProps {
  post: Post;
  userId: string | null;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  displayMode?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, userId, onPress, onEditPress, onDeletePress, displayMode }) => {
  const [owner, setOwner] = useState<User | null>(null);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const ownerData = await api.getUserProfile(post.owner);
        setOwner(ownerData);
      } catch (error) {
        console.error('Failed to fetch owner:', error);
      }
    };
    fetchOwner();
  }, [post.owner]);

  const handleDelete = async () => {
    try {
      await api.deletePost(post._id);
      if (onDeletePress) {
        onDeletePress();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      Alert.alert('Error', 'Failed to delete the post. Please try again later.');
    }
  };

  const ownerProfilePictureUri = owner?.profileImg ? formatImagePath(owner.profileImg) : null;
  const postContent = (
    <View>
      <Image source={{ uri: formatImagePath(post.img) }} style={styles.postImage} />
      <Text>{post.text}</Text>
      <Text>Created at: {post.createdAt}</Text>
      {owner && (
        <View style={styles.ownerInfo}>
          {ownerProfilePictureUri && (
            <Image source={{ uri: ownerProfilePictureUri }} style={styles.ownerImage} />
          )}
          <Text>{owner.name} ({owner.email})</Text>
        </View>
      )}
      {userId === post.owner && (
        <View style={styles.actions}>
          {onEditPress && (
            <Button title="Edit" onPress={onEditPress} />
          )}
          <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
      )}
    </View>
  );

  if (displayMode) {
    return postContent;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      {postContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postImage: {
    width: 100,
    height: 100,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ownerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default PostItem;
