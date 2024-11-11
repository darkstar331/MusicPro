import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaTrash, FaPlay, FaSearch } from 'react-icons/fa';
import styles from './Playlist.module.css';

const Playlist = () => {
  const { playlist, setCurrent, handleRemove } = useMusicPlayer();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSongClick = (song) => {
    setCurrent(song);
  };

  // Filter songs based on search term
  const filteredPlaylist = playlist.filter((song) =>
    `${song.title} ${song.artist}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-4 md:p-10 h-[60vh] xl:h-[67vh] overflow-y-auto hidden-scrollbar text-white">

        {playlist.length === 0 ? (
          <p className="text-gray-400 text-center text-lg py-20">
            No liked songs yet. Start adding some!
          </p>
        ) : filteredPlaylist.length === 0 ? (
          <p className="text-gray-400 text-center text-lg py-20">
            No songs match your search.
          </p>
        ) : (
          <div
            className="h-[calc(100vh-300px)] overflow-y-auto pr-2"
          // Adjust the height as needed to fit your layout
          >
            <ul className="space-y-2">
              {filteredPlaylist.map((song) => (
                <li
                  key={song.videoId}
                  className="flex items-center justify-between bg-[#282c34] bg-gradient-to-r from-[#282c34] to-[rgba(17,0,32,0.5)] p-3 rounded-lg hover:bg-[#333842] transition-colors cursor-pointer group"
                  onClick={() => handleSongClick(song)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-12 h-12 rounded-md object-cover"
                      src={song.thumbnail || 'https://i.imgur.com/aZ9HulS.png'}
                      alt="Song Cover"
                    />
                    <div>
                      <h2 className="text-sm font-bold text-white group-hover:text-green-500 transition-colors">
                        {song.title}
                      </h2>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 active:scale-95 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongClick(song);
                      }}
                    >
                      <FaPlay className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 active:scale-95 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(song.videoId);
                      }}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </>
      );
   
};

export default Playlist;

