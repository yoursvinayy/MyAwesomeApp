import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import ReelsScreen from './ReelsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBarIcon = ({ route, focused, color, size }) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';  // Corrected icon name for Home screen
      break;
    case 'Search':
      iconName = focused ? 'search' : 'search-outline';  // Search screen
      break;
    case 'Reels':
      iconName = focused ? 'play-circle' : 'play-circle-outline';  // Reels (using play icon for a media feel)
      break;
    case 'Profile':
      iconName = focused ? 'user' : 'user-o';  // Profile screen, using FontAwesome icons
      break;
    default:
      iconName = 'help-circle-outline';
  }

  // Use MaterialIcons for Reels and FontAwesome for Profile
  if (route.name === 'Reels') {
    return <MaterialIcons name={iconName} size={size} color={color} />;
  } else if (route.name === 'Profile') {
    return <FontAwesome name={iconName} size={size} color={color} />;
  }

  // Default Ionicons for Home and Search
  return <Ionicons name={iconName} size={size} color={color} />;
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <CustomTabBarIcon route={route} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#ff8c00',  // Highlight active tab with orange
        tabBarInactiveTintColor: '#6e6e6e', // Inactive tabs in gray
        tabBarStyle: styles.tabBarStyle,    // Custom style for the tab bar
        tabBarLabelStyle: styles.tabBarLabelStyle, // Customize label font size
        tabBarShowLabel: true,               // Show tab labels
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }}/>
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Reels" component={ReelsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#121212',   // Dark background color for the tab bar
    height: 65,                   // Adjust height for better appearance
    paddingBottom: 10,            // Adjust for better icon placement
    borderTopWidth: 0,            // Remove border at the top
    elevation: 5,                 // Add shadow for elevation
  },
  tabBarLabelStyle: {
    fontSize: 12,                 // Adjust font size for the labels
    marginBottom: 5,              // Margin to adjust label position
  },
});

export default BottomTabNavigator;
