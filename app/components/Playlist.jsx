'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaTrash } from 'react-icons/fa';

const Playlist = () => {
    const { playlist, setCurrent, handleRemove } = useMusicPlayer();
    const { data: session } = useSession();

    const handleSongClick = (song) => {
        setCurrent(song);  // Set the clicked song as the current song
    };

    return (
        <div className="playlist-container p-1 md:p-6 bg-gray-900 rounded-lg shadow-lg">
            {playlist.length === 0 ? (
                <p className="empty-playlist text-gray-400 text-center">No liked songs yet.</p>
            ) : (
                <div className="overflow-y-auto max-h-80 md:max-h-96 hidden-scrollbar">
                    <ul className="playlist space-y-4">
                        {playlist.map((song, index) => (
                            <li 
                                key={index} 
                                className="playlist-item flex items-center bg-gray-800 rounded-lg p-3 transition-transform transform hover:-translate-y-1 hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleSongClick(song)}  // Add onClick handler
                            >
                                <img 
                                    src={song.thumbnail} 
                                    alt={song.title} 
                                    className="song-thumbnail w-16 h-16 rounded-lg object-cover mr-4"
                                />
                                <div className="song-details flex-1">
                                    <span className="song-title text-white font-medium">{song.title}</span>
                                </div>
                                <button 
                                    className="remove-button text-red-500 hover:text-red-700 transition-colors" 
                                    onClick={(e) => {
                                        e.stopPropagation();  // Prevent the click from setting the current song
                                        handleRemove(song.videoId);
                                    }}
                                    aria-label="Remove song"
                                >
                                    <FaTrash className="remove-icon w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Playlist;

