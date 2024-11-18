import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MangaList from './components/MangaList';
import './App.css'; // Importing the custom CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="container">
            <div className="navbar-content">
              <div className="logo">
                <Link to="/" className="logo-text">
                  Manga Gueh
                </Link>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link nav-link-active">
                  Home
                </Link>
                <Link to="/popular" className="nav-link nav-link-inactive">
                  Popular
                </Link>
                <Link to="/latest" className="nav-link nav-link-inactive">
                  Latest
                </Link>
              </div>
              <div className="sign-in">
                <button className="sign-in-button">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<MangaList />} />
            <Route path="/popular" element={<MangaList filter="popular" />} />
            <Route path="/latest" element={<MangaList filter="latest" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container footer-content">
            <div className="footer-text">
              © 2024 MangaGueh. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
