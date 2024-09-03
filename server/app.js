const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors') // Importa el paquete cors
const jwt = require('jsonwebtoken')
const { pool } = require('./databaseconfig.js')

const app = express()
const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir estos métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'] // Permitir estos encabezados
  }
})

app.use(
  cors({
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir estos métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'] // Permitir estos encabezados
  })
)

app.use(express.json())

const secret = 'gatito' // Cambia esto por una clave secreta segura
let entries = []
// Middleware para verificar el token JWT
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

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  const [data] = await pool
    .promise()
    .query('SELECT * FROM `users` WHERE `name` = ? AND `accesscode` = ?', [
      username,
      password
    ])

  if (data.length === 0) {
    res.status(400).json({ message: 'Usuario no encontrado' })
  } else {
    const user = data[0]
    const token = jwt.sign(
      { id: user.id, username: user.name, role: user.rol }, // Incluye el rol en el token
      secret,
      {
        expiresIn: '16h'
      }
    )
    res.json({ token })
  }
})

// Rutas protegidas
// app.get('/api/entries', authenticateToken, (req, res) => {
//   res.json(entries)
// })

app.get('/api/entries', async (req, res) => {
  const [data] = await pool
    .promise()
    .query(
      'SELECT `e`.*, `u`.`name` as `usuario` FROM `entries` `e` JOIN `users` `u` ON `e`.`usuario` = `u`.id ORDER BY `e`.`id`'
    )
  console.log(data)
  res.json(data)
})

app.post('/api/entries', authenticateToken, async (req, res) => {
  const entry = {
    ...req.body,
    // id: entries.length + 1, // ESTO NO HACE FALTA PORQUE YA LO HACE LA BASE DE DATOS
    usuario: req.user.id
  }
  // entries.push(entry)
  const query = 'INSERT INTO `entries` SET ?'
  await pool.promise().query(query, entry)
  io.emit('newEntry', entry)
  res.status(201).json(entry)
})

app.delete('/api/entries/:id', authenticateToken, (req, res) => {
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

server.listen(4000, () => {
  console.log('Server is running on http://0.0.0.0:4000')
})
