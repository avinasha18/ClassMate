"use client";

import axios from 'axios';
import Image from "next/image";
import { useState } from "react";

const PostInteraction = ({ postId, likes, currentUserId,commentNumber,user, updateLikes }) => {
  const [isLiked, setIsLiked] = useState(likes.some(like => like.userId === currentUserId));
  const [likeCount, setLikeCount] = useState(likes.length);
  const handleLike = async () => {
    try {
      const response = await axios.get('/api/user', {
        params: {
          postId: postId,
          id: currentUserId,
          type: "switchLike"
        }
      });
      const newLikeStatus = response.data.switchLikeData;
      setIsLiked(newLikeStatus);
      setLikeCount(prev => newLikeStatus ? prev + 1 : prev - 1);
      updateLikes(newLikeStatus);
    } catch (error) {
      console.error("Error switching like:", error);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-4">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
          <button onClick={handleLike}>
            <Image
              src={isLiked ? "/liked.png" : "/like.png"}
              width={20}
              height={20}
              alt="Like button"
              className="cursor-pointer"
            />
          </button>
          <span className="text-gray-500">{likeCount}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
          <Image
            src="/comment.png"
            width={20}
            height={20}
            alt="Comment button"
            className="cursor-pointer"
          />
          <span className="text-gray-500">{commentNumber}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
        <Image
          src="/share.png"
          width={20}
          height={20}
          alt="Share button"
          className="cursor-pointer"
        />
        <span className="text-gray-500">Share</span>
      </div>
    </div>
  );
};

export default PostInteraction;
