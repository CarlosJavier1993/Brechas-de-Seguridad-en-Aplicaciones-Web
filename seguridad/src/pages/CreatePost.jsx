import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost({ token }) {
  // TODO: Form sin campo author - el author se deriva del servidor desde el token JWT.
  // Previamente: form.author aceptaba cualquier valor del cliente (suplantación de identidad).
  const [form, setForm] = useState({ title: '', content: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/posts`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Post creado');
      setTimeout(() => navigate('/'), 1000);
    } catch {
      setMsg('Error al crear post');
    }
  };

    return (
      <div className="container">
        <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12}}>
          <h2 style={{textAlign: 'center', marginBottom: 24, color: '#2563eb'}}>Crear Post</h2>
          <input name="title" placeholder="Título" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          {/* TODO: Removí el campo author del formulario.
              Previamente: <input name="author" /> permitía suplantación (crear posts como otro usuario).
              Ahora: Backend obtiene author del token JWT autenticado. */}
          <textarea name="content" placeholder="Contenido" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa', minHeight: 80}} />
          <button type="submit" style={{marginTop: 8, fontSize: 17, padding: '12px 0'}}>Publicar</button>
          {msg && <div className={msg.includes('Error') ? 'error' : 'msg'}>{msg}</div>}
        </form>
      </div>
    );
}

export default CreatePost;
