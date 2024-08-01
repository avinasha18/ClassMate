"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaCog } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import SvgPathLoader from './TextSpinnerLoader'; // Import the TextSpinnerLoader component

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/${userId}/profilepage`);
      setUser(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/api/dashboard/${userId}/posts`);
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SvgPathLoader />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 bg-white"
    >
      {/* User Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <Image
          src={user.profilePictureUrl || '/default-avatar.png'}
          alt={user.fullName}
          width={150}
          height={150}
          className="rounded-full object-cover"
        />
        <div className="flex-grow text-center md:text-left">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">{user.fullName}</h1>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
                Edit Profile
              </button>
              <button className="bg-gray-200 text-gray-800 p-2 rounded-md">
                <FaCog />
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-start space-x-6 mb-4">
            <span><strong>{user.postsCount}</strong> posts</span>
            <Link href={`/dashboard/${user.id}/profile/followers`}><span><strong>{user.followersCount}</strong> followers</span></Link>
            <Link href={`/dashboard/${user.id}/profile/following`}><span><strong>{user.followingCount}</strong> following</span></Link>
          </div>
          <p className="text-sm">{user.bio || 'No bio available'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-300">
        <div className="flex justify-center space-x-12 mt-4">
          <button
            className={`text-sm font-semibold ${activeTab === 'posts' ? 'text-black border-t border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('posts')}
          >
            POSTS
          </button>
          <button
            className={`text-sm font-semibold ${activeTab === 'saved' ? 'text-black border-t border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('saved')}
          >
            SAVED
          </button>
          <button
            className={`text-sm font-semibold ${activeTab === 'tagged' ? 'text-black border-t border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tagged')}
          >
            TAGGED
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-6 grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="relative pt-[100%]">
            <Image
              src={post.imageUrl || '/default-post-image.png'}
              alt={post.content || ''}
              layout="fill"
              objectFit="cover"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserProfile;
