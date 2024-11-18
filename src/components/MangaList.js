import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const MangaList = ({ filter = 'all' }) => {
  const [mangaList, setMangaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMangaList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        limit: 18,
        offset: (page - 1) * 18,
        includes: ['cover_art'],
      };

      if (filter === 'popular') {
        params.order = { followedCount: 'desc' };
      } else if (filter === 'latest') {
        params.order = { createdAt: 'desc' };
      }
      
      if (searchQuery) {
        params.title = searchQuery;
      }

      const result = await axios.get('https://api.mangadex.org/manga', { params });

      setMangaList(result.data.data);
      setTotalPages(Math.ceil(result.data.total / 18));
    } catch (error) {
      setError('Failed to load manga. Please try again later.');
      console.error('Error fetching manga:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, page, filter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMangaList();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [fetchMangaList]);

  const getCoverImage = (manga) => {
    const coverArt = manga.relationships?.find(rel => rel.type === 'cover_art');
    return coverArt ? 
      `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes?.fileName}` :
      '/api/placeholder/200/300';
  };

  return (
    <div className="container">
      <div className="search-section">
        <h2>{filter === 'popular' ? 'Popular Manga' : 
             filter === 'latest' ? 'Latest Updates' : 
             'Browse Manga'}</h2>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search manga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">
            <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="manga-grid">
          {mangaList.map((manga) => (
            <div key={manga.id} className="manga-item">
              <div className="manga-image">
                <img 
                  src={getCoverImage(manga)} 
                  alt={manga.attributes?.title || 'Manga Cover'} 
                />
              </div>
              <div className="manga-info">
  <h3 className="manga-title">
    {manga.attributes?.title?.en || 'Untitled Manga'}
  </h3>
  <a href={`https://mangadex.org/title/${manga.id}`} target="_blank" rel="noopener noreferrer" className="manga-read-btn">Read Manga</a>
</div>

            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
                className="pagination-btn" disabled={page <= 1}>
          Previous
        </button>
        <div className="pagination-info">Page {page} of {totalPages}</div>
        <button onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                className="pagination-btn" disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MangaList;
