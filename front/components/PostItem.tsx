import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import { Post } from '../models/Post';
import { formatImagePath } from '../utils/FormatImagePath';
import { apiController as api } from '../api/api_controller';
import { User } from '../models/User';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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

  const extractSegments = (text: string) => {
    const regex = /(```\w*\n[\s\S]*?\n```)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      segments.push({
        type: 'code',
        content: match[0],
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return segments;
  };

  const renderSegment = (segment: { type: string; content: string }) => {
    if (segment.type === 'code') {
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
      const match = codeBlockRegex.exec(segment.content);
      if (match) {
        const language = match[1];
        const code = match[2];
        return (
          <SyntaxHighlighter key={segment.content} language={language} style={docco}>
            {code}
          </SyntaxHighlighter>
        );
      }
    } else {
      return <Text key={segment.content}>{segment.content}</Text>;
    }
  };

  const ownerProfilePictureUri = owner?.profileImg ? formatImagePath(owner.profileImg) : null;
  const segments = extractSegments(post.text);
  const postContent = (
    <View>
      <Image source={{ uri: formatImagePath(post.img) }} style={styles.postImage} />
      {segments.map(renderSegment)}
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
