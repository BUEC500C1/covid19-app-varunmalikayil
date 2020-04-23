import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MapView from 'react-native-maps';
import GlobalMap from './components/GlobalMap'

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the COVID-19 Tracker!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Global" component={GlobalMap} />
        </Tab.Navigator>
      </NavigationContainer>
    );    
  }
}