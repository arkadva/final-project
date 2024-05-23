import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const PostFeed = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
