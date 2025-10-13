import React, { useEffect } from 'react';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Contracts from './pages/Contracts';
import Search from './pages/Search';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function App(){
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPage('employees'); // Redirigir a empleados si está autenticado
      } else {
        setUser(null);
        setPage('login');
      }
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    switch(page) {
      case 'employees': return <Employees />;
      case 'contracts': return <Contracts />;
      case 'search': return <Search />;
      default: return <Login />;
    }
  };

  return (<div className="container">
    <h1>SIRH - Molino de Arroz</h1>
    {page !== 'login' && (
      <nav>
        <button onClick={() => setPage('employees')}>Empleados</button>
        <button onClick={() => setPage('contracts')}>Contratos</button>
        <button onClick={() => setPage('search')}>Buscar</button>
        <button onClick={() => setPage('login')}>Logout</button>
      </nav>
    )}
    {renderPage()}
  </div>)
}
