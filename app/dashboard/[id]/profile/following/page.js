'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Following = ({ params }) => {
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    console.log(params)
    const userId = params.id
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) {
        setError('User ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/dashboard/${userId}/following`);
        if (!response.ok) throw new Error('Failed to fetch following');
        const data = await response.json();
        setFollowing(data.following);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Following</h2>
      {following.length === 0 ? (
        <p>No following yet.</p>
      ) : (
        following.map((user) => (
          <div key={user.id} className="flex items-center space-x-4 mb-4">
            <Image
              src={user.profilePictureUrl || '/default-avatar.png'}
              alt={user.fullName}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <Link href={`/profile/${user.id}`} className="font-semibold">
                {user.fullName}
              </Link>
              <p className="text-sm text-gray-500">@{user.tag}</p>
            </div>
            <button className="ml-auto bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
              Unfollow
            </button>
          </div>
        ))
      )}
      {/* <div className="flex justify-center space-x-4 mt-4">
        {following && (
          <Link href={`/profile/${userId}/following`}>
            <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
              Previous
            </button>
          </Link>
        )}
        <Link href={`/profile/${userId}/following`}>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">
            Next
          </button>
        </Link>
      </div> */}
    </div>
  );
};

export default Following;