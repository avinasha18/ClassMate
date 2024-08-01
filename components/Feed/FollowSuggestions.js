"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

const FollowSuggestions = ({ currentUserId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/api/follow-status', {
          params: { currentUserId }
        });
        setSuggestions(response.data);
      } catch (err) {
        console.error('Error fetching follow suggestions:', err);
      }
    };

    fetchSuggestions();
  }, [currentUserId]);

  const handleFollow = async (userIdToFollow) => {
    try {
      const response = await axios.post('/api/follow-request', {
        currentUserId,
        userIdToFollow
      });
      if (response.data.status === 'requested') {
        setFollowStatus(prevStatus => ({
          ...prevStatus,
          [userIdToFollow]: 'requested',
        }));
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Follow Suggestions</h2>
      <ul className="space-y-4">
        {suggestions.map(suggestion => (
          <li key={suggestion.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={suggestion.profilePictureUrl || "/assets/profileabhi.png"}
                alt={suggestion.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-medium">{suggestion.fullName}</span>
                <span className="text-sm text-gray-500 block">@{suggestion.tag}</span>
                <span className="text-sm text-gray-500 block">Reg. No: {suggestion.registrationNumber}</span>
              </div>
            </div>
            <button
              onClick={() => handleFollow(suggestion.id)}
              className={`px-4 py-2 ${
                followStatus[suggestion.id] === 'requested'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              } text-white rounded`}
            >
              {followStatus[suggestion.id] === 'requested' ? 'Requested' : 'Follow'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowSuggestions;