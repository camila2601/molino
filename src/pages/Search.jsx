import React, {useEffect, useState} from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { exportEmployeeContractsPdf } from '../utils/exportPdf';
import { exportContractsXlsx } from '../utils/exportXlsx';

export default function Search(){
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [contracts, setContracts] = useState([]);

  async function searchEmployees(){
    if (!searchTerm.trim()) return;
    const q = query(collection(db, 'employees'), where('NOMBRE', '>=', searchTerm), where('NOMBRE', '<=', searchTerm + '\uf8ff'));
    const snap = await getDocs(q);
    let results = snap.docs.map(d => ({id: d.id, ...d.data()}));
    // Also search by NRO_DOCUMENTO
    const q2 = query(collection(db, 'employees'), where('NRO_DOCUMENTO', '==', searchTerm));
    const snap2 = await getDocs(q2);
    results = [...results, ...snap2.docs.map(d => ({id: d.id, ...d.data()}))];
    // Remove duplicates
    const unique = results.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    setEmployees(unique);
  }

  async function loadContracts(empId){
    const q = query(collection(db, 'contracts'), where('EMPLOYEE_REF', '==', `employees/${empId}`));
    const snap = await getDocs(q);
    setContracts(snap.docs.map(d => ({id: d.id, ...d.data()})));
  }

  function selectEmployee(emp){
    setSelectedEmployee(emp);
    loadContracts(emp.id);
  }

  function exportToPdf(){
    if (!selectedEmployee || contracts.length === 0) return;
    exportEmployeeContractsPdf(selectedEmployee, contracts);
  }

  function exportToXlsx(){
    if (!selectedEmployee || contracts.length === 0) return;
    exportContractsXlsx(selectedEmployee, contracts);
  }

  return (<div>
    <h2>Búsqueda de Empleados y Contratos</h2>
    <input placeholder='Buscar por nombre o NRO_DOCUMENTO' value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
    <button onClick={searchEmployees}>Buscar</button>
    <hr/>
    {employees.map(e => (
      <div key={e.id} onClick={() => selectEmployee(e)} style={{cursor: 'pointer', padding: '10px', border: '1px solid #ccc', margin: '5px'}}>
        {e.NOMBRE} {e.APELLIDO} - {e.NRO_DOCUMENTO}
      </div>
    ))}
    {selectedEmployee && (
      <div>
        <h3>Contratos de {selectedEmployee.NOMBRE} {selectedEmployee.APELLIDO}</h3>
        <button onClick={exportToPdf}>Exportar a PDF</button>
        <button onClick={exportToXlsx}>Exportar a XLSX</button>
        <table border="1" style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Valor Contrato</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id}>
                <td>{c.FECHA_INICIO}</td>
                <td>{c.FECHA_FIN}</td>
                <td>{c.VALOR_CONTRATO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>)
}
