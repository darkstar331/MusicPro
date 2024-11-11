'use client';
import Image from 'next/image';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { FaGithub, FaUserCircle } from 'react-icons/fa';
import LoginIcon from '@mui/icons-material/Login';

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
        setLoading(true); // Start loading
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
            setLoading(false); // Stop loading
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
        <nav className='flex justify-between items-center p-3 bg-[#191414] text-white border-b-4 border-[#1DB954] shadow-md'>
            {/* Logo Section */}
            <div className="flex items-center space-x-3 font-extrabold md:text-2xl text-xl">
                <LibraryMusicIcon style={{ color: '#1DB954' }} />
                <span className="tracking-wide font-bold text-lg">MusicLite</span>
            </div>

            {/* User Account Section */}
            <div>
                {status === 'authenticated' ? (
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <ReactLoading type="bars" color="#1DB954" height={30} width={30} />
                            </div>
                        ) : (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2  text-white px-4 py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 "
                                    aria-haspopup="true"
                                    aria-expanded={dropdownVisible}
                                >
                                    {session.user.image ? (
                                        <Image
                                            className="rounded-full  "
                                            src={session.user.image}
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                                    )}
        
                                </button>

                                {dropdownVisible && (
                                    <div className="absolute right-0 mt-2 w-64 bg-orange-300 text-black shadow-lg py-2 z-10">
                                        <div className="flex items-center px-4 py-3 border-b border-gray-700">
                                            {session.user.image ? (
                                                <Image
                                                    className="rounded-full"
                                                    src={session.user.image}
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <span className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                                    <FaUserCircle className="w-6 h-6 text-gray-400" />
                                                </span>
                                            )}
                                            <div className="ml-3">
                                                <p className=" font-semibold truncate max-w-[140px]">{session.user.name}</p>
                                                <p className="text-s truncate max-w-[140px]">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex font-extrabold text-red-800 items-center w-full text-left px-4 py-2  hover:bg-white transition -mb-2 duration-300"
                                        >
                                            <svg className="w-5 h-5 mr-2 text-red-700  group-hover:text-[#1DB954] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 5a2 2 0 00-2-2h-6a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V5z"></path>
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={() => signIn('github')}
                        className="flex items-center space-x-2 bg-[#1DB954] hover:bg-[#17a74a] text-white px-4 py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    >
                        <FaGithub className="w-5 h-5" />
                        <span className="font-medium hidden sm:block">Sign In</span>
                        <LoginIcon className="w-5 h-5 hidden sm:block" />
                    </button>
                )}
            </div>
        </nav>
    );
}
    export default Header;

