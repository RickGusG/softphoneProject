import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebSocketInterface } from 'jssip'
import SoftPhone from 'react-softphone';

const CustomButton = ({text, color, action}) => {
  return (
    <Pressable onPress={action} style={style.btn} {...{backgroundColor: color}}>
      <Text style={style.btnTxt} >{text}</Text>
    </Pressable>
  )
}

const CallComponent = () => {

  const [isInCall, setIsInCall] = useState(false)
  const [mute, setMute] = useState(true)

  const config = {
    domain: '192.168.15.104', // sip-server@your-domain.io
    uri: '10@192.168.15.104', // sip:sip-user@your-domain.io
    password: 'xcom0615', //  PASSWORD ,
    ws_servers: 'wss://10@192.168.15.104:8089/ws', //ws server
    sockets: new WebSocketInterface('wss://192.168.15.104:8089/ws'),
    display_name: 'Android',//jssip Display Name
    debug: false // Turn debug messages on
 
  };

  const setConnectOnStartToLocalStorage = (newValue) => {
  // Handle save the auto connect value to local storage
  return true
  }
  const setNotifications = (newValue) => {
  // Handle save the Show notifications of an incoming call to local storage
  return true
  }
  const setCallVolume = (newValue) => {
  // Handle save the call Volume value to local storage
  return true
  }
  const setRingVolume = (newValue) => {
  // Handle save the Ring Volume value to local storage
  return true
  }

  return (
    <View style={style.defaultView}>
      <CustomButton text={isInCall ? 'open' : 'answer'} color='limegreen' />
      <CustomButton text='reject' color='crimson' />
      { isInCall && 
        <CustomButton action={() => setMute(!mute)} text={mute ? 'unmute' : 'mute'} color='royalblue' /> 
      }
      <SoftPhone
        callVolume={33} //Set Default callVolume
        ringVolume={44} //Set Default ringVolume
        connectOnStart={false} //Auto connect to sip
        notifications={false} //Show Browser Notification of an incoming call
        config={config} //Voip config
        setConnectOnStartToLocalStorage={setConnectOnStartToLocalStorage} // Callback function
        setNotifications={setNotifications} // Callback function
        setCallVolume={setCallVolume} // Callback function
        setRingVolume={setRingVolume} // Callback function
        timelocale={'UTC-3'} //Set time local for call history
      />
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
