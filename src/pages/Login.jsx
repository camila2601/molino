import React, {useState} from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [msg,setMsg]=useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const login = async ()=>{
    try{
      await signInWithEmailAndPassword(auth,email,pass);
      setMsg('Login exitoso. Redirigiendo...');
      // No need to reload, auth state change will handle navigation
    }catch(e){ setMsg('Error: '+e.message) }
  }

  const sendReset = async ()=>{
    if (!resetEmail.trim()) {
      setMsg('Por favor, ingresa tu correo electrónico.');
      return;
    }
    const email = resetEmail.trim();
    setMsg('Enviando enlace de recuperación...');
    try{
      await sendPasswordResetEmail(auth, email);
      setMsg('Si el correo está registrado, recibirás un enlace de recuperación.');
      setShowReset(false);
      setResetEmail('');
    }catch(e){
      console.error('Error en sendReset:', e);
      setMsg('Error: '+e.message);
    }
  }

  return (<div className="login-form">
    <h2>Talento Humano</h2>
    <div className="form-group">
      <input placeholder='Correo' value={email} onChange={e=>setEmail(e.target.value)} />
    </div>
    <div className="form-group">
      <input placeholder='Contraseña' type='password' value={pass} onChange={e=>setPass(e.target.value)} />
    </div>
    <div className="button-group">
      <button onClick={login}>Ingresar</button>
      <button onClick={() => setShowReset(true)}>Recuperar contraseña</button>
    </div>
    {showReset && (
      <div className="reset-modal">
        <h3>Restablecer Contraseña</h3>
        <div className="form-group">
          <input placeholder='Correo electrónico' value={resetEmail} onChange={e=>setResetEmail(e.target.value)} />
        </div>
        <div className="button-group">
          <button onClick={sendReset}>Enviar Enlace</button>
          <button onClick={() => setShowReset(false)}>Cancelar</button>
        </div>
      </div>
    )}
    <p className="message">{msg}</p>
  </div>)
}
