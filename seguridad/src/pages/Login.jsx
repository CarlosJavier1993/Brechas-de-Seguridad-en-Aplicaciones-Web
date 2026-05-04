import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, form);
      onLogin(res.data.token);
    } catch {
      setError('Credenciales inválidas');
    }
  };

    return (
      <div className="container">
        <form onSubmit={handleSubmit} style={{maxWidth: 350, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12}}>
          <h2 style={{textAlign: 'center', marginBottom: 24, color: '#2563eb'}}>Iniciar sesión</h2>
          <input name="username" placeholder="Usuario" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <button type="submit" style={{marginTop: 8, fontSize: 17, padding: '12px 0'}}>Entrar</button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
}

export default Login;
