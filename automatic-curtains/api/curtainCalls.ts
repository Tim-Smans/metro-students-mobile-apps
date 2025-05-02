import axios from 'axios'
import CurtainControls from '../models/curtainControls'
import { AutomaticControls } from '../models/automaticControls'

const client = axios.create({
  baseURL: 'https://metro-students-mobile-apps.onrender.com',
  timeout: 10000
})


export const controlCurtain = async (data: CurtainControls, id: string) => {
  console.log(data)
  const resp = await client.post(`/curtain/${id}/manual`, 
    { command: data }, 
    { headers: { 'Content-Type': 'application/json' }}
  )

  if (resp.status !== 200) {
    console.error('Something went wrong while controlling curtain:')
    console.error(resp.data)
    return
  }

  console.log(resp.data)
}

export const getAutomaticMode = async (id: string) => {
  const { data, status } = await client.get(`/curtain/${id}/automatic`)

  if (status !== 200) {
    console.error('Something went wrong while getting automatic mode:')
    console.error(data)
    return
  }

  return data.sensors_enabled
}

export const controlAutomaticCurtain = async (data: AutomaticControls, id: string) => {
  console.log(data)
  const resp = await client.post(`/curtain/${id}/automatic`, 
    { command: data }, 
    { headers: { 'Content-Type': 'application/json' }}
  )

  if (resp.status !== 200) {
    console.error('Something went wrong while toggling automatic mode:')
    console.error(resp.data)
    return
  }

  console.log(resp.data)
}
