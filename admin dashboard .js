import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [homepageContent, setHomepageContent] = useState('');
  const [animeDescription, setAnimeDescription] = useState('');
  const [mirrorLinks, setMirrorLinks] = useState(['']);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    
    // Verify token
    fetch('/admin/api/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        setAuthenticated(true);
        // Load initial data
        loadAnimeList();
        loadHomepageContent();
      } else {
        router.push('/admin');
      }
    });
  }, [router]);

  const loadAnimeList = async () => {
    const res = await fetch('/admin/api/content?type=animeList');
    const data = await res.json();
    setAnimeList(data.animeList || []);
  };

  const loadHomepageContent = async () => {
    const res = await fetch('/admin/api/content?type=homepage');
    const data = await res.json();
    setHomepageContent(data.content || '');
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (type === 'episode') {
      formData.append('animeId', selectedAnime);
      formData.append('episodeNumber', episodeNumber);
    }

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/admin/api/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    setMessage(data.message);
    if (data.success) {
      loadAnimeList();
    }
  };

  const updateContent = async (type) => {
    const token = localStorage.getItem('adminToken');
    const body = type === 'homepage' 
      ? { type, content: homepageContent }
      : { type, animeId: selectedAnime, content: animeDescription };

    const res = await fetch('/admin/api/content', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const addMirrorLink = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/admin/api/mirrors', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        animeId: selectedAnime,
        episodeNumber,
        mirrors: mirrorLinks.filter(link => link.trim() !== '')
      })
    });

    const data = await res.json();
    setMessage(data.message);
    if (data.success) {
      setMirrorLinks(['']);
    }
  };

  const addMirrorInput = () => {
    setMirrorLinks([...mirrorLinks, '']);
  };

  const updateMirrorLink = (index, value) => {
    const newLinks = [...mirrorLinks];
    newLinks[index] = value;
    setMirrorLinks(newLinks);
  };

  if (!authenticated) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-500">AniFans Admin Panel</h1>
          <Link href="/">
            <a className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">View Site</a>
          </Link>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-900' : 'bg-red-900'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Episodes */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Upload Episode</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Anime</label>
              <select 
                value={selectedAnime} 
                onChange={(e) => setSelectedAnime(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="">Select Anime</option>
                {animeList.map(anime => (
                  <option key={anime.id} value={anime.id}>{anime.title}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Episode Number</label>
              <input 
                type="text" 
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Upload MP4 File</label>
              <input 
                type="file" 
                accept=".mp4"
                onChange={(e) => handleFileUpload(e, 'episode')}
                className="w-full"
              />
            </div>
          </div>

          {/* Add Thumbnails */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Add Anime Thumbnail</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Anime</label>
              <select 
                value={selectedAnime} 
                onChange={(e) => setSelectedAnime(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="">Select Anime</option>
                {animeList.map(anime => (
                  <option key={anime.id} value={anime.id}>{anime.title}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Upload Image (JPG/PNG)</label>
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, 'thumbnail')}
                className="w-full"
              />
            </div>
          </div>

          {/* Edit Content */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Edit Homepage Content</h2>
            <textarea 
              value={homepageContent}
              onChange={(e) => setHomepageContent(e.target.value)}
              className="w-full h-32 bg-gray-700 p-2 rounded mb-4"
            />
            <button 
              onClick={() => updateContent('homepage')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Update Homepage
            </button>
          </div>

          {/* Anime Descriptions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Edit Anime Description</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Anime</label>
              <select 
                value={selectedAnime} 
                onChange={(e) => setSelectedAnime(e.target.value)}
                className="w-full bg-gray-700 p-2 rounded"
              >
                <option value="">Select Anime</option>
                {animeList.map(anime => (
                  <option key={anime.id} value={anime.id}>{anime.title}</option>
                ))}
              </select>
            </div>
            <textarea 
              value={animeDescription}
              onChange={(e) => setAnimeDescription(e.target.value)}
              className="w-full h-32 bg-gray-700 p-2 rounded mb-4"
            />
            <button 
              onClick={() => updateContent('description')}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Update Description
            </button>
          </div>

          {/* Mirror Links */}
          <div className="bg-gray-800 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Add Mirror Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2">Select Anime</label>
                <select 
                  value={selectedAnime} 
                  onChange={(e) => setSelectedAnime(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                >
                  <option value="">Select Anime</option>
                  {animeList.map(anime => (
                    <option key={anime.id} value={anime.id}>{anime.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Episode Number</label>
                <input 
                  type="text" 
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(e.target.value)}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={addMirrorInput}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded w-full"
                >
                  Add Mirror
                </button>
              </div>
            </div>
            {mirrorLinks.map((link, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => updateMirrorLink(index, e.target.value)}
                  placeholder={`Mirror Link ${index + 1}`}
                  className="w-full bg-gray-700 p-2 rounded"
                />
              </div>
            ))}
            <button 
              onClick={addMirrorLink}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mt-4"
            >
              Save Mirror Links
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

