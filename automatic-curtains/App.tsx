import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import CurtainControls from './models/curtainControls';
import { controlAutomaticCurtain, controlCurtain, getAutomaticMode } from './api/curtainCalls';
import { AutomaticControls } from './models/automaticControls';

export default function App() {
  const [isOn, setIsOn] = useState<boolean>(true);

  const handlePress = async () => {

    var automaticControl = AutomaticControls.ON
    if(isOn){
      automaticControl = AutomaticControls.OFF
    }

    await controlAutomaticCurtain(automaticControl)

    setIsOn(!isOn)
  }

  const handleControls = async (control: CurtainControls) => {
    await controlCurtain(control)
  }

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const mode = await getAutomaticMode()
        setIsOn(mode === AutomaticControls.ON)
      } catch (err) {
        console.error('Failed to fetch automatic mode:', err)
      }
    }
  
    fetchMode()
  }, [])

  return (
    <SafeAreaProvider >
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.header}>Automatic Curtains</Text>
        <View style={styles.btn}>
          <Text>Enable or disable automatic mode</Text>
          <Button
            title={isOn ? 'On' : 'Off'}
            color={'black'}
            onPress={handlePress}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={async () => await handleControls(CurtainControls.OPEN)}>
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => await handleControls(CurtainControls.STOP)}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => await handleControls(CurtainControls.CLOSED)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',  
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    paddingVertical: 10
  },
  btn: {
    width: '30%',
    paddingTop: 50,
    alignSelf: 'center'
  },
  status: {
    width: '80%',
    height: '30%',
    backgroundColor: 'black',
    color: 'white',
    alignSelf: 'center',
    marginTop: 100,
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 25,
    width: '80%'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginHorizontal: 5,
    width: 90, // << voeg dit toe
    alignItems: 'center', // << zorg dat tekst gecentreerd blijft
  },
  buttonText: {
  color: 'white',
  fontSize: 15,
  textAlign: 'center',
  },
});
