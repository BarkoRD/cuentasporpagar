import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

const socket = io('http://192.168.1.13:4000')

interface Entry {
  id: number
  fecha: string
  monto: number
  beneficiario: string
  usuario: string
}

const Table: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    fetchEntries()
    socket.on('newEntry', fetchEntries)
    socket.on('updateEntry', fetchEntries)
    socket.on('deleteEntry', fetchEntries)
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://192.168.1.13:4000/api/entries')
      if (Array.isArray(response.data)) {
        setEntries(response.data)
      } else {
        setEntries([]) // o maneja el error de forma adecuada
        console.error('La respuesta de la API no es un array', response)
      }
    } catch (error) {
      console.error('Error al obtener las entradas', error)
    }
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`http://192.168.1.13:4000/api/entries/${id}`)
    toast.success('Entrada eliminada')
    fetchEntries()
  }
// 192.168.1.13
  return (
    <div>
      <h1>Cuentas por Pagar</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Beneficiario</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.fecha}</td>
              <td>{entry.monto}</td>
              <td>{entry.beneficiario}</td>
              <td>{entry.usuario}</td>
              <td>
                <button onClick={() => handleDelete(entry.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
