import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token || null);  // Set userToken from AsyncStorage
    };

    getToken(); // Get user token when the component mounts
  }, []);

  console.log('user token is here----------////;;;;;', userToken);

  // Define a mapping of images to dynamic content
  const imageContentMap = {
    'nature': 'Exploring the beauty of nature!',
    'city': 'City lights and urban vibes!',
    'technology': 'Latest trends in technology.',
    'food': 'Delicious food to satisfy your cravings!',
    'music': 'Enjoying some good music!',
  };

  // Generate posts with dynamic content based on images
  const generatePosts = () => {
    const posts = [
      { id: '1', user: 'Mohit', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', imageUrl: 'https://picsum.photos/800/600?image=10' }, // Nature
      { id: '2', user: 'Piyush', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', imageUrl: 'https://picsum.photos/800/600?image=20' }, // City
      { id: '3', user: 'Yours_vinayy', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', imageUrl: 'https://picsum.photos/800/600?image=30' }, // Technology
      { id: '4', user: 'Johan', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', imageUrl: 'https://picsum.photos/800/600?image=40' }, // Food
      { id: '5', user: 'Rohan', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', imageUrl: 'https://picsum.photos/800/600?image=50' }, // Music
    ];

    return posts.map(post => {
      const keyword = post.imageUrl.split('?')[1];
      const content = imageContentMap[keyword] || 'Here is a post!';

      return {
        ...post,
        content,
      };
    });
  };

  const [posts, setPosts] = useState(generatePosts());

  const handleLike = (postId) => {
    console.log(`Liked post with ID: ${postId}`);
  };

  const handleComment = (postId) => {
    console.log(`Commented on post with ID: ${postId}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.user}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.postContent}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
  );

  // Handle login/logout button press
  const handleLoginPress = async () => {
    if (userToken) {
      // Logout and clear AsyncStorage
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      navigation.navigate('LoginScreen'); // Navigate to the login screen
    } else {
      navigation.navigate('LoginScreen'); // Navigate to the login screen
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>{userToken ? "Logout" : "Login"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.postList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#333',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#ff8c00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postList: {
    paddingHorizontal: 10,
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color:'black'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color:'black'
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    padding: 10,
  },
  postContent: {
    padding: 10,
  },
  content: {
    marginTop: 5,
    color: '#333',
  },
});

export default HomeScreen;
