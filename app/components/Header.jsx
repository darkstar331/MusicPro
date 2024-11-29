'use client';

import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { ChevronLeft, ChevronRight,AudioLines, User } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
    const { data: session, status } = useSession();
    const { playlist, setPlaylist } = useMusicPlayer();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session) {
            fetchPlaylist();
        }
    }, [status, session]);

    const savePlaylistToServer = async () => {
        if (!session) {
            console.error('No session found. Cannot save playlist.');
            return;
        }

        try {
            const response = await fetch('/api/setSongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    playlist,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save playlist');
            }
            console.log('Playlist saved successfully.');
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    };

    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/setSongs?userId=${session.user.id}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch playlist');
            }
            const data = response.data;
            setPlaylist(data.playlist);
        } catch (error) {
            console.error('Error fetching playlist:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await savePlaylistToServer();
        signOut();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.dropdown-container')) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className="bg-black text-white">
            <div className="flex items-center justify-between p-4">
                <div className="flex">
                    <button className="bg-black rounded-full p-1">
                        <ChevronLeft className="w-6 h-6 text-gray-400" />
                    </button>
                    <AudioLines className='h-10 w-10' />
                    <button className="bg-black rounded-full p-1">
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                <SearchBar />
                <div className="flex items-center space-x-4">
                    {status === 'authenticated' ? (
                        <>
                            {loading ? (
                                <ReactLoading type="bars" color="#1DB954" height={30} width={30} />
                            ) : (
                                <div className="relative dropdown-container">
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center space-x-2 bg-black hover:bg-gray-900 text-white rounded-full transition duration-300 focus:outline-none"
                                        aria-haspopup="true"
                                        aria-expanded={dropdownVisible}
                                    >
                                        {session.user.image ? (
                                            <Image
                                                className="rounded-full"
                                                src={session.user.image}
                                                alt="Profile"
                                                width={38}
                                                height={38}
                                            />
                                        ) : (
                                            <User className="w-7 h-7 text-gray-400" />
                                        )}
                                    </button>

                                    {dropdownVisible && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#282828] text-white shadow-lg  rounded-md z-10">
                                            <div className="px-4 py-3 text-sm border-b border-gray-700">
                                                <p className="font-medium truncate">{session.user.name}</p>
                                                <p className="text-gray-400 truncate">{session.user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-700 transition duration-200"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => signIn('github')}
                            className="bg-[#181818] text-white hover:text-black hover:bg-white font-bold py-2 px-4 rounded-full hover:scale-105 transition duration-200"
                        >
                            Log in
                        </button>
                    )}
                </div>
            </div>
        
        </div>
    );
}

export default Header;

