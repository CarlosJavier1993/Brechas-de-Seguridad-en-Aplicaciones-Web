
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem('token', t);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Posts</Link> |{' '}
        {token ? (
          <>
            <Link to="/profile">Perfil</Link> |{' '}
            <Link to="/create">Crear Post</Link> |{' '}
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Registro</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile token={token} />} />
        <Route path="/create" element={<CreatePost token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
