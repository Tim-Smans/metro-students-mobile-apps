import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getAutomaticMode, isAirQualityGood, controlAutomaticPurifier } from './api/purifierCalls';
import { AutomaticControls } from './models/automaticControls';

export default function App() {
  const [isOn, setIsOn] = useState<boolean>(true);
  const [isQualityGood, setIsQualityGood] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const mode = await getAutomaticMode();
      setIsOn(mode === 'on');

      const airQuality = await isAirQualityGood();
      setIsQualityGood(airQuality === true);
    } catch (err) {
      console.error('Failed to load purifier data:', err);
      setIsOn(false);
      setIsQualityGood(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handlePress = async () => {
    const newState = !isOn;
    const newControl = newState ? AutomaticControls.ON : AutomaticControls.OFF;

    await controlAutomaticPurifier(newControl);
    setIsOn(newState);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={styles.header}>Air purifier</Text>
        <View style={styles.btn}>
          <Text>Enable/Disable Automatic purifier mode</Text>
          <Button
            title={isOn ? 'On' : 'Off'}
            color={'black'}
            onPress={handlePress}
          />
        </View>

        <View style={styles.status}>
          <Text style={styles.statusText}>
            The air quality is {isQualityGood ? 'Good' : 'Bad'}
          </Text>
        </View>
        <View style={styles.refreshBtn}>
          <Button
            title="Refresh"
            color="black"
            onPress={refreshData}
          />
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
  refreshBtn: {
    width: '30%',
    paddingTop: 20,
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
