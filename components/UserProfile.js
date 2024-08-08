"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCog, FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import axios from 'axios';
import Modal from 'react-modal';
import SvgPathLoader from './TextSpinnerLoader';
import PostInfo from './Feed/PostInfo';
import PostInteraction from './Feed/PostInteraction';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    tag: '',
    college: '',
    gender: '',
    bio: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (appRef.current) {
      Modal.setAppElement(appRef.current);
    }
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/dashboard/${userId}/profilepage`);
      setUser(response.data);
      setEditForm({
        fullName: response.data.fullName,
        email: response.data.email,
        tag: response.data.tag,
        college: response.data.college,
        gender: response.data.gender,
        bio: response.data.bio,
      });
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
      console.log(response.data , "posts")

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/dashboard/${userId}/posts/${postId}`);
      fetchUserPosts();
      setIsModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Error deleting post');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => formData.append(key, editForm[key]));
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
  
      const response = await axios.put(`/api/dashboard/${userId}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setUser(response.data);
      setIsEditModalOpen(false);
      fetchUserData(); // Refresh user data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <SvgPathLoader />
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!user) return <div className="text-gray-500 text-center mt-10">No user data found</div>;

  return (
    <div ref={appRef} className="bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          <Image
          src={user.profilePictureUrl || '/noAvatar.png'}
          alt={user.fullName}
          width={150}
          height={150}
          className="rounded-full object-cover shadow-md"
          priority // Add this line
        />
          </motion.div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{user.fullName}</h1>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-md transition duration-300 ease-in-out"
                >
                  <FaCog />
                </motion.button>
              </div>
            </div>
            <div className="flex space-x-6 mb-4 text-gray-600">
              <span><strong>{posts.length}</strong> posts</span>
              <Link href={`/dashboard/${user.id}/profile/followers`} className="hover:text-blue-500 transition duration-300">
                <span><strong>{user.followersCount}</strong> followers</span>
              </Link>
              <Link href={`/dashboard/${user.id}/profile/following`} className="hover:text-blue-500 transition duration-300">
                <span><strong>{user.followingCount}</strong> following</span>
              </Link>
            </div>
            <p className="text-gray-700">{user.bio || 'No bio available'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-6">
          <div className="flex justify-center space-x-12">
            <button
              className={`pb-3 text-sm font-semibold transition duration-300 ${activeTab === 'posts' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('posts')}
            >
              POSTS
            </button>
            <button
              className={`pb-3 text-sm font-semibold transition duration-300 ${activeTab === 'media' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('media')}
            >
              MEDIA
            </button>
          </div>
        </div>

        {/* Posts/Media Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-4"
          >
            {(activeTab === 'posts' ? posts : posts.filter(post => post.imageUrl)).map((post) => (
              <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center gap-4">
                  <Image
                    src={postUser.profilePictureUrl || "/assets/profileabhi.png"}
                    width={40}
                    height={40}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <span className="font-medium">{postUser.fullName}</span>
                    <span className="text-sm text-gray-500 block">@{postUser.tag}</span>
                  </div>
                </div> */}
                <PostInfo postId={post.id} userId={userId} />
              </div>
              <div className="flex flex-col gap-4">
                <p>{post.content}</p>
                {post.imageUrl && (
                  <div className="w-full h-96 relative">
                    <Image
                      src={post.imageUrl}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      alt=""
                    />
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              {/* <PostInteraction
                postId={post.id}
                likes={post.likes}
                reactions={post.reactions}
                commentNumber={1}
                currentUserId={currentUserId}
                updateLikes={updateLikes}
                updateReactions={updateReactions}
              /> */}
              {/* <Comments 
                postId={post.id} 
                comments={post.comments} 
                currentUserId={currentUserId}
                addNewComment={addNewComment}
                user={user}
              /> */}
            </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Delete confirmation"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2 className="text-2xl font-bold mb-4">Delete Post</h2>
          <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeletePost(postToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Confirm Delete
            </button>
          </div>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          contentLabel="Edit Profile"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
              <input
                type="text"
                id="tag"
                name="tag"
                value={editForm.tag}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700">College</label>
              <input
                type="text"
                id="college"
                name="college"
                value={editForm.college}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                value={editForm.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </motion.div>
      
    </div>
  );
};

export default UserProfile;