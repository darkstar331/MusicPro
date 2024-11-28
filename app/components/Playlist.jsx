'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMusicPlayer } from '../context/MusicPlayerContext'
import { Heart, Play, Trash2 } from 'lucide-react'

const Playlist = () => {
  const { data: session } = useSession()
  const { playlist, setCurrent, handleRemove } = useMusicPlayer()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSongClick = (song) => {
    setCurrent(song)
  }

  // Filter songs based on search term
  const filteredPlaylist = playlist.filter((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex mb-4 bg-[#080907] max-h-[710px] flex-col h-screen text-white">
      {/* Header */}
      <div className="flex -mt-4 items-center space-x-4 bg-[#080907]">
        <div className="w-12 h-12 flex items-center text-green-900 justify-center shadow-xl">
          <Heart className="w-20 ml-4 h-20" />
        </div>
        <div>
          <h1 className="text-2xl mt-8 font-semibold mb-4">Liked Songs</h1>
          <p className="text-sm text-gray-400">
            {session?.user?.name} • {playlist.length} songs
          </p>
        </div>
      </div>

      {/* Playlist */}
      <div className="flex-grow bg-[#080907] mt-6 overflow-y-auto hidden-scrollbar px-6">
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
              <tr className="text-gray-400 border-b border-white/10">
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
                  {/* Index and Play Icon */}
                  <td className="py-3 w-12">
                    <div className="relative">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </td>
                  {/* Song Title and Image */}
                  <td className="py-3">
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-10 h-10 rounded object-cover"
                        src={song.thumbnail || 'https://i.imgur.com/aZ9HulS.png'}
                        alt="Song Cover"
                      />
                      <span className="font-medium">{song.title.split('|').slice(0, 2).join('|')}</span>
                    </div>
                  </td>
                  {/* Artist */}
                  <td className="py-3 text-gray-400">{song.artist}</td>
                  {/* Actions (Delete Button) */}
                  <td className="py-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-red-600 active:scale-95 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(song.videoId)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Playlist
