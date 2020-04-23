import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Vibration } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';

const countryStyle = require('../mapStyle.json');

export default class GlobalMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
        latitude: null,
        longitude: null,
        marker: [{
            title: 'hello',
            coordinates: {
              latitude: 3.148561,
              longitude: 101.652778
            },
            key: 0
          }]
        }
        this.handlePress = this.handlePress.bind(this);
    }
    handlePress(e){
        this.setState({ 
          marker: [{
          coordinates: {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          },
          key: 0}
        ],
        longitude: e.nativeEvent.coordinate.longitude,
        latitude: e.nativeEvent.coordinate.latitude
      }, () => console.log('handle press', this.state)),
        (error) => console.log('Error:', error)
            
    }

    async componentDidMount() {
        const { status } = await Permissions.getAsync(Permissions.LOCATION)

        if (status != 'granted') {
            const response = await Permissions.askAsync(Permissions.LOCATION)
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => this.setState({ 
              marker: [{
              coordinates: {
                latitude: latitude,
                longitude: longitude
              },
              key: 0}
            ],
            longitude: longitude,
            latitude: latitude
          }, () => console.log(this.state)),
            (error) => console.log('Error:', error)
        )
    }

    render(){
        const { latitude, longitude } = this.state
        if(latitude) {
            return (
                <MapView 
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }} 
                    initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta: 40,
                        longitudeDelta: 0.0421
                    }}
                    onLongPress={this.handlePress}
                    customMapStyle={countryStyle}
                    zoomControlEnabled={true}
                    zoomEnabled={true}
                >
                    {this.state.marker.map(marker => ( <MapView.Marker key={marker.key} coordinate={marker.coordinates} title={marker.title}/> ))}
                </MapView>
          );   
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Welcome to the COVID-19 Tracker!</Text>
            </View>
        );
    }
  }

  const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });

