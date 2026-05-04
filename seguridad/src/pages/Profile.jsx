import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile({ token }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, [token]);

  if (!token) return <div className="container"><div className="error">Debes iniciar sesión</div></div>;
  if (!profile) return <div className="container"><div className="msg">Cargando...</div></div>;

  return (
    <div className="container">
      <h2>Perfil</h2>
      <div style={{marginBottom: 8}}><b>Usuario:</b> {profile.username}</div>
      <div style={{marginBottom: 8}}><b>Email:</b> {profile.email}</div>
      <div style={{marginBottom: 8}}><b>Contraseña:</b> {profile.password}</div>
      <div><b>ID:</b> {profile.id}</div>
    </div>
  );
}

export default Profile;
