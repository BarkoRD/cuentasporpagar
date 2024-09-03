import React from 'react'
import Table from './components/Table'
import Notification from './components/Notification'
import Login from './components/Login'
import LogoutButton from './components/LogoutButton'
import { CreateEntryForm } from './components/CreateEntryForm'

const App: React.FC = () => {
  const token = localStorage.getItem('token')

  return (
    <div>
      {token ? (
        <>
          <LogoutButton />
          <Table />
          <CreateEntryForm
            userName='dolfo'
          />
          <Notification />
        </>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
