"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";

const PostInfo = ({ postId, userId, currentUserId }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeletePost = async () => {
    try {
      const response = await axios.post('/api/delete-post', { id: postId });
      if (response.data.status === 200) {
        setMessage('Post deleted successfully');
        // You might want to refresh the feed or update the UI here
      } else {
        setMessage('Error deleting post');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage('Error deleting post');
    }
  };

  return (
    <div className="relative">
      {currentUserId === userId && (
        <>
          <Image
            src="/more.png"
            width={16}
            height={16}
            alt=""
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer"
          />
          {open && (
            <div className="absolute top-6 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-sm shadow-lg z-30">
              <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">View</span>
              <span className="cursor-pointer hover:bg-gray-100 p-1 rounded">Re-post</span>
              <button onClick={handleDeletePost} className="text-red-500 hover:bg-red-50 p-1 rounded text-left">Delete</button>
            </div>
          )}
        </>
      )}
      {message && <div className="text-green-500 mt-2">{message}</div>}
    </div>
  );
};

export default PostInfo;
