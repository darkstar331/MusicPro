'use client'

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { useMusicPlayer } from "../context/MusicPlayerContext"
import { Search, X } from "lucide-react"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [songs, setSongs] = useState([])
  const [showResult, setShowResult] = useState(false)
  const { setCurrent, current, setIsLiked } = useMusicPlayer()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchSongs = async () => {
      if (query.trim()) {
        setLoading(true)
        setError("")
        try {
          const response = await axios.get("/api/getResults", {
            params: { query },
          })
          setSongs(response.data.songs)
          setShowResult(true)
        } catch (error) {
          setError("Failed to fetch songs. Please try again.")
        } finally {
          setLoading(false)
        }
      } else {
        setSongs([])
        setShowResult(false)
      }
    }

    const debounceTimer = setTimeout(fetchSongs, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSongClick = (song) => {
    setCurrent(song)
    setQuery("")
    setShowResult(false)
    setIsLiked(false)
  }

  const handleClearSearch = () => {
    setQuery("")
    setShowResult(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResult(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full max-w-[480px] mx-auto relative" ref={containerRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for songs or artists..."
          className="w-full pl-12 pr-10 py-3 bg-[#121212] rounded-full border border-transparent text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1DB954] focus:outline-none transition-all duration-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResult(true)}
        />
        {query && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={handleClearSearch}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResult && (
        <div className="absolute z-10 w-full mt-2 bg-[#181818] rounded-lg shadow-lg overflow-hidden">
          <div className="h-[300px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
            {!loading &&
              !error &&
              songs.map((song) => (
                <div
                  key={song.videoId}
                  className="flex items-center gap-4 p-3 transition-colors cursor-pointer hover:bg-[#282828]"
                  onClick={() => handleSongClick(song)}
                >
                  <Image
                    src={song.thumbnail}
                    alt={song.title}
                    width={48}
                    height={48}
                    className="rounded-sm"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-white truncate">
                      {song.title}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {song.channel}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
