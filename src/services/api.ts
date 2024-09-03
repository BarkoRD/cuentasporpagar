import axios from 'axios'
import { url } from '../components/Table'

const api = axios.create({
  // baseURL: 'http://192.168.1.13:4000/api',
  baseURL: url
})

export default api
