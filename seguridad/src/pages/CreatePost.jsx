import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost({ token }) {
  const [form, setForm] = useState({ title: '', content: '', author: '' });
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
          <input name="author" placeholder="Autor" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa'}} />
          <textarea name="content" placeholder="Contenido" onChange={handleChange} required style={{fontSize: 16, background: '#f3f6fa', minHeight: 80}} />
          <button type="submit" style={{marginTop: 8, fontSize: 17, padding: '12px 0'}}>Publicar</button>
          {msg && <div className={msg.includes('Error') ? 'error' : 'msg'}>{msg}</div>}
        </form>
      </div>
    );
}

export default CreatePost;
