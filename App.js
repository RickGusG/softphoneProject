import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={style.defaultView}>
      <CustomButton text={isInCall ? 'open' : 'answer'} color='limegreen' />
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
