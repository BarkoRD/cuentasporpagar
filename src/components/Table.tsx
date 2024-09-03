import React, { useState, useEffect, SVGProps } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
// import { jwtDecode } from 'jwt-decode'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'

// const url = 'http://192.168.1.13:4000'
// const url = 'http://10.0.0.95:4000'
export const url = 'http://localhost:4000'
const socket = io(url)

// interface DecodedToken {
//   id: number
//   username: string
//   role: string
// }

interface Entry {
  id: number
  fecha: Date
  monto: string
  beneficiario: string
  usuario: number
  facturado: number
  concepto: string
}

const Table: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  // const [userRole, setUserRole] = useState<string>('')
  // const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('token') // Asumiendo que el token se guarda en localStorage
    if (token) {
      // const decoded: DecodedToken = jwtDecode(token)
      // setUserRole(decoded.role) // Configurar el rol desde el token decodificado
      // setUserName(decoded.username)
    }
    fetchEntries()
    socket.on('newEntry', fetchEntries)
    socket.on('updateEntry', fetchEntries)
    socket.on('deleteEntry', fetchEntries)
  }, [])

  const formatCurrency = (amount: string) => {
    const number = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'DOP', // Usa 'DOP' para República Dominicana
      currencyDisplay: 'narrowSymbol'
    })
      .format(number)
      .replace('$', 'RD$')
  }

  const fetchEntries = async () => {
    try {
      const response = await axios.get<Entry[]>(`${url}/api/entries`)
      if (Array.isArray(response.data)) {
        setEntries(
          response.data.map((e) => ({
            ...e,
            fecha: new Date(e.fecha)
          }))
        )
      } else {
        setEntries([])
        console.error('La respuesta de la API no es un array', response)
      }
    } catch (error) {
      console.error('Error al obtener las entradas', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${url}/api/entries/${id}`)
      toast.success('Entrada eliminada')
      fetchEntries()
    } catch (error) {
      console.error('Error al eliminar la entrada', error)
      toast.error('Error al eliminar la entrada')
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Id',
      width: 35
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      type: 'date',
      width: 100
    },
    {
      field: 'monto',
      headerName: 'Monto',
      renderCell: (params) => formatCurrency(params.value.toString())
    },
    {
      field: 'beneficiario',
      headerName: 'Beneficiario',
      flex: 0.5
    },
    {
      field: 'usuario',
      headerName: 'Usuario'
    },
    {
      field: 'facturado',
      headerName: 'Facturado',
      type: 'boolean'
    },
    {
      field: 'concepto',
      headerName: 'Concepto',
      flex: 1,
      renderCell: (params) => params.value || 'Concepto vacio.'
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          onClick={() => handleDelete(parseInt(params.id.toString()))}
          label='Delete'
          icon={<TrashSVG />}
        />
      ]
    }
  ]

  return (
    <div>
      <h1>Cuentas por Pagar</h1>
      {/* <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Beneficiario</th>
            <th>Usuario</th>
            <th>Facturado</th>
            <th>Concepto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{new Date(entry.fecha).toLocaleDateString()}</td>
              <td>{formatCurrency(entry.monto)}</td>
              <td>{entry.beneficiario}</td>
              <td>
                {entry.usuario === 1
                  ? 'Financiera'
                  : entry.usuario === 2
                  ? 'Compras'
                  : 'Desconocido'}
              </td>
              <td>{entry.facturado === 1 ? 'Sí' : 'No'}</td>
              <td>{entry.concepto || 'Concepto vacio.'}</td>
              <td>
                {userRole === 'admin' ? (
                  <button onClick={() => handleDelete(entry.id)}>
                    Eliminar
                  </button>
                ) : (
                  <span>No permisos</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <DataGrid
        rows={entries}
        columns={columns}
        autosizeOnMount
        sx={{
          width: '100%',
          margin: 'auto',
          transition: 'all 1s ease'
        }}
      />
    </div>
  )
}

export default Table

function TrashSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='currentColor'
        d='M2.75 6.167c0-.46.345-.834.771-.834h2.665c.529-.015.996-.378 1.176-.916l.03-.095l.115-.372c.07-.228.131-.427.217-.605c.338-.702.964-1.189 1.687-1.314c.184-.031.377-.031.6-.031h3.478c.223 0 .417 0 .6.031c.723.125 1.35.612 1.687 1.314c.086.178.147.377.217.605l.115.372l.03.095c.18.538.74.902 1.27.916h2.57c.427 0 .772.373.772.834S20.405 7 19.979 7H3.52c-.426 0-.771-.373-.771-.833M11.607 22h.787c2.707 0 4.06 0 4.941-.863c.88-.864.97-2.28 1.15-5.111l.26-4.081c.098-1.537.147-2.305-.295-2.792s-1.187-.487-2.679-.487H8.23c-1.491 0-2.237 0-2.679.487s-.392 1.255-.295 2.792l.26 4.08c.18 2.833.27 4.248 1.15 5.112S8.9 22 11.607 22'
      />
    </svg>
  )
}
