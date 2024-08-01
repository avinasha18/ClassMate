"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import StoryViewer from "./StoryViewer"; // Import the StoryViewer component

const StoryList = ({ stories, userId, userData }) => {
  const [storyList, setStoryList] = useState(stories);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const handleSuccess = (result, { widget }) => {
    setUploadedImage(result.info.secure_url);
    setIsUploading(false);
    widget.close();
  };

  const handleAddStory = async () => {
    if (!uploadedImage) return;

    try {
      const response = await fetch('/api/upload-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: uploadedImage, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add story');
      }

      const newStory = await response.json();
      setStoryList((prevList) => {
        const userIndex = prevList.findIndex((item) => item.user.id === userId);
        if (userIndex !== -1) {
          // User already has stories, add the new one
          const updatedList = [...prevList];
          updatedList[userIndex] = {
            ...updatedList[userIndex],
            stories: [newStory, ...updatedList[userIndex].stories],
          };
          return updatedList;
        } else {
          // User doesn't have any stories, create a new entry
          return [
            {
              user: userData,
              stories: [newStory],
            },
            ...prevList,
          ];
        }
      });
      setUploadedImage(null);
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  const handleOpenStory = (userIndex, storyIndex) => {
    setSelectedStory({ userIndex, storyIndex });
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      <div className="flex flex-col items-center">
        <CldUploadWidget uploadPreset="classmate" onSuccess={handleSuccess}>
          {({ open }) => (
            <button 
              onClick={() => {
                setIsUploading(true);
                open();
              }} 
              disabled={isUploading}
              className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500 shadow-md transition-transform transform hover:scale-105"
            >
              +
            </button>
          )}
        </CldUploadWidget>
        <span className="mt-2 text-sm font-semibold">Add Story</span>
      </div>

      {uploadedImage && (
        <div className="flex flex-col items-center">
          <Image
            src={uploadedImage}
            alt="Uploaded Story"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover shadow-md"
          />
          <button 
            onClick={handleAddStory}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg shadow-md text-sm hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      )}

      {storyList.map((storyGroup, userIndex) => (
        <div key={storyGroup.user.id} className="flex flex-col items-center">
          <div 
            onClick={() => handleOpenStory(userIndex, 0)} 
            className="cursor-pointer flex flex-col items-center transition-transform transform hover:scale-105"
          >
            <Image
              src={storyGroup.stories[0].content || "/noAvatar.png"}
              alt={storyGroup.user.fullName}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover shadow-lg"
            />
            <span className="mt-2 text-sm font-semibold text-gray-700">{storyGroup.user.fullName}</span>
          </div>
        </div>
      ))}

      {selectedStory && (
        <StoryViewer
          stories={storyList}
          userId={userId}
          initialUserIndex={selectedStory.userIndex}
          initialStoryIndex={selectedStory.storyIndex}
          onClose={handleCloseStory}
        />
      )}
    </div>
  );
};

export default StoryList;
