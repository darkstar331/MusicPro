'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { setCurrent, current, setIsLiked } = useMusicPlayer();

    useEffect(() => {
        if (current) {
            console.log('Current Song:', current);
        }
    }, [current]);

    useEffect(() => {
        const fetchSongs = async () => {
            if (query.trim()) {
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
        setTimeout(() => {
            setShowSearchBar(false); // Hide the search bar after 2 seconds
        }, 2000);
    };

    const handleCloseSearchBar = () => {
        setQuery(''); // Clear the input field
        setShowResult(false); // Hide search results
        setTimeout(() => {
            setShowSearchBar(false); // Hide the search bar after 2 seconds
        }, 2000);
    };

    return (
        <div className="relative w-full h-3 pt-3 md:pt-7 max-w-lg mx-auto">
            {!showSearchBar && (
                <button 
                    onClick={() => setShowSearchBar(true)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] transition-colors duration-300 focus:outline-none absolute right-[15rem]"
                >
                    <FaSearch className="text-white w-6 h-6" />
                </button>
            )}
            
            <AnimatePresence>
                {showSearchBar && (
                    <motion.div
                        className="flex items-center bg-transparent text-white pl-4 pr-2 py-2"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <input
                            type="text"
                            placeholder={showSearchBar ? "What do you want to listen to?" : ""}
                            className="flex-grow border-b-2 border-white p-2 text-base font-bold text-white bg-transparent outline-none placeholder-white"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowResult(true)} // Show results when focused
                            style={{ fontSize: '16px' }} // Ensure font size is at least 16px
                        />
                        <FaSearch className="text-white w-6 h-6 cursor-pointer ml-2" onClick={handleCloseSearchBar} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showResult && songs.length > 0 && (
                    <motion.ul
                        className="absolute z-10 w-full mt-2 overflow-y-auto bg-white rounded-xl max-h-60 shadow-lg hidden-scrollbar border border-gray-300"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {songs.map((song) => (
                            <li
                                key={song.videoId}
                                className="flex items-center gap-4 p-3 transition-colors cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSongClick(song)}
                            >
                                <Image
                                    src={song.thumbnail}
                                    alt={song.title}
                                    width={48}
                                    height={48}
                                    className="rounded-md"
                                />
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-black truncate">{song.title}</span>
                                    <span className="text-sm text-gray-500">{song.channel}</span>
                                </div>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
