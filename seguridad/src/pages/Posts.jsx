// TODO: Cambié el renderizado de posts para prevenir XSS.
// Eliminé `dangerouslySetInnerHTML` y muestro el contenido como texto.
// Razón: evitar ejecución de HTML/JS inyectado en los posts.
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/posts`)
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

    return (
      <div className="container">
        <h2>Posts</h2>
        {posts.length === 0 && <div className="msg">No hay posts aún.</div>}
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <div style={{marginBottom: 8, whiteSpace: 'pre-wrap'}}>{post.content}</div>
            <small>Autor: {post.author}</small>
          </div>
        ))}
      </div>
    );
}

export default Posts;
