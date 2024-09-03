import { io } from 'socket.io-client'
import { url } from '../components/Table'

// const socket = io('http://192.168.1.13:4000');
const socket = io(url)

export default socket
