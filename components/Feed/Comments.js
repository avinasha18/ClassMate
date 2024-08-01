"use client";

import { addComment } from "@/lib/actions";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useOptimistic } from "react";
import axios from "axios";

const Comments = ({ postId, comments, currentUserId,user }) => {
  const [commentContent, setCommentContent] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [isMentioning, setIsMentioning] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const inputRef = useRef(null);

  const [commentState, setCommentState] = useState(comments);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value) => [value, ...state]
  );

  const fetchMentionSuggestions = async () => {
    try {
      const response = await axios.get('/api/mention', { params: { query: mentionQuery } });
      setMentionSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching mention suggestions:", error);
    }
  };

  useEffect(() => {
    if (mentionQuery) {
      fetchMentionSuggestions();
    } else {
      setMentionSuggestions([]);
    }
  }, [mentionQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCommentContent(value);

    const lastWord = value.split(' ').pop();
    if (lastWord.startsWith('@')) {
      setMentionQuery(lastWord.slice(1));
      setIsMentioning(true);
    } else {
      setMentionQuery("");
      setIsMentioning(false);
    }
  };

  const handleMentionClick = (user) => {
    const words = commentContent.split(' ');
    words[words.length - 1] = `@${user.fullName}`;
    setCommentContent(words.join(' ') + ' ');
    setMentionSuggestions([]);
    setIsMentioning(false);
    inputRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      addOptimisticComment({
        id: Math.random(),
        content: commentContent,
        createdAt: new Date(Date.now()),
        userId: currentUserId,
        postId: postId,
        user: {
          id: currentUserId,
          fullName: "Sending Please Wait...",
          profilePictureUrl: "/noAvatar.png",
        },
      });
      try {
        const newComment = await addComment(postId, commentContent, currentUserId);
        setCommentState((prev) => [newComment, ...prev]);
        setCommentContent("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-4">
        <Image
            src={user.profilePictureUrl ||"/noAvatar.png"}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={commentContent}
            onChange={handleInputChange}
            placeholder="Write a comment..."
            className="w-full bg-slate-100 rounded-xl text-sm px-6 py-2 outline-none"
          />
          {isMentioning && mentionSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1">
              {mentionSuggestions.map(user => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleMentionClick(user)}
                >
                  {user.fullName}
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </form>
      <div>
        {optimisticComments.slice(0, showAllComments ? optimisticComments.length : 1).map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            <Image
              src={comment.user.profilePictureUrl || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">{comment.user.fullName}</span>
              <p>{comment.content}</p>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        {comments.length > 1 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="text-blue-500 mt-4"
          >
            More
          </button>
        )}
        {showAllComments && (
          <button
            onClick={() => setShowAllComments(false)}
            className="text-blue-500 mt-4"
          >
            Less
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;
