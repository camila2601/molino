import React, { useEffect, useState, useRef } from 'react';
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
  const tableRef = useRef(null);

  // Verificar autenticación al iniciar la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPage('employees'); // Va a employees si hay usuario
      } else {
        setUser(null);
        setPage('login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 👇 Siempre colocar scroll de tabla al inicio (izquierda)
  useEffect(() => {
    if (tableRef.current) tableRef.current.scrollLeft = 0;
  }, [page]);

  // Renderizado condicional
  const renderPage = () => {
    switch (page) {
      case 'employees':
        return <Employees tableRef={tableRef} />;
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

      {user && page !== 'login' && (
        <nav>
          <button onClick={() => setPage('employees')}>Empleados</button>
          <button onClick={() => setPage('contracts')}>Contratos</button>
          <button onClick={() => setPage('search')}>Buscar</button>
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de cerrar sesión?')) {
                auth.signOut();
                setUser(null);
                setPage('login');
              }
            }}
          >
            Salir
          </button>
        </nav>
      )}

      {renderPage()}
    </div>
  );
}
