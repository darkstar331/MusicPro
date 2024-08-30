'use client';
import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactPlayer from 'react-player/youtube';
import { FaHeart, FaRegHeart, FaStepBackward, FaStepForward, FaPlay, FaPause } from 'react-icons/fa';

const MusicPlayer = () => {
    const {
        current,
        isPlaying,
        setPlaylist,
        togglePlayPause,
        handleNext,
        skipPrevious,
        playlist,
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
        handleAdd
    } = useMusicPlayer();

    useEffect(() => {
        // Check if the current song is liked when it changes
        if (current) {
            const isAlreadyLiked = playlist.some(song => song.videoId === current.videoId && song.liked);
            setIsLiked(isAlreadyLiked);
        }
    }, [current, playlist]);

    const handleLikeClick = () => {
        if (isLiked) return;

        toggleLike(); // Toggle the liked state in the context

        const isAlreadyInPlaylist = playlist.some(song => song.videoId === current.videoId);

        if (!isAlreadyInPlaylist) {
            handleAdd({ ...current, liked: true }); // Use handleAdd to add the song to the playlist and database
        } else {
            // Update the liked state in the playlist
            setPlaylist(prevPlaylist =>
                prevPlaylist.map(song =>
                    song.videoId === current.videoId ? { ...song, liked: !song.liked } : song
                )
            );
        }

        setIsLiked(true);
    };

    if (!current) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#2c2c2c] border-t border-gray-700 flex flex-col md:flex-row items-center justify-between z-50">
            <ReactPlayer
                ref={playerRef}
                url={`https://www.youtube.com/watch?v=${current.videoId}`}
                playing={isPlaying}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onEnded={handleNext}
                style={{ display: 'none' }} 
                key={current.videoId}
            />

            <div className="flex items-center w-full md:w-[25%] gap-3 mb-4 md:mb-0">
                <img src={current.thumbnail} alt="Song Thumbnail" className="w-16 h-16 rounded-lg" />
                <div className="flex flex-col justify-center text-white truncate">
                    <span className="font-semibold text-sm md:text-md">{current.title}</span>
                </div>
                <button onClick={handleLikeClick} className="ml-3 focus:outline-none">
                    {isLiked ? <FaHeart className='text-amber-500 hover:text-amber-400 transition-colors duration-200' /> : <FaRegHeart className='text-gray-300 hover:text-amber-400 transition-colors duration-200' />}
                </button>
            </div>

            <div className="flex justify-center items-center gap-4 w-full md:w-[30%] mb-4 md:mb-0">
                <button className='text-white hover:text-amber-400 transition-colors duration-200 focus:outline-none' onClick={skipPrevious}>
                    <FaStepBackward style={{ fontSize: '30px' }} />
                </button>
                <button className='text-white hover:text-amber-400 transition-colors duration-200 focus:outline-none' onClick={togglePlayPause}>
                    {isPlaying ? <FaPause style={{ fontSize: '40px' }} /> : <FaPlay style={{ fontSize: '40px' }} />}
                </button>
                <button className='text-white hover:text-amber-400 transition-colors duration-200 focus:outline-none' onClick={handleNext}>
                    <FaStepForward style={{ fontSize: '30px' }} />
                </button>
            </div>

            <div className="flex flex-col w-full md:w-[25%] items-center">
                <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:bg-amber-400 transition-colors duration-200 focus:outline-none"
                />
                <div className="time text-white text-xs mt-1 flex justify-between w-full px-2">
                    <span>{formatTime(played * duration)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
