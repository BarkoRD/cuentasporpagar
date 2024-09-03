programa para llevar las cuentas por pagar del ayuntamiento.

las cuentas por pagar son entradas de compromisos a pagar ejemplo "pepe" le dice al alcalde que se le daño su motor y que necesita unas piezas, el alcalde le dice que vaya al departamento de compras que el llamara para que lo ayuden. El departamento de compras gestionara el proceso para lograr la peticion. luego ella crea la entrada de esa "orden de compra o CREDITO o ESPERANDO CHEQUE" y ahi usa el programa.

el programa necesita mandar una notificacion a todas las computadoras con el sistema instalado
de que se ha generado una nueva entrada o el balance de las cuentas por pagar haya bajado o subido.

el programa sera una tabla como si fuera un simple exel solo que estara vinculado a la base de datos y cada cambio GUARDADO sera notificado a todos los sistemas mas a futuro poder especificar a que sistemas se les notificara especificamente.

la tabla tendra:
el valor total de todas las entradas registradas en pesos.
las entradas ordenadas por id, fecha, monto, beneficiaro, usuario.

podras editar o borrar entradas que haya creado el mismo usuario y al crear entradas se le asignara automaticante la persona que la creo.


para que funcione en red local hay que cambiar vite config

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red
    port: 5173,      // El puerto que quieres usar, predeterminado es 5173
  },
})

y el listen del sv

server.listen(4000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:4000')
})


y el socket del lado del cliente

import { io } from 'socket.io-client';

const socket = io('http://192.168.1.13:4000'); 