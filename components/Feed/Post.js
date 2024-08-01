"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Comments from "./Comments";
import PostInteraction from "./PostInteraction";
import PostInfo from "./PostInfo";
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, currentUserId,user,postUserData }) => {
  
  const [postData, setPostData] = useState(post);
  const [postUser,setPostUserData] = useState(postUserData)
  const updateLikes = (newLikeStatus) => {
    setPostData(prev => ({
      ...prev,
      likes: newLikeStatus 
        ? [...prev.likes, { userId: currentUserId }]
        : prev.likes.filter(like => like.userId !== currentUserId)
    }));
  };
 
  const updateReactions = (newReaction) => {
    setPostData(prev => ({
      ...prev,
      reactions: [...prev.reactions.filter(r => r.userId !== currentUserId), newReaction]
    }));
  };

  const addNewComment = (newComment) => {
    setPostData(prev => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));
  };
// console.log("in post gotten data " , postData)
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        </div>
        <PostInfo postId={postData.id} userId={currentUserId} />
      </div>
      <div className="flex flex-col gap-4">
        <p>{postData.content}</p>
        {postData.imageUrl && (
          <div className="w-full h-96 relative">
            <Image
              src={postData.imageUrl}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              alt=""
            />
          </div>
        )}
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}
        </span>
      </div>
      <PostInteraction
        postId={postData.id}
        likes={postData.likes}
        reactions={postData.reactions}
        commentNumber={postData.comments.length}
        currentUserId={currentUserId}
        updateLikes={updateLikes}
       
        updateReactions={updateReactions}
      />
      <Comments 
        postId={postData.id} 
        comments={postData.comments} 
        currentUserId={currentUserId}
        addNewComment={addNewComment}
        user={user}
      />
    </div>
  );
};

export default Post;