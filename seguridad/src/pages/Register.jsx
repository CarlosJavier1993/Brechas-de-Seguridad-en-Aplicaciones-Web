import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, form);
      setMsg('Usuario registrado');
    } catch {
      setMsg('Error al registrar');
    }
  };

    return (
      <div className="container">
        <form onSubmit={handleSubmit} style={{maxWidth: 350, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12}}>
          <h2 style={{textAlign: 'center', marginBottom: 24, color: '#2563eb'}}>Registro</h2>
          <input name="username" placeholder="Usuario" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <input name="email" placeholder="Email" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <button type="submit" style={{marginTop: 8, fontSize: 17, padding: '12px 0'}}>Registrar</button>
          {msg && <div className={msg.includes('Error') ? 'error' : 'msg'}>{msg}</div>}
        </form>
      </div>
    );
}

export default Register;
