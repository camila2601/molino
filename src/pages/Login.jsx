import React, {useState} from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [msg,setMsg]=useState('');
  const login = async ()=>{
    try{
      await signInWithEmailAndPassword(auth,email,pass);
      setMsg('Login exitoso. Redirigiendo...');
      // No need to reload, auth state change will handle navigation
    }catch(e){ setMsg('Error: '+e.message) }
  }
  const reset = async ()=>{
    try{
      await sendPasswordResetEmail(auth,email);
      setMsg('Correo de recuperación enviado.');
    }catch(e){ setMsg('Error: '+e.message) }
  }
  return (<div>
    <h2>Login - Talento Humano</h2>
    <input placeholder='Correo' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
    <input placeholder='Contraseña' type='password' value={pass} onChange={e=>setPass(e.target.value)} /><br/>
    <button onClick={login}>Ingresar</button>
    <button onClick={reset}>Recuperar contraseña</button>
    <p>{msg}</p>
  </div>)
}
