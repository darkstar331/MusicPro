import { useSession } from 'next-auth/react';
import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaTrash, FaMusic, FaPlay } from 'react-icons/fa';

const Playlist = () => {
    const { playlist, setCurrent, handleRemove } = useMusicPlayer();
    const { data: session } = useSession();

    const handleSongClick = (song) => {
        setCurrent(song);  // Set the clicked song as the current song
    };

    return (
        <div className="playlist-container mt-16 p-4 md:p-10 rounded-lg shadow-xl text-white bg-transparent">
            {playlist.length === 0 ? (
                <p className="empty-playlist text-gray-400 text-center text-lg py-20">
                    No liked songs yet. Start adding some!
                </p>
            ) : (
                <div className="grid grid-cols-1 m-2 px-5  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-y-auto h-[28rem] py-4 hidden-scrollbar">
                    {playlist.map((song, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer text-center transition-transform transform hover:scale-105 bg-[#1a1a1a] p-6 rounded-lg shadow-lg hover:shadow-2xl w-64 md:w-56 sm:w-48 relative"
                            onClick={() => handleSongClick(song)}  // Add onClick handler
                        >
                            <div className="relative flex rounded-full items-center justify-center w-full h-48 bg-emerald-800  shadow-md md:h-48 sm:h-40">
                                <FaMusic className="text-6xl text-gray-400 group-hover:text-gray-200" />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 rounded-full p-1 group-hover:bg-opacity-80">
                                    <button 
                                        className="remove-button text-white hover:text-red-500 transition-colors" 
                                        onClick={(e) => {
                                            e.stopPropagation();  // Prevent the click from setting the current song
                                            handleRemove(song.videoId);
                                        }}
                                        aria-label="Remove song"
                                    >
                                        <FaTrash className="remove-icon w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-lg font-bold text-white truncate group-hover:text-[#1db954] transition-colors">
                                    {song.title}
                                </p>
                                <p className="text-sm text-gray-400 truncate mt-1">
                                    {song.artist}
                                </p>
                                <button 
                                    className="play-button mt-4 text-sm px-5 py-2 bg-[#1db954] text-white rounded-full hover:bg-[#17a54d] transition-all ease-in-out duration-200 transform hover:-translate-y-1"
                                    onClick={(e) => {
                                        e.stopPropagation();  // Prevent the click from setting the current song
                                        handleSongClick(song);
                                    }}
                                >
                                    <FaPlay className="inline mr-2" /> Play
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Playlist;
