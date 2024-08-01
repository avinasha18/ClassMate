'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Followers = ({userId}) => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = userId
  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) {
        setError('User ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${userId}/followers`);
        if (!response.ok) throw new Error('Failed to fetch followers');
        const data = await response.json();
        setFollowers(data.followers);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Followers</h2>
      {followers.length === 0 ? (
        <p>No followers yet.</p>
      ) : (
        followers.map((follower) => (
          <div key={follower.id} className="flex items-center space-x-4 mb-4">
            <Image
              src={follower.profilePictureUrl || '/default-avatar.png'}
              alt={follower.fullName}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <Link href={`/profile/${follower.id}`} className="font-semibold">
                {follower.fullName}
              </Link>
              <p className="text-sm text-gray-500">@{follower.tag}</p>
            </div>
            <button className="ml-auto bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Followers;
