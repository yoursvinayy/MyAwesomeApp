import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions, ImageBackground, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'; // Gradient overlay
import Video from 'react-native-video'; // Import Video Player

const { height, width } = Dimensions.get('window');

const ReelsScreen = () => {
    const [reels, setReels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current reel being displayed
    const videoRefs = useRef([]); // Ref to store video player instances
    const scrollViewRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState({}); // Track play/pause state for each video

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const videoCollection = await firestore().collection('videos').get();
            const videos = videoCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReels(videos);
        } catch (error) {
            console.error('Error fetching videos: ', error);
        }
    };

    const uploadVideo = async () => {
        const options = {
            mediaType: 'video',
            includeBase64: false,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                const videoUri = response.assets[0].uri;
                const fileName = videoUri.substring(videoUri.lastIndexOf('/') + 1);
                const reference = storage().ref(`videos/${fileName}`);

                await reference.putFile(videoUri);
                const url = await reference.getDownloadURL();

                await firestore().collection('videos').add({ video: url });
                fetchVideos(); // Refresh video list
            }
        });
    };

    const handleLike = (reelId) => {
        console.log(`Liked reel: ${reelId}`);
    };

    const togglePlayPause = (index) => {
        setIsPlaying(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.reelContainer}>
            <Video
                source={{ uri: item.video }}
                style={styles.reelVideo}
                paused={!isPlaying[index]} // Play or pause based on state
                resizeMode="cover"
                repeat // Loop the video
                ref={(ref) => {
                    videoRefs.current[index] = ref; // Store ref of each video
                }}
            />
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={styles.gradientOverlay} />
            <View style={styles.overlay}>
                <View style={styles.userInfoBox}>
                    <Text style={styles.userText}>{item.user || 'vinay'}</Text>
                </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Centered Play/Pause Button */}
            <TouchableOpacity onPress={() => togglePlayPause(index)} style={styles.centerButton}>
                <Ionicons name={isPlaying[index] ? "pause" : "play"} size={50} color="#fff" />
            </TouchableOpacity>
        </View>
    );
    
    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / height);
        setCurrentIndex(index); // Update the current index when scrolling
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll} // Capture scroll event to update current reel
                scrollEventThrottle={16} // Improve scroll performance
            >
                <FlatList
                    data={reels}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll} // Capture scroll event to update the current reel
                    scrollEventThrottle={16} // Improves scrolling performance
                />
            </ScrollView>
            <Button title="Upload Video" onPress={uploadVideo} color="#FFCE00" style={styles.uploadButton} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background for the entire screen
    },
    reelContainer: {
        height: height,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    reelVideo: {
        height: '100%',
        width: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
    },
    userInfoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 10,
        bottom: 200,
    },
    userText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionsContainer: {
        position: 'absolute',
        right: 7,
        bottom: 300, // Adjusted to move the container slightly above the bottom
        alignItems: 'center', // Keep buttons aligned in the center
        height: 150, // Adjust the height based on the number of action buttons
    },
    actionButton: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for buttons
    },
    centerButton: {
       
        position: 'absolute', // Position absolutely to center it
        top: '30%', // Center vertically
        left: '50%', // Center horizontally
        transform: [{ translateX: -25 }, { translateY: -25 }], // Adjust for half of the icon size (50 / 2)
    },
    uploadButton: {
        margin: 10,
        borderRadius: 30,
        height: 30,
    },
});


export default ReelsScreen;
