'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useMusicPlayer } from '../context/MusicPlayerContext';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [showResult, setShowResult] = useState(false);
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
    };

    return (
        <div className="relative w-full pt-8 md:pt-16 max-w-lg mx-auto">
            <div className="flex items-center mx-4 md:mx-0 rounded-md md:rounded-2xl border md:border-4 border-pink-400 bg-transparent transition-colors md:focus-within:border-amber-600">
                <input
                    type="text"
                    placeholder="Enter song name here"
                    className="flex-grow p-4 text-sm md:p-5 font-bold text-white bg-transparent outline-none placeholder-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResult(true)} // Show results when focused
                />
            </div>

            {showResult && songs.length > 0 && (
                <ul className="absolute z-10 w-full mt-2 overflow-y-auto bg-[#00091D] border border-gray-600 rounded-xl max-h-60 shadow-lg hidden-scrollbar">
                    {songs.map((song) => (
                        <li
                            key={song.videoId}
                            className="flex items-center gap-4 p-3 transition-colors cursor-pointer hover:bg-amber-600"
                            onClick={() => handleSongClick(song)}
                        >
                            <Image
                                src={song.thumbnail}
                                alt={song.title}
                                width={48}
                                height={48}
                            />
                            <span className="text-sm font-medium text-white truncate">{song.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
