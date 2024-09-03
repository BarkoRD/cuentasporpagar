import React from 'react';
import Table from './components/Table';
import Notification from './components/Notification';
import Login from './components/Login';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token ? (
        <>
          <Table />
          <Notification />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
