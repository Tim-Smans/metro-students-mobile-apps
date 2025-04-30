import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'

export default function App() {
  const [isOn, setIsOn] = useState<boolean>(true);
  const [isQualityGood, setIsQualityGood] = useState<boolean>(true);

  const handlePress = () => {
    setIsOn(!isOn)
  }

  return (
    <SafeAreaProvider >
      <SafeAreaView>
        <Text style={styles.header}>Air purifier</Text>
        <View style={styles.btn}>
          <Button
            title={isOn ? 'On' : 'Off'}
            color={'black'}
            onPress={handlePress}
          />
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>The air quality is {isQualityGood ? 'Good' : 'Bad'}</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20
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
  }
});
