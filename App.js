import React, { useState, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [isReceivingCall, setIsReceivingCall] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [session, setSession] = useState(null)
  const [connected, setConnected] = useState(false)
  const [registered, setReistered] = useState(false)
  const sipURL = '10.15.0.74'

  const socket = new JsSIP.WebSocketInterface(`ws://${sipURL}:8088/asterisk/ws`);
  const configuration = {
    sockets: [ socket ],
    uri: `sip:20@${sipURL}:5060`,
    password: 'xcom0615',
    display_name: 'Diogo PC',
  };

  const ua = new JsSIP.UA(configuration);

  const options = {
    mediaConstraints: {
      audio: true,
      video: false
    },
    pcConfig: {
      iceServers: [
          { urls: ["stun:stun.l.google.com:19302"] }
      ],
      iceTransportPolicy: "all",
      rtcpMuxPolicy: "negotiate"
    }
  }

  useEffect(() => {
    ua.start()
    if (connected) ua.register()
  }, [])

  ua.on('connecting', () => console.log("connecting"))

  ua.on('connected', () => {
    console.log("connected");
    setConnected(true)
  });

  ua.on('disconnected', (e) => {
    console.log('disconnected', e);
    setConnected(false)
  });

  ua.on('unregistered', () => {
    console.log("client unregistered");
    setReistered(false)
  });

  ua.on('progress', () => console.log("progress"))

  ua.on('registered', () => {             
    console.log("client registered");
    setReistered(true)
  });

  ua.on('registrationFailed', (data) => console.error('registration failed:', data))

  ua.on('newRTCSession', (data) => {
    const {session} = data;
    
    if (session.direction === 'incoming') {
      console.log('receiving call')
      setSession(session)
      setIsReceivingCall(true)

      session.on('connecting', () => console.log('connecting call'))

      session.on('sending', () => console.log('sending call'))
      
      session.on('progress', () => console.log('call in progress'))

      session.on('confirmed', () => console.log('call confirmed'))

      session.on('accepted', () => console.log('call accepted'))

      session.on('failed', (data) => {
        console.error('call failed:', data)
        setIsInCall(false)
        setIsReceivingCall(false)
        setSession(null)
      })

      session.on('ended', (data) => {
        console.log('call ended:', data)
        setIsInCall(false)
        setIsReceivingCall(false)
        setSession(null)
      })
    }
  })

  const answerCall = () => {
    console.log('trying to answer')
    session.answer(options)
    console.log('answer?')
  }

  const rejectOrHangupCall = () => {
    session.terminate()
    setSession(null)
    setIsInCall(false)
    setIsReceivingCall(false)
  }

  return (
    <View style={style.defaultView}>
      <View style={{borderLeftWidth: 5, borderColor: registered ? 'royalblue' : connected ? 'limegreen' : 'crimson'}}>
        <Text style={style.text}>{isReceivingCall ? 'someone is calling you' : isInCall ? 'call answered' : 'proto app'}</Text>
      </View>
      {isReceivingCall && (<View style={style.contentView}>
        <CustomButton action={answerCall} text={isInCall ? 'open' : 'answer'} color='limegreen' />
        <CustomButton action={rejectOrHangupCall} text='reject' color='crimson' />
        { isInCall && <CustomButton text={'unmute'} color='royalblue' /> }
      </View>)}
    </View>
  )
};

const {width, height} = Dimensions.get('window')
const style = StyleSheet.create({
  contentView: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    flexDirection: 'row',
    width,
  },
  defaultView: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: '#fff',
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
  },
  text: {
    fontWeight: 'bold',
    fontSize: 35,
    fontFamily: 'sans-serif-condensed',
    color: 'black'
  }
})

export default App;
