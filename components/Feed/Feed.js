"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import FollowSuggestions from './FollowSuggestions';

const Feed = ({ id, userData }) => {
  const currentUserId = id;
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/user', {
          params: { id: currentUserId, type: 'POSTS' }
        });
        setPosts(response.data.posts);
        setUser(response.data.user);
        setPostUser(response.data.postUserData);

        // Fetch follow suggestions if there are no posts
        if (response.data.posts.length === 0) {
          const suggestionsResponse = await axios.get('/api/suggestions', {
            params: { id: currentUserId }
          });
          setSuggestions(suggestionsResponse.data);
          console.log(suggestionsResponse.data,"ress")
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentUserId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col gap-6">
      {posts.length > 0 ? (
        posts.map(post => {
          const postUserData = postUser.find(pu => pu.id === post.userId);
          return (
            <Post
              key={post.id}
              post={post}
              user={user}
              postUserData={postUserData}
              currentUserId={id}
            />
          );
        })
      ) : (
        <FollowSuggestions
          userData={userData}
          suggestions={suggestions}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Feed;