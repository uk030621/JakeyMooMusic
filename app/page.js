'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [displayedImageUrl, setDisplayedImageUrl] = useState(''); // Store the currently displayed image
  const [storedUrls, setStoredUrls] = useState([]);
  const [error, setError] = useState('');

  const getContentType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    } else {
      return 'webpage';
    }
  };

  const fetchUrls = async () => {
    const res = await fetch('/api/urls');
    const data = await res.json();
    setStoredUrls(data.urls);
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError('Please enter a title.');
      return;
    }

    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    const res = await fetch('/api/urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title }),
    });

    if (res.ok) {
      setUrl('');
      setTitle('');
      setError('');
      fetchUrls();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/urls', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchUrls();
    }
  };

  const handleImageClick = (storedUrl) => {
    const contentType = getContentType(storedUrl.url);

    if (contentType === 'image') {
      setDisplayedImageUrl(storedUrl.url); // Update displayed image if it's an image
    } else {
      setDisplayedImageUrl(''); // Clear displayed image for non-image URLs
    }
  };

  const renderPreview = (storedUrl) => {
    const contentType = getContentType(storedUrl.url);

    switch (contentType) {
      case 'image':
        return (
          <img 
            src={storedUrl.url} 
            alt={storedUrl.title} 
            style={styles.previewImage} 
            onClick={() => handleImageClick(storedUrl)} // Clickable for images
          />
        );
      case 'video':
        return (
          <div style={styles.videoContainer}>
            <video controls style={styles.previewVideo}>
              <source src={storedUrl.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return (
          <div style={styles.webpagePreview}>
            <p>{storedUrl.title}</p>
            <a href={storedUrl.url} target="_blank" rel="noopener noreferrer" style={styles.previewLink}>
              Open Website
            </a>
          </div>
        );
    }
  }; 

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jake&apos;s Music Centre Selection</h1>
      <details style={{ textAlign: 'center', marginBottom: '10px' }}>
              <summary style={{color:'black', cursor: 'pointer', fontSize: '1.2rem', fontFamily:'arial', fontSize:'0.7rem'}}>Jake ❤️</summary>
                <div style={{ marginLeft: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image className='uk-pic'
                        src="/jake.JPG" 
                        alt="Portfolio Image" 
                        width={200}  
                        height={250} 
                        priority={true}
                        style={{ marginLeft: '5px', marginRight:'5px', marginBottom:'15px', borderRadius:'10px', border: '3px solid black' }}  
                    />
                </div>
        </details>

      {displayedImageUrl && (
        <img
          src={displayedImageUrl}
          alt="Displayed Media"
          style={styles.image}
        />
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter media URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Add Media</button>
      </form>

      <div>
  <h2 style={styles.subtitle}>Stored Media:</h2>
  <ul style={styles.urlList}>
    {storedUrls.map((storedUrl) => (
      <li key={storedUrl._id} style={styles.urlItem}>
        <div style={styles.previewContainer}>
          {renderPreview(storedUrl)}
          <button
            onClick={() => handleDelete(storedUrl._id)}
            style={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>


    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginTop:'10px',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '100%',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize:'17px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'contain',
    marginBottom: '20px',
  },
  previewImage: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer', // Change cursor to pointer
  },
  previewVideo: {
    width: '100%',
    maxHeight: '200px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  webpagePreview: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    textAlign: 'left',
  },
  previewLink: {
    color: '#0070f3',
    textDecoration: 'none',
  },
  urlList: {
    listStyleType: 'none',
    padding: 0,
    marginTop: '10px',
  },
  urlItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eaeaea',
    wordBreak: 'break-word',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'flex-start', // Left align items
    marginBottom: '10px', // Space between items
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

