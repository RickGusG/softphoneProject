import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import JsSIP from 'jssip'
import SoftPhone from 'react-softphone';

const CustomButton = ({text, color, action}) => {
  return (
    <Pressable onPress={action} style={style.btn} {...{backgroundColor: color}}>
      <Text style={style.btnTxt} >{text}</Text>
    </Pressable>
  )
}

const CallComponent = () => {

  const [isInCall, setIsInCall] = useState(true)
  const [mute, setMute] = useState(true)

  const socket = new JsSIP.WebSocketInterface('wss://192.168.15.104');
  const configuration = {
    sockets  : [ socket ],
    uri      : '10@192.168.15.104',
    password : 'xcom0615',
    display_name: 'Android'
  };

  const ua = new JsSIP.UA(configuration);

  ua.start();

  // Register callbacks to desired call events
  const eventHandlers = {
    'progress': () => {
      console.log('call is in progress');
    },
    'failed': (e) => {
      console.log('call failed with cause: '+ e.data.cause);
    },
    'ended': (e) => {
      console.log('call ended with cause: '+ e.data.cause);
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
      <CustomButton action={() => ua.call('20@192.168.15.104', options)} text={isInCall ? 'open' : 'answer'} color='limegreen' />
      <CustomButton text='reject' color='crimson' />
      { isInCall && 
        <CustomButton action={() => setMute(!mute)} text={mute ? 'unmute' : 'mute'} color='royalblue' /> 
      }
    </View>
  )

}

const App = () => {
  return (
    <CallComponent />
  );
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
