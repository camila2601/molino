import React, {useEffect, useState} from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function getSalaryEstimate(cargo) {
  const salaries = {
    'Gerente General': 11500000, // Midpoint of 8M-15M
    'Gerente de Producción': 8000000, // Midpoint of 6M-10M
    'Gerente Comercial / Ventas': 7000000, // Midpoint of 5M-9M
    'Jefe de Planta': 5500000, // Midpoint of 4M-7M
    'Supervisor de Producción': 4000000, // Midpoint of 3M-5M
    'Operario de Molino / Máquina': 2000000, // Midpoint of 1.5M-2.5M
    'Auxiliar de Producción': 1500000, // Midpoint of 1.2M-1.8M
    'Técnico de Mantenimiento': 3500000, // Midpoint of 2.5M-4M
    'Jefe de Almacén / Inventarios': 3500000, // Midpoint of 2.5M-4M
    'Operario de Almacén': 1500000, // Midpoint of 1.2M-1.8M
    'Conductor / Transporte': 2000000, // Midpoint of 1.5M-2.5M
    'Contador / Administrador': 4000000, // Midpoint of 3M-5M
    'Auxiliar Administrativo': 1600000, // Midpoint of 1.2M-2M
    'Recursos Humanos': 3500000, // Midpoint of 2.5M-4M
  };
  return salaries[cargo] || 0;
}

export default function Employees(){
  const [emps,setEmps] = useState([]);
  const [form,setForm] = useState({NRO_DOCUMENTO:'',NOMBRE:'',APELLIDO:'',EDAD:'',GENERO:'',CARGO:'',CORREO:'',NRO_CONTACTO:'',ESTADO:'activo',OBSERVACIONES:''});
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  async function load(){
    const snap = await getDocs(collection(db,'employees'));
    setEmps(snap.docs.map(d=>({id:d.id,...d.data()})));
  }
  useEffect(()=>{ load() },[]);

  async function save(){
    // Validation
    const requiredFields = ['NRO_DOCUMENTO', 'NOMBRE', 'APELLIDO', 'EDAD', 'GENERO', 'CARGO', 'CORREO', 'NRO_CONTACTO', 'ESTADO'];
    for (let field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === '') {
        setMessage(`El campo ${field.replace('_', ' ')} es obligatorio.`);
        return;
      }
    }
    if (isNaN(form.EDAD) || parseInt(form.EDAD) <= 0) {
      setMessage('La edad debe ser un número positivo.');
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'employees', editingId), {...form, updatedAt:new Date()});
        setMessage('Empleado actualizado exitosamente.');
      } else {
        await addDoc(collection(db,'employees'), {...form, createdAt:new Date()});
        setMessage('Empleado guardado exitosamente.');
      }
      setForm({NRO_DOCUMENTO:'',NOMBRE:'',APELLIDO:'',EDAD:'',GENERO:'',CARGO:'',CORREO:'',NRO_CONTACTO:'',ESTADO:'activo',OBSERVACIONES:''});
      setEditingId(null);
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al guardar: ' + error.message);
    }
  }

  function editEmp(emp) {
    setForm(emp);
    setEditingId(emp.id);
  }

  async function deleteEmp(id) {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        await deleteDoc(doc(db, 'employees', id));
        setMessage('Empleado eliminado exitosamente.');
        load();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error al eliminar: ' + error.message);
      }
    }
  }

  return (<div className="page-content">
    <h2>Empleados</h2>
    {message && <p style={{color: 'green'}}>{message}</p>}
    <div>
      <div className="form-group">
        <input placeholder='NRO_DOCUMENTO' value={form.NRO_DOCUMENTO} onChange={e=>setForm({...form,NRO_DOCUMENTO:e.target.value})} />
      </div>
      <div className="form-group">
        <input placeholder='NOMBRE' value={form.NOMBRE} onChange={e=>setForm({...form,NOMBRE:e.target.value})} />
      </div>
      <div className="form-group">
        <input placeholder='APELLIDO' value={form.APELLIDO} onChange={e=>setForm({...form,APELLIDO:e.target.value})} />
      </div>
      <div className="form-group">
        <input placeholder='EDAD' type='number' value={form.EDAD} onChange={e=>setForm({...form,EDAD:e.target.value})} />
      </div>
      <div className="form-group">
        <select value={form.GENERO} onChange={e=>setForm({...form,GENERO:e.target.value})}>
          <option value=''>GÉNERO</option>
          <option value='Masculino'>Masculino</option>
          <option value='Femenino'>Femenino</option>
          <option value='Otro'>Otro</option>
        </select>
      </div>
      <div className="form-group">
        <select value={form.CARGO} onChange={e=>setForm({...form,CARGO:e.target.value})}>
          <option value=''>Selecciona CARGO</option>
          <option value='Gerente General'>Gerente General</option>
          <option value='Gerente de Producción'>Gerente de Producción</option>
          <option value='Gerente Comercial / Ventas'>Gerente Comercial / Ventas</option>
          <option value='Jefe de Planta'>Jefe de Planta</option>
          <option value='Supervisor de Producción'>Supervisor de Producción</option>
          <option value='Operario de Molino / Máquina'>Operario de Molino / Máquina</option>
          <option value='Auxiliar de Producción'>Auxiliar de Producción</option>
          <option value='Técnico de Mantenimiento'>Técnico de Mantenimiento</option>
          <option value='Jefe de Almacén / Inventarios'>Jefe de Almacén / Inventarios</option>
          <option value='Operario de Almacén'>Operario de Almacén</option>
          <option value='Conductor / Transporte'>Conductor / Transporte</option>
          <option value='Contador / Administrador'>Contador / Administrador</option>
          <option value='Auxiliar Administrativo'>Auxiliar Administrativo</option>
          <option value='Recursos Humanos'>Recursos Humanos</option>
        </select>
      </div>
      <div className="form-group">
        <p style={{margin: '5px 0', fontWeight: 'bold'}}>Salario estimado: {getSalaryEstimate(form.CARGO)} COP</p>
      </div>
      <div className="form-group">
        <input placeholder='CORREO' type='email' value={form.CORREO} onChange={e=>setForm({...form,CORREO:e.target.value})} />
      </div>
      <div className="form-group">
        <input placeholder='NRO_CONTACTO' value={form.NRO_CONTACTO} onChange={e=>setForm({...form,NRO_CONTACTO:e.target.value})} />
      </div>
      <div className="form-group">
        <select value={form.ESTADO} onChange={e=>setForm({...form,ESTADO:e.target.value})}>
          <option value='activo'>Activo</option>
          <option value='retirado'>Retirado</option>
        </select>
      </div>
      <div className="form-group">
        <textarea placeholder='OBSERVACIONES' value={form.OBSERVACIONES} onChange={e=>setForm({...form,OBSERVACIONES:e.target.value})} />
      </div>
      <div className="button-group">
        <button onClick={save}>{editingId ? 'Actualizar' : 'Guardar'}</button>
        {editingId && <button onClick={() => {setForm({NRO_DOCUMENTO:'',NOMBRE:'',APELLIDO:'',EDAD:'',GENERO:'',CARGO:'',CORREO:'',NRO_CONTACTO:'',ESTADO:'activo',OBSERVACIONES:''}); setEditingId(null);}}>Cancelar</button>}
      </div>
    </div>
    <hr/>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>NRO_DOCUMENTO</th>
            <th>NOMBRE</th>
            <th>APELLIDO</th>
            <th>EDAD</th>
            <th>GÉNERO</th>
            <th>CARGO</th>
            <th>CORREO</th>
            <th>NRO_CONTACTO</th>
            <th>ESTADO</th>
            <th>OBSERVACIONES</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {emps.map(e=> (
            <tr key={e.id}>
              <td>{e.NRO_DOCUMENTO}</td>
              <td>{e.NOMBRE}</td>
              <td>{e.APELLIDO}</td>
              <td>{e.EDAD}</td>
              <td>{e.GENERO}</td>
              <td>{e.CARGO}</td>
              <td>{e.CORREO}</td>
              <td>{e.NRO_CONTACTO}</td>
              <td>{e.ESTADO}</td>
              <td>{e.OBSERVACIONES}</td>
              <td>
                <div className="table-actions">
                  <button onClick={() => editEmp(e)}>Editar</button>
                  <button onClick={() => deleteEmp(e.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>)
}
