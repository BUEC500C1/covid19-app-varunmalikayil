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
        validCountry: false,
        countryStats: {
          dateOfOccurance: "",
          confirmedCases: 0,
          recoveredPatients: 0,
          deathCount: 0
        }
        }
        this.handlePress = this.handlePress.bind(this);
    }

    findCountry(coordinate){
      Geocoder.init("AIzaSyDyxazCJ99CEdnxoxOG3UIolRj5C8_KvEU");
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
        this.getCountryStatistics();
        ;})
    }

    renderingCountryStats(){
      var data_style = {
        fontStyle: 'italic',
        color:"#01f5ff"
      }
  
      if (this.state.country == "" ){ //no country there
        return (<Text style={data_style}>Please select a country</Text>)
      }
      else{ //received data
        return(
          <View>
            <Text style={{color:"#01f5ff", fontWeight: "bold", fontSize:18}}>
                  {this.state.country}
            </Text>
            <Text style={data_style}>
            Date: {this.state.countryStats.dateOfOccurance}
            </Text>
            <Text style={data_style}>
              Confirmed: {this.state.countryStats.confirmedCases}
            </Text>
            <Text style={data_style}>
              Deaths: {this.state.countryStats.deathCount}
            </Text>
            <Text style={data_style}>
              Recovered: {this.state.countryStats.recoveredPatients}
            </Text>
          </View>
        );
      }
    }

    handlePress(e){
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
            }, () => this.getCountryStatistics())
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

    getCountryStatistics() {
      var api_url = `https://api.covid19api.com/total/country/${this.state.country}`;
      fetch(api_url)
        .then((data) => data.json())
        .then((dataJson) => {
          if (dataJson.length >= 1 && dataJson[dataJson.length-1] != undefined){
            this.setState({
              loadingCovidData: false,
              countryStats: {
                dateOfOccurance: dataJson[dataJson.length-1]["Date"],
                confirmedCases: dataJson[dataJson.length-1]["Confirmed"],
                recoveredPatients: dataJson[dataJson.length-1]["Recovered"],
                deathCount: dataJson[dataJson.length-1]["Deaths"]
              }
            }, () => console.log('stats', this.state));
          }
          else {
            this.setState({
              countryStats: {
                dateOfOccurance: "",
                confirmedCases: 0,
                recoveredPatients: 0,
                deathCount: 0
              }
            });            
          } 
    }).catch((error)=>console.log(error) );
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
                    {this.state.marker.map(marker => ( <Marker key={marker.key} coordinate={marker.coordinates} title={this.state.country}>
                      <View style={styles.marker}>
                        {this.renderingCountryStats()}
                      </View>
                    </Marker> ))}
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

