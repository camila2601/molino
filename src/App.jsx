import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Contracts from './pages/Contracts';
import Search from './pages/Search';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al iniciar la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPage('employees'); // Si hay usuario, va a employees
      } else {
        setUser(null);
        setPage('login'); // Si no hay usuario, va a login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Renderizado condicional basado en la página
  const renderPage = () => {
    switch (page) {
      case 'employees':
        return <Employees />;
      case 'contracts':
        return <Contracts />;
      case 'search':
        return <Search />;
      default:
        return <Login onLoginSuccess={() => setPage('employees')} />;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>SIRH - Molino de Arroz</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>SIRH - Molino de Arroz</h1>

      {/* Mostrar navbar solo si el usuario está autenticado */}
      {user && page !== 'login' && (
        <nav>
          <button onClick={() => setPage('employees')}>Empleados</button>
          <button onClick={() => setPage('contracts')}>Contratos</button>
          <button onClick={() => setPage('search')}>Buscar</button>
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                auth.signOut(); // Cierra sesión
                setUser(null);
                setPage('login'); // Redirige a login
              }
            }}
          >
            Logout
          </button>
        </nav>
      )}

      {renderPage()}
    </div>
  );
}
