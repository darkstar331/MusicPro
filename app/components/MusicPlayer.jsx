'use client';

import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactPlayer from 'react-player/youtube';
import {
  Heart,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic,
  Maximize2,
  ChevronDown,
} from 'lucide-react';

const MusicPlayer = () => {
  const {
    current,
    isPlaying,
    togglePlayPause,
    handleNext,
    skipPrevious,
    played,
    duration,
    handleSeekChange,
    formatTime,
    toggleLike,
    isLiked,
    setIsLiked,
    playerRef,
    handleProgress,
    handleDuration,
    handleAdd,
    setPlaylist,
    playlist,
  } = useMusicPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (current) {
      const isAlreadyLiked = playlist.some(
        (song) => song.videoId === current.videoId && song.liked
      );
      setIsLiked(isAlreadyLiked);
    }
  }, [current, playlist, setIsLiked]);

  const handleLikeClick = () => {
    if (isLiked) return;

    toggleLike();
    const isAlreadyInPlaylist = playlist.some(
      (song) => song.videoId === current.videoId
    );

    if (!isAlreadyInPlaylist) {
      handleAdd({ ...current, liked: true });
    } else {
      setPlaylist((prevPlaylist) =>
        prevPlaylist.map((song) =>
          song.videoId === current.videoId
            ? { ...song, liked: !song.liked }
            : song
        )
      );
    }
    setIsLiked(true);
  };

  const dummyCurrent = {
    videoId: 'fHI8X4OXluQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    thumbnail: 'https://img.youtube.com/vi/fHI8X4OXluQ/0.jpg',
  };

  const activeSong = current || dummyCurrent;

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818]  px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Now Playing */}
        <div className="flex items-center w-[30%] overflow-hidden">
          <div className="flex-shrink-0 w-14 h-14 mr-3">
            <img
              src={activeSong.thumbnail}
              alt={activeSong.title}
              width={56}
              height={56}
              className="rounded"
            />
          </div>
          <div className="mr-4 overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate max-w-[200px]">
              {activeSong.title}
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">
              {activeSong.artist}
            </p>
          </div>
          <button
            onClick={handleLikeClick}
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200 flex-shrink-0"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'fill-[#1DB954] text-[#1DB954]' : ''
              }`}
            />
          </button>
        </div>

        {/* Center: Player Controls */}
        <div className="flex flex-col items-center w-[40%]">
          <div className="flex items-center mb-1 gap-4">
            <button className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200">
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={skipPrevious}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-white rounded-full p-2 hover:scale-105 focus:outline-none transition-transform duration-200"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center w-full gap-2 group">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(played * duration)}
            </span>
            <div className="relative flex-grow">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onChange={(e) => {
                  handleSeekChange(e);
                  playerRef.current.seekTo(parseFloat(e.target.value));
                }}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
            
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Extra Controls */}
        <div className="flex items-center justify-end w-[30%] gap-7">
        
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={handleMuteToggle}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    playerRef.current.setVolume(newVolume);
                  }}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full pointer-events-none transition-all duration-200"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
          >
            {isFullScreen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* YouTube Player with Smooth Transition */}
      <div
        className="video-wrapper"
        style={{
          position: 'fixed',
          top: '7%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          zIndex: 100,
          width: isFullScreen ? '100vw' : '0',
          height: isFullScreen ? '84vh' : '0',
          overflow: 'hidden',
          transition: 'width 0s ease, height 0s ease',
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleNext}
          volume={volume}
          muted={isMuted}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                controls: isFullScreen ? 1 : 0,
                modestbranding: 1,
                playsinline: 1,
                fs: 1,
                rel: 0,
                iv_load_policy: 3,
                showinfo: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
