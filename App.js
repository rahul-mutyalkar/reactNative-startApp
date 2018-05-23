/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Button
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";
var SmsAndroid = require('react-native-sms-android');
import Permissions from 'react-native-permissions'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

type Props = {};
export default class App extends Component < Props > {
  state = {};
  constructor(props) {
    super(props);

    this.state = {};
  }

  button1() {
    console.log('clicked button 1');
    alert('clicked button1');
  }
  componentWillMount() {
    ////
    // 1.  Wire up event-listeners
    //
    let self = this;
    /* asking for permission */

    Permissions.request('readSms').then(response => {
      /* get SMS list */
      console.warn('permission grated: ');
      self.getSMS();

    })

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation.bind(this), this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.on('activitychange', this.onActivityChange);

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.on('providerchange', this.onProviderChange);

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: 0,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: { // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: { // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, (state) => {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        ////
        // 3. Start tracking!
        //
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });
  }

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }
  onLocation(location) {
    this.setState({locationInfo: JSON.stringify(location)});
    console.warn('- [event] location: ', this.state.locationInfo);
  }
  onError(error) {
    console.warn('- [event] location error ', error);
  }
  onActivityChange(activity) {
    console.log('- [event] activitychange: ', activity); // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider) {
    console.log('- [event] providerchange: ', provider);
  }
  onMotionChange(location) {
    console.log('- [event] motionchange: ', location.isMoving, location);
  }
  render() {
    return (<View style={styles.container
}>
      <Text>
        Location Plugin
      </Text>
      <Text >
        {this.state.locationInfo}
      </Text >
    
    </View >);
  }/* SMS Plugin is here */
  getSMS() {
    / * List SMS messages matching the filter * /
    var filter = {
      box: '', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      // the next 4 filters should NOT be used together, they are OR-ed so pick one
      //  read: 0,  0 for unread SMS, 1 for SMS already read
      //_id: 1234,  specify the msg id
      //address: '+97433------',  sender's phone number
      //body: 'Hello',  content to match
      // the next 2 filters can be used for pagination
      indexFrom: 0, // start from index 0
      maxCount: 10, // count of SMS to return each time
    };

    SmsAndroid.list(JSON.stringify(filter), (fail) => {
      console.warn("OH Snap: " + fail)
    }, (count, smsList) => {
      console.log('Count: ', count);
      console.log('List: ', smsList);
      var arr = JSON.parse(smsList);
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        // console.warn("Index: " + i);
        // console.log("-->" + obj.date);
        // console.log("-->" + obj.body);
      }
      Alert.alert('SMS info', 'fetched SMS"s are' + smsList.length, [
        {
          text: 'Got it',
          onPress: () => console.log('Permission denied'),
          style: 'cancel'
        }
      ],)
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
