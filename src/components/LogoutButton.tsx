import React from 'react';

const LogoutButton: React.FC = () => {
  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    window.location.href = '/login'; // Redirige al usuario a la página de login
  };

  return (
    <button onClick={logout} style={buttonStyle}>
      Logout
    </button>
  );
};

// Opcional: Estilo para el botón
const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#ff0000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default LogoutButton;
