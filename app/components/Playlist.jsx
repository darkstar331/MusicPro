'use client';

import React, { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Play, Trash2, Share2, MessageCircle, Copy, X } from 'lucide-react';
import Chat from './Chat'; // Adjust the import path according to your project structure

const Playlist = () => {
  const { data: session } = useSession();
  const { playlist, setCurrent, handleRemove } = useMusicPlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [shareMenuOpen, setShareMenuOpen] = useState(null);
  const [linkCopied, setLinkCopied] = useState(null);
  const [chatOpen, setChatOpen] = useState(false); // State to track if chat is open

  const handleSongClick = (song) => {
    setCurrent(song);
  };

  // Filter songs based on search term
  const filteredPlaylist = useMemo(() => {
    return playlist.filter((song) =>
      `${song.title} ${song.artist}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [playlist, searchTerm]);

  const handleCopyLink = (song) => {
    navigator.clipboard.writeText(
      `https://www.youtube.com/watch?v=${song.videoId}`
    );
    setLinkCopied(song.videoId);
    setTimeout(() => setLinkCopied(null), 2000); // Show the copied message for 2 seconds
  };

  return (
    <div className="flex bg-[#080907] max-h-[750px] 2xl:max-h-[885px] flex-col h-screen text-white">
      {/* Header */}
      <div className="flex flex-col  -mt-1 space-x-4 max-h-[590px] bg-[#080907]">
        {/* Chat Button */}
        <div className="flex pl-6 justify-between">
          <div className="text-2xl font-semibold mb-4 mt-8">Liked Songs</div>
          <button
            className="w-8 h-8 mr-4 flex items-center justify-center bg-white text-black rounded-full hover:bg-green-400 active:scale-95 transition-all duration-200 mt-8"
            onClick={() => setChatOpen(true)}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm pl-2  text-gray-400">
          {session?.user?.name} • {playlist.length} songs
        </div>
      </div>

      <div className="flex-grow bg-[#080907] pt-4 overflow-y-auto hidden-scrollbar">
        {/* Playlist */}
        <div className="hidden-scrollbar px-6">
          {playlist.length === 0 ? (
            <p className="text-gray-400 text-center text-lg py-20">
              No liked songs yet. Start adding some!
            </p>
          ) : filteredPlaylist.length === 0 ? (
            <p className="text-gray-400 text-center text-lg py-20">
              No songs match your search.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b  border-white/10">
                  <th className="font-normal text-left pb-2">#</th>
                  <th className="font-normal text-left pb-2">Title</th>
                  <th className="font-normal text-left pb-2">#</th>
                  <th className="font-normal text-left pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlaylist.map((song, index) => (
                  <tr
                    key={song.videoId}
                    className="group hover:bg-white/10 rounded-md cursor-pointer"
                    onClick={() => handleSongClick(song)}
                  >
                    <td className="py-3 w-12">
                      <div className="relative">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-4">
                        <img
                          className="w-10 h-10 rounded object-cover"
                          src={
                            song.thumbnail ||
                            'https://i.imgur.com/aZ9HulS.png'
                          }
                          alt="Song Cover"
                        />
                        <span className="font-medium">
                          {song.title
                            .split('|', 3)
                            .slice(0, 1)
                            .join('|')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{song.artist}</td>
                    <td className="py-3">
                      <div className="relative flex items-center space-x-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-blue-400 active:scale-95 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareMenuOpen(
                              shareMenuOpen === song.videoId
                                ? null
                                : song.videoId
                            );
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-red-600 active:scale-95 transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(song.videoId);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {shareMenuOpen === song.videoId && (
                          <div className="absolute top-full mt-2 right-0 bg-white text-black shadow-lg z-10 w-48 animate-fade-in">
                            <div className="flex flex-col">
                              <button
                                className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyLink(song);
                                  setShareMenuOpen(null);
                                }}
                              >
                                <Copy className="w-5 h-5 mr-3 text-gray-600" />
                                <span className="text-sm">Copy Link</span>
                              </button>
                              <button
                                className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const url = `https://www.youtube.com/watch?v=${song.videoId}`;
                                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                                    url
                                  )}`;
                                  window.open(whatsappUrl, '_blank');
                                  setShareMenuOpen(null);
                                }}
                              >
                                <MessageCircle className="w-5 h-5 mr-3" />
                                <span className="text-sm">
                                  Share via WhatsApp
                                </span>
                              </button>
                            </div>
                            <button
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                              onClick={() => setShareMenuOpen(null)}
                              aria-label="Close Share Menu"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        )}
                        {linkCopied === song.videoId && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white text-xs rounded px-2 py-1">
                            Link copied!
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {chatOpen && (
          <div
            className="fixed top-20 2xl:top-36 right-0 h-full w-full md:w-1/2 bg-transparent p-4 z-50 overflow-y-auto hidden-scrollbar"
            style={{ maxWidth: '400px' }}
          >
            <button
              className="absolute top-9 right-6 text-white hover:text-gray-300"
              onClick={() => setChatOpen(false)}
              aria-label="Close Chat"
            >
              <X className="w-6 h-6" />
            </button>
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
