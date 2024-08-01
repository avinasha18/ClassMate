"use client";

import { addComment } from "@/lib/actions";
import Image from "next/image";
import { useOptimistic, useState } from "react";

const CommentList = ({ comments, postId, currentUserId }) => {
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");

  const add = async () => {
    if (!desc) return;

    addOptimisticComment({
      id: Math.random(),
      content: desc,
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
      const createdComment = await addComment(postId, desc, currentUserId);
      setCommentState((prev) => [createdComment, ...prev]);
      setDesc("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value) => [value, ...state]
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <Image
          src="/noAvatar.png"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
        >
          <input
            type="text"
            placeholder="Write a comment..."
            className="bg-transparent outline-none flex-1"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Image
            src="/emoji.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </form>
      </div>
      <div className="">
        {optimisticComments.map((comment) => (
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
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt=""
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div className="">Reply</div>
              </div>
            </div>
            <Image
              src="/more.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
