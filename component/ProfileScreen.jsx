import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'; // Firebase storage for uploading images
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null); // State to hold user data
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(require('../assets/profile.png')); // Default profile image

    // Function to handle image selection and upload to Firebase Storage
    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const imageUri = response.assets[0].uri;
                const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);

                try {
                    // Upload the image to Firebase Storage
                    const reference = storage().ref(`profile_images/${auth().currentUser.uid}/${fileName}`);
                    const uploadTask = reference.putFile(imageUri);

                    uploadTask.on('state_changed', taskSnapshot => {
                        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
                    }, error => {
                        console.log('Image upload error: ', error);
                    }, async () => {
                        // Get the download URL after the image is uploaded
                        const downloadURL = await reference.getDownloadURL();

                        // Save the image URL to Firestore
                        const userRef = firestore().collection('users').doc(auth().currentUser.uid);
                        await userRef.update({ profileImage: downloadURL });

                        // Update the profile image state to reflect the new image
                        setProfileImage({ uri: downloadURL });
                    });
                } catch (error) {
                    console.error('Error uploading image: ', error);
                }
            }
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true); // Start loading

            try {
                const user = auth().currentUser;
                console.log('Current user:', user);

                if (user) {
                    // Fetch user data from Firestore using user UID
                    const userDoc = await firestore().collection('users').doc(user.uid).get();
                    console.log('User document data:', userDoc.data());

                    if (userDoc.exists) {
                        setUserData(userDoc.data()); // Set the user data
                        if (userDoc.data().profileImage) {
                            setProfileImage({ uri: userDoc.data().profileImage }); // Set profile image if available
                        }
                    } else {
                        console.log('No user data found');
                    }
                } else {
                    console.log('No user is logged in');
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };

        fetchUserData();
    }, []); // Run only once when the component mounts

    if (loading) {
        return <ActivityIndicator size="large" color="#ff8c00" style={styles.loadingIndicator} />;
    }

    // Get current user again to access email
    const user = auth().currentUser;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePicker}>
                <Image source={profileImage} style={styles.profilePicture} />
                <Icon name="pencil" size={24} color="#fff" style={styles.editIcon} />
            </TouchableOpacity>

            <Text style={styles.name}>{user?.displayName || 'Anonymous'}</Text>
            <Text style={styles.email}>{user?.email || 'testuser@example.com'}</Text>

            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>214</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>52</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    profilePicture: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 4,
        borderColor: '#ff8c00',
        marginBottom: 20,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 5,
    },
    email: {
        fontSize: 18,
        color: 'black',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: 'black',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#ff8c00',
        borderRadius: 15,
        padding: 5,
    },
});

export default ProfileScreen;
