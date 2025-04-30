import axios from 'axios'
import CurtainControls from '../models/curtainControls'

const client = axios.create(
  {
    baseURL: 'https://metro-students-mobile-apps.onrender.com',
    timeout: 10000
  }
)

export const controlCurtain = async (data: CurtainControls) => {
  const control = data.toString().toLowerCase()
  console.log(control)
  const resp = await client.post('/curtains/', control)

  if(resp.status != 200) {
    console.error('Something went wrong while controlling curtains:')
    console.error(resp.data)
    return
  }

  console.log(resp.data)
}
