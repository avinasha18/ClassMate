"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaSearch, FaTimes } from 'react-icons/fa';

const UserNavbar = ({ id, userData }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-controls="navbar-user"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    Cookies.remove('jwt_token');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleSearch = async (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (newQuery) {
      try {
        const response = await axios.get('/api/search-users', {
          params: { query: newQuery, currentUserId: userData.id },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleFollowRequest = async (userIdToFollow) => {
    try {
      const response = await axios.post('/api/follow-request', {
        currentUserId: userData.id,
        userIdToFollow
      });
      if (response.data.status === 'requested') {
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user.id === userIdToFollow ? { ...user, followStatus: 'requested' } : user
          )
        );
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    const confirmUnfollow = confirm('Are you sure you want to unfollow? You will need to request again if you change your mind.');
    if (confirmUnfollow) {
      try {
        const response = await axios.post('/api/unfollow', {
          currentUserId: userData.id,
          userIdToUnfollow,
        });
        if (response.data.status === 'unfollowed') {
          setSearchResults((prevResults) =>
            prevResults.map((user) =>
              user.id === userIdToUnfollow ? { ...user, followStatus: 'follow' } : user
            )
          );
        }
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/assets/classmatelogo.jpg" className="h-8 w-auto" alt="ClassMate Logo" />
          <span className="self-center text-2xl font-mono text-slate-950 whitespace-nowrap">ClassMate</span>
        </a>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className='hidden xl:flex p-2 bg-slate-100 items-center rounded-xl mr-5'>
            <input
              type="text"
              placeholder="search..."
              className="bg-transparent outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery ? (
              <FaTimes className="cursor-pointer ml-2" onClick={handleClearSearch} />
            ) : (
              <FaSearch className="ml-2" />
            )}
          </div>
          <button
            type="button"
            className="flex text-sm bg-gray-100 text-slate-950 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 transition duration-150 ease-in-out"
            onClick={toggleDropdown}
          >
            <span className="sr-only">Open user menu</span>
            {userData ? (
              <Image className="w-8 h-8 rounded-full" src={userData.profilePictureUrl} alt="user photo" width={32} height={32} />
            ) : (
              <Image className="w-8 h-8 rounded-full" src="/assets/profileabhi.png" alt="default photo" width={32} height={32} />
            )}
          </button>

          {/* Dropdown menu */}
          <div
            ref={dropdownRef}
            className={`absolute right-3 top-full mt-2 w-48 text-base list-none bg-white divide-y divide-gray-200 rounded-lg shadow-lg ${isDropdownOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              {userData ? (
                <>
                  <span className="block text-sm text-slate-950 font-semibold">{userData.fullName}</span>
                  <span className="block text-sm text-gray-500 truncate">{userData.email}</span>
                </>
              ) : (
                <span className="block text-sm text-slate-950 font-semibold">Guest</span>
              )}
            </div>
            <ul className="py-2">
              <Link href={`/dashboard/${userData.profilePictureUrl}/profile`}>
                <p className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Dashboard</p>
              </Link>
              <li>
                <Link href="/" onClick={handleLogout}>
                  <p className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Logout</p>
                </Link>
              </li>
            </ul>
          </div>

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out"
            aria-controls="navbar-user"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className={`w-6 h-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`w-6 h-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          ref={mobileMenuRef}
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
          id="navbar-user"
        >
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch />
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
            <li>
              <Link href="/register">
                <p className={`block py-2 pl-3 pr-4 rounded md:p-0 ${isDropdownOpen ? 'text-slate-950 bg-blue-700' : 'text-slate-950 hover:bg-gray-100'}`}>Register</p>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <p className={`block py-2 pl-3 pr-4 rounded md:p-0 ${isDropdownOpen ? 'text-slate-950 bg-blue-700' : 'text-slate-950 hover:bg-gray-100'}`}>Login</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && (
        <div class="absolute top-full right-[100px] max-w-s w-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
        <ul className="divide-y divide-gray-200">
            {searchResults.map((user) => (
              <li key={user.id} className="flex items-center gap-7 justify-between p-2 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <img className="w-8 h-8 rounded-full" src={user.profilePictureUrl} alt={user.fullName} />
                  <div>
                    <p className="text-sm font-medium text-slate-950">{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.tag}</p>
                  </div>
                </div>
                {user.followStatus === 'following' ? (
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </button>
                ) : user.followStatus === 'requested' ? (
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg cursor-not-allowed" disabled>
                    Requested
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                    onClick={() => handleFollowRequest(user.id)}
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
