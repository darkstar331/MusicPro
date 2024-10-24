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
        <div className="playlist-container mt-16 p-1 md:p-6 rounded-lg shadow-lg">
            {playlist.length === 0 ? (
                <p className="empty-playlist text-gray-400 text-center">No liked songs yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto h-[28rem] py-4 hidden-scrollbar">
                    {playlist.map((song, index) => (
                        <div
                            key={index}
                            className="cursor-pointer text-center transition-transform transform hover:scale-110 bg-[#121212] p-6 rounded-lg shadow-md hover:shadow-lg w-64 md:w-56 sm:w-48"
                            onClick={() => handleSongClick(song)}  // Add onClick handler
                        >
                            <img 
                                src={song.thumbnail} 
                                alt={song.title} 
                                className="w-full h-56 object-cover rounded-md shadow-md md:h-48 sm:h-40"
                            />
                            <p className="mt-2 text-lg font-semibold text-[#1db954] truncate">{song.title}</p>
                            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                            <button 
                                className="remove-button mt-2 text-white hover:text-red-500 transition-colors" 
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent the click from setting the current song
                                    handleRemove(song.videoId);
                                }}
                                aria-label="Remove song"
                            >
                                <FaTrash className="remove-icon w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Playlist;



