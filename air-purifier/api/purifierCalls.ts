import axios from 'axios'
import { AutomaticControls } from '../models/automaticControls'

const client = axios.create(
  {
    baseURL: 'https://metro-students-mobile-apps.onrender.com',
    timeout: 10000
  }
)


export const getAutomaticMode = async () => {
  const {data, status} = await client.get('/purifier/status/')

  if(status != 200){
    console.error('Something went wrong while getting purifier status:')
    console.error(data)
    return
  }

  return data.status
}

export const isAirQualityGood = async () => {
  const {data, status} = await client.get('/purifier/quality/')

  if(status != 200){
    console.error('Something went wrong while getting purifier status:')
    console.error(data)
    return
  }

  if(data.air_quality === 'good'){
    return true 
  }else{
    return false
  }
}

export const controlAutomaticPurifier = async (data: AutomaticControls) => {
  const control = data
  console.log(control)
  const resp = await client.post('/purifier/', 
     { command: control }, 
     { headers: { 'Content-Type': 'application/json' }})

  if(resp.status != 200) {
    console.log('Something went wrong while controlling curtains:')
    console.log(resp.data)
    return
  }
  console.log(resp.data)
}