import { useSession } from 'next-auth/react';
import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaTrash, FaPlay } from 'react-icons/fa';

const Playlist = () => {
    const { playlist, setCurrent, handleRemove } = useMusicPlayer();
    const { data: session } = useSession();

    const handleSongClick = (song) => {
        setCurrent(song);  // Set the clicked song as the current song
    };

    return (
        <div className="mt-16 p-4 md:p-10 text-white h-screen overflow-y-auto">
            {playlist.length === 0 ? (
                <p className="text-gray-400 text-center text-lg py-20">
                    No liked songs yet. Start adding some!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-4">
                    {playlist.map((song, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer transition-transform transform hover:scale-105 user-select-none w-full max-w-[300px] mx-auto border border-[#ffffff22] bg-[#282c34] bg-gradient-to-b from-[#282c34] to-[rgba(17,0,32,0.5)] shadow-lg rounded-lg backdrop-blur-md overflow-hidden p-4"
                            onClick={() => handleSongClick(song)}
                        >
                            <div className="flex flex-col">
                                <img
                                    className='rounded-md w-full h-[250px] object-cover mb-4'
                                    src="https://images.unsplash.com/photo-1621075160523-b936ad96132a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                                    alt="NFT"
                                />
                                <h2 className="text-lg font-bold text-white truncate group-hover:text-[#1db954] transition-colors mb-2">
                                    {song.title}
                                </h2>
                                <p className='text-gray-400 truncate mb-4'>
                                    {song.artist}
                                </p>
                                <button
                                    className="w-full text-sm px-5 py-2 bg-[#1db954] text-white rounded-full hover:bg-[#17a54d] transition-all ease-in-out duration-200 transform hover:-translate-y-1"
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




