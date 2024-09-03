const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});



app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())

const users = [
  {
    id: 1,
    username: 'p',
    password: '1',
  },
  {
    id: 2,
    username: 'janedoe',
    password: '67890',
  },
]
let entries = [
  {
    id: 1,
    fecha: '2024-08-21',
    monto: 1500,
    beneficiario: 'John Doe',
    usuario: 'Jane Smith',
  },
  {
    id: 2,
    fecha: '2024-08-21',
    monto: 1500,
    beneficiario: 'John Doe',
    usuario: 'Jane Smith',
  },
]
const secret = 'gatito'

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.sendStatus(401)

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/', (req, res) => {
  res.json('is working')
})

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  // const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword = password
  const user = { id: users.length + 1, username, password: hashedPassword }
  users.push(user)
  res.status(201).json(user)
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find((u) => u.username === username)
  if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })

  // const validPassword = await bcrypt.compare(password, user.password);
  const validPassword = password == user.password
  if (!validPassword)
    return res.status(400).json({ message: 'Contraseña incorrecta' })

  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: '1h',
  })
  res.json({ token })
})

// app.get('/api/entries', authenticateToken, (req, res) => {
//   res.json(entries)
// })

app.get('/api/entries', (req, res) => {
  res.json(entries)
})


app.post('/api/entries', authenticateToken, (req, res) => {
  const entry = {
    ...req.body,
    id: entries.length + 1,
    usuario: req.user.username,
  }
  entries.push(entry)
  io.emit('newEntry', entry)
  res.status(201).json(entry)
})

// app.delete('/api/entries/:id', authenticateToken, (req, res) => {
//   const { id } = req.params
//   entries = entries.filter((entry) => entry.id !== parseInt(id))
//   io.emit('deleteEntry', id)
//   res.status(204).send()
// })

app.delete('/api/entries/:id', (req, res) => {
  const { id } = req.params
  entries = entries.filter((entry) => entry.id !== parseInt(id))
  io.emit('deleteEntry', id)
  res.status(204).send()
})

io.on('connection', (socket) => {
  console.log('New client connected')
  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

server.listen(4000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:4000')
})
