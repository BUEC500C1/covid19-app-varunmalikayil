import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, View, Vibration } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Geocoder from 'react-native-geocoding';

const countryStyle = require('../mapStyle.json');

export default class WorldStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
        worldStats: {
          confirmedCases: 0,
          recoveredPatients: 0,
          deathCount: 0
        }
        }
    }

    async componentDidMount() {
        var api_url = "https://api.covid19api.com/world/total"
        fetch(api_url)
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson[resJson.length-1] == undefined || resJson.length < 1){ 
           this.setState({
             worldStats: {
               confirmedCases: resJson["TotalConfirmed"],
               deathCount: resJson["TotalDeaths"],
               recoveredPatients: resJson["TotalRecovered"]
             }
           });
          }
          else {
            this.setState({
              worldStats: {
                confirmedCases: "N/A",
                deathCount: "N/A",
                recoveredPatients: "N/A"
              }
            })
          }
        }).catch((error)=>console.log(error) );
        
    }

    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>World Statistics</Text>
                <Text>Confirmed Cases: {this.state.worldStats.confirmedCases}</Text>
                <Text>Recovered Patients: {this.state.worldStats.recoveredPatients}</Text>
                <Text>Death Count: {this.state.worldStats.deathCount}</Text>
            </View>
        );
    }
  }