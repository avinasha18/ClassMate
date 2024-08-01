"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useEffect } from "react";
import AddPostButton from "./AddPostButton.js";

const AddPost = ({ id, userData }) => {
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const createPost = async (formData, userId, mediaUrl) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          desc: formData.desc,
          media: mediaUrl
        })
      });
      const result = await response.json();
      console.log(result);
      setIsPosted(true);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPosted) {
      const timer = setTimeout(() => {
        setIsPosted(false);
        setDesc("");
        setMedia(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPosted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ desc }, id, media?.secure_url || "");
  };

  const removeMedia = () => {
    setMedia(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isPosted) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg flex items-center justify-center">
        <span className="text-green-500 mr-2">Posted successfully!</span>
        <span role="img" aria-label="celebration">🎉</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <Image
        src={userData.profilePictureUrl || "/assets/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <div className="">
            <Image
              src="/assets/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {media && (
          <div className="mt-4 relative">
            {media.resource_type === "image" ? (
              <Image
                src={media.secure_url}
                alt="Uploaded media"
                width={200}
                height={200}
                className="rounded-lg"
              />
            ) : (
              <video src={media.secure_url} controls className="rounded-lg" style={{ maxWidth: "200px" }} />
            )}
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        )}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="classmate"
            options={{ folder: "/classmate" }}
            onSuccess={(result, { widget }) => {
              setMedia(result.info);
              widget.close();
            }}
          >
            {({ open }) => (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image
                  src="/assets/addimage.png"
                  alt=""
                  width={20}
                  height={20}
                />
                Photo/Video
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
};

export default AddPost;