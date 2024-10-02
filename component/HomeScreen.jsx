import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [userToken, setUserToken] = useState(null);
  const [likes, setLikes] = useState({}); // For storing likes

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token || null);
    };

    const getLikes = async () => {
      const storedLikes = await AsyncStorage.getItem('likes');
      setLikes(storedLikes ? JSON.parse(storedLikes) : {});
    };

    getToken();
    getLikes(); // Get stored likes on component mount
  }, []);

  // Define posts with dynamic content based on images
  const generatePosts = () => {
    const posts = [
      {
        id: '1',
        user: 'Mohit',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        imageUrl: 'https://picsum.photos/800/600?image=10',
        description: 'Exploring the beautiful landscapes of nature. Breathtaking views and peaceful surroundings!'
      },
      {
        id: '2',
        user: 'Piyush',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        imageUrl: 'https://picsum.photos/800/600?image=20',
        description: 'Capturing the energy and vibrancy of the city. The hustle and bustle never gets old!'
      },
      {
        id: '3',
        user: 'Yours_vinayy',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        imageUrl: 'https://picsum.photos/800/600?image=30',
        description: 'Staying ahead in the tech world! Here’s a glimpse of the latest technology trends.'
      },
      {
        id: '4',
        user: 'Johan',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        imageUrl: 'https://picsum.photos/800/600?image=40',
        description: 'Delicious food and good vibes! Trying out a new dish at my favorite restaurant.'
      },
      {
        id: '5',
        user: 'Rohan',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        imageUrl: 'https://picsum.photos/800/600?image=50',
        description: 'Music is life! Here’s me jamming to some tunes and getting lost in the rhythm.'
      },
    ];
    

    return posts;
  };

  const [posts, setPosts] = useState(generatePosts());

  // Handle like functionality
  const handleLike = async (postId) => {
    const newLikes = { ...likes, [postId]: !likes[postId] };
    setLikes(newLikes);
    await AsyncStorage.setItem('likes', JSON.stringify(newLikes));
  };

  // Handle comment functionality
  const handleComment = (postId) => {
    navigation.navigate('CommentsScreen', { postId });
  };

  // Handle share functionality
  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `${item.user}'s post: ${item.imageUrl}`,
      });
    } catch (error) {
      console.error('Error sharing the post:', error);
    }
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
          <Ionicons name={likes[item.id] ? "heart" : "heart-outline"} size={24} color={likes[item.id] ? "red" : "#333"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare(item)} style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.postContent}>
        {/* <Text style={styles.username}>{item.user}</Text> */}
        <Text style={styles.content}>{item.description}</Text>
      </View>
    </View>
  );

  // Handle login/logout button press
  const handleLoginPress = async () => {
    if (userToken) {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      navigation.navigate('LoginScreen');
    } else {
      navigation.navigate('LoginScreen');
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
    color: 'black',
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
    color: 'black',
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
    fontSize:16,
    color: '#333',
  },
});

export default HomeScreen;
