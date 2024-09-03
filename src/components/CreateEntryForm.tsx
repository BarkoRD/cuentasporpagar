import axios from 'axios'
import { toast } from 'react-toastify'
import { useForm } from '../services/hooks/useForm'

interface CreateEntryFormProps {
  userName: string
  // onEntryCreated: () => void // no hace falta...
}

export const CreateEntryForm: React.FC<CreateEntryFormProps> = ({
  userName
}) => {
  // const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  // const [monto, setMonto] = useState('');
  // const [beneficiario, setBeneficiario] = useState('');
  // const [facturado, setFacturado] = useState('0');
  // const [concepto, setConcepto] = useState('');
  const initialState = {
    fecha: new Date().toISOString().slice(0, 10),
    monto: '',
    beneficiario: '',
    facturado: '0',
    concepto: ''
  }

  const {
    fecha,
    monto,
    beneficiario,
    facturado,
    concepto,
    onInputChange,
    form: entry,
    setForm,
    resetForm
  } = useForm(initialState)

  // const montoFormatter = (monto: string) => {
  //   const value = monto.replace(/[^0-9.]/g, '') // Solo permite números y punto

  //   return value
  //     ? `RD$ ${parseFloat(value).toLocaleString('en-US', {
  //         minimumFractionDigits: 2
  //       })}`
  //     : ''
  // }

  // const handleBeneficiarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value
  //     .toUpperCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '') // Mayúsculas y sin tildes
  //   setBeneficiario(value)
  // }
  const handleMontoChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.value
      .replace(/[^0-9.]/g, '') // Solo permite números y punto
      .replace(/^0+/, '') // Remueve los ceros a la izquierda
    const formattedValue = value
      ? `RD$ ${parseFloat(value).toLocaleString('en-US', {
          minimumFractionDigits: 2
        })}`
      : ''
    setForm('monto', formattedValue)
  }
  const handleBeneficiarioChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.value
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Mayúsculas y sin tildes
    setForm('beneficiario', value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // const newEntry = {
      //   fecha,
      //   monto: monto.replace(/RD\$\s?/g, ''), // Remueve el prefijo "RD$" antes de enviar
      //   beneficiario,
      //   usuario: userName, // Usuario tomado del estado
      //   facturado: facturado === '1' ? 1 : 0, // Convierte a número 1 o 0
      //   concepto
      // }
      const newEntry = {
        ...entry,
        monto: entry.monto.replace(/RD\$\s?/g, ''), // Remueve el prefijo "RD$" antes de enviar
        usuario: userName // Usuario tomado del estado
      }
      const token = localStorage.getItem('token')
      // await axios.post('http://192.168.1.13:4000/api/entries', newEntry)
      await axios.post('http://localhost:4000/api/entries', newEntry, {
        headers: { Authorization: token }
      })
      toast.success('Entrada creada con éxito')
      resetForm()
      // onEntryCreated() // Llama a esta función para actualizar la lista de entradas
    } catch (error) {
      console.error('Error al crear la entrada', error)
      toast.error('Error al crear la entrada')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Fecha:
          <input
            name='fecha'
            type='date'
            value={fecha}
            onChange={onInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Monto:
          <input
            name='monto'
            type='text'
            value={monto}
            onChange={handleMontoChange}
          />
        </label>
      </div>
      <div>
        <label>
          Beneficiario:
          <input
            name='beneficiario'
            type='text'
            value={beneficiario}
            onChange={handleBeneficiarioChange}
          />
        </label>
      </div>
      <div>
        <label>
          Facturado:
          <select name='facturado' value={facturado} onChange={onInputChange}>
            <option value='1'>Sí</option>
            <option value='0'>No</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Concepto:
          <textarea name='concepto' value={concepto} onChange={onInputChange} />
        </label>
      </div>
      <button>Crear Entrada</button>
    </form>
  )
}
