'use client';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const { setCurrent, current, setIsLiked } = useMusicPlayer();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (current) {
            console.log('Current Song:', current);
        }
    }, [current]);

    useEffect(() => {
        const fetchSongs = async () => {
            if (query.trim()) {
                setLoading(true);
                setError('');
                try {
                    const response = await axios.get('/api/getResults', {
                        params: { query } 
                    });

                    const fetchedSongs = response.data.songs;
                    console.log('Songs:', fetchedSongs);

                    setSongs(fetchedSongs);
                    setShowResult(true);
                } catch (error) {
                    console.error('Error fetching YouTube data:', error);
                    setError('Failed to fetch songs. Please try again.');
                } finally {
                    setLoading(false);
                }
            } else {
                setSongs([]);
                setShowResult(false);
            }
        };

        // Debounce to prevent too many API calls
        const debounceTimer = setTimeout(fetchSongs, 300);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSongClick = (song) => {
        setCurrent(song);
        setQuery(''); // Clear the search bar
        setShowResult(false);
        setIsLiked(false);
    };

    const handleClearSearch = () => {
        setQuery(''); // Clear the input field
        setShowResult(false); // Hide search results
        inputRef.current.focus(); // Refocus on the input
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowResult(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full max-w-lg mx-auto mt-6 px-4" ref={containerRef}>
            {/* Search Input */}
            <div
                className="flex items-center bg-[#121212] text-white pl-4 pr-2 py-2 rounded-full shadow-lg transition-all duration-300"
            >
                <FaSearch className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="What do you want to listen to?"
                    className="flex-grow bg-transparent text-base font-medium text-white outline-none placeholder-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResult(true)} // Show results when focused
                    style={{ fontSize: '16px' }} // Ensure font size is at least 16px
                    aria-label="Search Songs"
                />
                {query && (
                    <FaTimes 
                        className="text-gray-400 w-5 h-5 cursor-pointer ml-2 flex-shrink-0"
                        onClick={handleClearSearch}
                        aria-label="Clear Search"
                    />
                )}
            </div>

            {/* Search Results */}
            {showResult && (
                <div className="absolute z-10 w-full max-w-lg mx-auto mt-2 overflow-y-auto bg-[#181818] rounded-xl max-h-60 shadow-lg border border-gray-700 custom-scrollbar">
                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 text-center text-red-500">
                            {error}
                        </div>
                    )}
                    {!loading && !error && songs.length === 0 && (
                        <div className="p-4 text-center text-gray-400">
                            No results found.
                        </div>
                    )}
                    {!loading && !error && songs.map((song) => (
                        <div
                            key={song.videoId}
                            className="flex items-center gap-4 p-3 transition-colors cursor-pointer hover:bg-[#282828]"
                            onClick={() => handleSongClick(song)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSongClick(song);
                            }}
                        >
                            <Image
                                src={song.thumbnail}
                                alt={song.title}
                                width={48}
                                height={48}
                                className="rounded-md"
                            />
                            <div className="flex flex-col">
                                <span className="text-base font-semibold text-white truncate">{song.title}</span>
                                <span className="text-sm text-gray-400">{song.channel}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Scrollbar Styling */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #181818;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #535353;
                    border-radius: 4px;
                }

                /* For Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #535353 #181818;
                }

                /* Adjust the position of search results to prevent overflow on mobile */
                @media (max-width: 640px) {
                    .absolute {
                        left: 50%;
                        transform: translateX(-50%);
                        width: calc(100% - 2rem); /* Adjust width with padding */
                    }
                }
            `}</style>
        </div>
    );
};

export default SearchBar;
