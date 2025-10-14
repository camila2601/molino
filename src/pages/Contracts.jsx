import React, {useEffect, useState} from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Contracts(){
  const [emps,setEmps] = useState([]);
  const [contracts,setContracts] = useState([]);
  const [form,setForm] = useState({FECHA_INICIO:'',FECHA_FIN:'',VALOR_CONTRATO:'',EMPLOYEE_ID:''});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(()=>{ fetchAll() },[]);
  async function fetchAll(){
    const eSnap = await getDocs(collection(db,'employees'));
    setEmps(eSnap.docs.map(d=>({id:d.id,...d.data()})));
    const cSnap = await getDocs(collection(db,'contracts'));
    setContracts(cSnap.docs.map(d=>({id:d.id,...d.data()})));
  }

  async function save(){
    try {
      const emp = emps.find(x=>x.id===form.EMPLOYEE_ID);
      if(!emp){ alert('Seleccione empleado'); return; }
      const contractData = {
        FECHA_INICIO: form.FECHA_INICIO,
        FECHA_FIN: form.FECHA_FIN,
        VALOR_CONTRATO: Number(form.VALOR_CONTRATO),
        EMPLOYEE_REF: `employees/${emp.id}`,
        EMPLOYEE_SNAPSHOT: { NOMBRE: emp.NOMBRE, APELLIDO: emp.APELLIDO, NRO_DOCUMENTO: emp.NRO_DOCUMENTO },
      };
      if (editingId) {
        await updateDoc(doc(db, 'contracts', editingId), {...contractData, updatedAt:new Date()});
        setMessage('Contrato actualizado exitosamente.');
      } else {
        await addDoc(collection(db,'contracts'), {...contractData, createdAt: new Date()});
        setMessage('Contrato guardado exitosamente.');
      }
      setForm({FECHA_INICIO:'',FECHA_FIN:'',VALOR_CONTRATO:'',EMPLOYEE_ID:''});
      setEditingId(null);
      fetchAll();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al guardar: ' + error.message);
    }
  }

  function editContract(contract) {
    setForm({
      FECHA_INICIO: contract.FECHA_INICIO,
      FECHA_FIN: contract.FECHA_FIN,
      VALOR_CONTRATO: contract.VALOR_CONTRATO,
      EMPLOYEE_ID: contract.EMPLOYEE_REF.split('/')[1] // Extract employee ID
    });
    setEditingId(contract.id);
  }

  async function deleteContract(id) {
    if (window.confirm('¿Estás seguro de eliminar este contrato?')) {
      try {
        await deleteDoc(doc(db, 'contracts', id));
        setMessage('Contrato eliminado exitosamente.');
        fetchAll();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error al eliminar: ' + error.message);
      }
    }
  }

  return (<div className="page-content">
    <h2>Contratos</h2>
    {message && <p style={{color: 'green'}}>{message}</p>}
    <div>
      <div className="form-group">
        <select value={form.EMPLOYEE_ID} onChange={e=>setForm({...form,EMPLOYEE_ID:e.target.value})}>
          <option value=''>--Seleccionar empleado--</option>
          {emps.map(x=> <option key={x.id} value={x.id}>{x.NOMBRE} {x.APELLIDO}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Fecha Inicio</label>
        <input type='date' value={form.FECHA_INICIO} onChange={e=>setForm({...form,FECHA_INICIO:e.target.value})} />
      </div>
      <div className="form-group">
        <label>Fecha Fin</label>
        <input type='date' value={form.FECHA_FIN} onChange={e=>setForm({...form,FECHA_FIN:e.target.value})} />
      </div>
      <div className="form-group">
        <input placeholder='Valor contrato' type='number' value={form.VALOR_CONTRATO} onChange={e=>setForm({...form,VALOR_CONTRATO:e.target.value})} />
      </div>
      <div className="button-group">
        <button onClick={save}>{editingId ? 'Actualizar' : 'Guardar'}</button>
        {editingId && <button onClick={() => {setForm({FECHA_INICIO:'',FECHA_FIN:'',VALOR_CONTRATO:'',EMPLOYEE_ID:''}); setEditingId(null);}}>Cancelar</button>}
      </div>
    </div>
    <hr/>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Valor Contrato</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(c=> (
            <tr key={c.id}>
              <td>{c.EMPLOYEE_SNAPSHOT?.NOMBRE} {c.EMPLOYEE_SNAPSHOT?.APELLIDO} ({c.EMPLOYEE_SNAPSHOT?.NRO_DOCUMENTO})</td>
              <td>{c.FECHA_INICIO}</td>
              <td>{c.FECHA_FIN}</td>
              <td>{c.VALOR_CONTRATO}</td>
              <td>
                <div className="table-actions">
                  <button onClick={() => editContract(c)}>Editar</button>
                  <button onClick={() => deleteContract(c.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>)
}
