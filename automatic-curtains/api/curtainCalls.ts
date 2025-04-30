import axios from 'axios'
import CurtainControls from '../models/curtainControls'
import { AutomaticControls } from '../models/automaticControls'

const client = axios.create(
  {
    baseURL: 'https://metro-students-mobile-apps.onrender.com',
    timeout: 10000
  }
)

export const controlCurtain = async (data: CurtainControls) => {
  const control = data.toString().toLowerCase()
  console.log(control)
  const resp = await client.post('/curtain/', control)

  if(resp.status != 200) {
    console.error('Something went wrong while controlling curtains:')
    console.error(resp.data)
    return
  }

  console.log(resp.data)
}


export const getAutomaticMode = async () => {
  const {data, status} = await client.get('/curtain/automatic/')

  if(status != 200){
    console.error('Something went wrong while getting curtains status:')
    console.error(data)
    return
  }

  return data
}

export const controlAutomaticCurtain = async (data: AutomaticControls) => {
  const control = data.toString().toLowerCase()
  console.log(control)
  const resp = await client.post('/curtain/automatic', control)

  if(resp.status != 200) {
    console.error('Something went wrong while controlling curtains:')
    console.error(resp.data)
    return
  }

  console.log(resp.data)
}