// App.tsx
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import plantData from './assets/data/plantdatabase.json'
import { Client, Message } from 'paho-mqtt'
import { StatusBar } from 'expo-status-bar'

type Plant = {
  name: string
  frequency?: number
  water_amount_ml?: number
}

type Slot = 'slot1' | 'slot2' | 'slot3' | 'slot4'

type SlotAssignment = Record<Slot, string>

const plantList: Plant[] = plantData

export default function App(): JSX.Element {
  const [assignments, setAssignments] = useState<SlotAssignment>({
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: ''
  })
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const mqttClient = new Client(
      'wss://2c3bf9f59f854d31acdaa3ad9ce7a0f7.s1.eu.hivemq.cloud:8884/mqtt',
      `mobile-app-${Math.random().toString(16).slice(2, 8)}`
    )

    mqttClient.connect({
      userName: 'Client1',
      password: '123a321A',
      useSSL: true,
      onSuccess: () => {
        console.log('Connected')
        mqttClient.subscribe('home/led/status')
        mqttClient.subscribe('plant/status')
      },
      onFailure: (err: any) => {
        console.error('Connection failed:', err)
      }
    })

    mqttClient.onMessageArrived = (message: Message) => {
      console.log(`${message.destinationName}: ${message.payloadString}`)

      if (message.destinationName === 'plant/status') {
        try {
          const incoming = JSON.parse(message.payloadString)
          console.log('Incoming slot data:', incoming)
          setAssignments(prev => ({ ...prev, ...incoming }))
        } catch (err) {
          console.error('Failed to parse plant/status payload:', err)
        }
      }
    }

    setClient(mqttClient)

    return () => {
      mqttClient.disconnect()
    }
  }, [])

  const handleChange = (slot: Slot, plant: string): void => {
    setAssignments(prev => ({ ...prev, [slot]: plant }))
  }

  const handleSave = (): void => {
    console.log('Publishing assignment:', assignments)
    if (client?.isConnected()) {
      const message = new Message(JSON.stringify(assignments))
      message.destinationName = 'plant/data'
      client.send(message)
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={styles.header}>Plot Assignment</Text>
        <ScrollView contentContainerStyle={styles.container}>
          {(['slot1', 'slot2', 'slot3', 'slot4'] as (keyof SlotAssignment)[]).map((slot, idx) => (
            <View key={slot} style={styles.plotCard}>
              <Text style={styles.label}>Slot {idx + 1}</Text>
              <Picker
                selectedValue={assignments[slot]}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(slot, itemValue)}
              >
                <Picker.Item label="Select a plant" value="" />
                {plantList.map((plant) => (
                  <Picker.Item key={plant.name} label={plant.name} value={plant.name} />
                ))}
              </Picker>
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Assignments</Text>
          </TouchableOpacity>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    paddingVertical: 10
  },
  plotCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '90%',
    elevation: 3
  },
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: '100%'
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16
  }
})
