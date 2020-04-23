import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Vibration } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

const countryStyle = require('../mapStyle.json');

export default class GlobalMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
        latitude: null,
        longitude: null,
        marker: [{
            coordinates: {
              latitude: 3.148561,
              longitude: 101.652778
            },
            key: 0
          }],
        country: '',
        validCountry: false
        }
        this.handlePress = this.handlePress.bind(this);
    }

    findCountry(coordinate){
      Geocoder.init("");
      var country = '';
      Geocoder.from(coordinate).then(json => {
        var coordinateData = json.results[0].address_components;
        for (var i = 0; i < coordinateData.length; i++){
          for(var j = 0; j < coordinateData[i].types.length; j++){
            if(coordinateData[i].types[j] == "country"){
              country = coordinateData[i].long_name
              break;
            } 
          }
        }
        if(country != ''){
          this.setState({
            validCountry: true,
            country: country
          })
        }
        else {
          this.setState({
            validCountry: false,
            country: "Please select valid country"
          })
        }
        ;})
        return country
    }

    handlePress(e){
        Geocoder.init("AIzaSyCEIZIdz0xZZkGHfuW0ewq1DJGXpWEr1z8");
        Geocoder.from(e.nativeEvent.coordinate).then(json => {
          var coordinateData = json.results[0].address_components;
          var country = '';
          for (var i = 0; i < coordinateData.length; i++){
            for(var j = 0; j < coordinateData[i].types.length; j++){
              if(coordinateData[i].types[j] == "country"){
                country = coordinateData[i].long_name
                break;
              } 
            }
          }
          if(country != ''){
            this.setState({
              validCountry: true,
              country: country
            })
          }
          console.log('geo', country);
          ;})
        var test = this.findCountry(e.nativeEvent.coordinate);
        console.log("test", test)
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
          ({ coords }) => this.setState({ 
              marker: [{
              coordinates: {
                latitude: coords.latitude,
                longitude: coords.longitude
              },
              key: 0}
            ],
            longitude: coords.longitude,
            latitude: coords.latitude
          }, () => this.findCountry(coords)),
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
                    {this.state.marker.map(marker => ( <Marker key={marker.key} coordinate={marker.coordinates} title={this.state.country}/> ))}
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

