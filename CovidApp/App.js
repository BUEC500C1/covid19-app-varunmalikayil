import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GlobalMap from './components/GlobalMap';
import WorldStats from './components/WorldStats';
import CasePerDate from './components/CasePerDate';

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
          <Tab.Screen name="World Statistics" component={WorldStats} />
          <Tab.Screen name="Global" component={GlobalMap} />
          <Tab.Screen name="Cases Per Date" component={CasePerDate} />
        </Tab.Navigator>
      </NavigationContainer>
    );    
  }
}