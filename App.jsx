import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './component/BottomTabNavigator';

// import LoginSignupScreen from './component/LoginSignupScreen';
import LoginScreen from './component/LoginScreen';
import SignUpScreen from './component/SignUpScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">  
      
        {/* <Stack.Screen name="LoginSignup" component={LoginSignupScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
         <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} /> 
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
