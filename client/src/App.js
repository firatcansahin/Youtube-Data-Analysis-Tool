import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VideoAnalytics from './pages/VideoAnalytics';
import ChannelAnalytics from './pages/ChannelAnalytics';
import About from './pages/About';
import ChannelFinderPage from './pages/ChannelFinderPage';

function App() {
  return (
    <Router>
      <div className="App bg-youtube-black min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video-analytics" element={<VideoAnalytics />} />
            <Route path="/video/:resultId" element={<VideoAnalytics />} />
            <Route path="/channel-analytics" element={<ChannelAnalytics />} />
            <Route path="/channel/:resultId" element={<ChannelAnalytics />} />
            <Route path="/about" element={<About />} />
            <Route path="/channel-finder" element={<ChannelFinderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
