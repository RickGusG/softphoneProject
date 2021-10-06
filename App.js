import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import JsSIP from 'jssip'
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';

window.RTCPeerConnection = window.RTCPeerConnection || RTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || RTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || RTCSessionDescription;
window.MediaStream = window.MediaStream || MediaStream;
window.MediaStreamTrack = window.MediaStreamTrack || MediaStreamTrack;
window.navigator.mediaDevices = window.navigator.mediaDevices || mediaDevices;
window.navigator.getUserMedia = window.navigator.getUserMedia || mediaDevices.getUserMedia;

const CustomButton = ({text, color, action}) => {
  return (
    <Pressable onPress={action} style={style.btn} {...{backgroundColor: color}}>
      <Text style={style.btnTxt} >{text}</Text>
    </Pressable>
  )
}

const App = () => {
  const [isInCall, setIsInCall] = useState(true)
  const [mute, setMute] = useState(true)

  const socket = new JsSIP.WebSocketInterface('ws://192.168.15.104:8088/asterisk/ws');
  const configuration = {
    sockets: [ socket ],
    uri: 'sip:10@192.168.15.104:5060',
    password: 'xcom0615',
    display_name: 'Android',
  };

  const ua = new JsSIP.UA(configuration);

  ua.start()
  ua.register()

  ua.on('connecting', () => {
    console.log("connecting");
  });

  ua.on('connected', () => {
    console.log("connected");
  });

  ua.on('disconnected', (data) => {
    console.log('disconnected');
  });

  ua.on('unregistered', () => {
    console.log("client unregistered");
  });

  ua.on('progress', () => {
    console.log("progress");
  });

  ua.on('registered', () => {             
    console.log("client registered");
  });

  ua.on('registrationFailed', (data) => {
    console.error('registration failed:', data)
  })

  ua.on('newRTCSession', (data) => {
    const {originator, session, request} = data;
    console.log(originator, session, request)
  })

  const eventHandlers = {
    'progress': () => {
      console.log('call is in progress');
    },
    'failed': (e) => {
      const {cause} = e
      console.error('call failed with cause: '+ cause);
    },
    'ended': (e) => {
      const {cause} = e
      console.log('call ended with cause: '+ cause);
    },
    'confirmed': () => {
      console.log('call confirmed');
    }
  };

  const options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : { 'audio': true, 'video': false }
  };

  return (
    <View style={style.defaultView}>
      <CustomButton action={() => ua.call('20@192.168.15.104:5060', options)} text={isInCall ? 'open' : 'answer'} color='limegreen' />
      <CustomButton text='reject' color='crimson' />
      { isInCall && 
        <CustomButton action={() => setMute(!mute)} text={mute ? 'unmute' : 'mute'} color='royalblue' /> 
      }
    </View>
  )
};

const style = StyleSheet.create({
  defaultView: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  btn: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  btnTxt: {
    fontWeight: 'bold',
    fontSize: 25
  }
})

export default App;
