"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const StoryViewer = ({ stories, userId, initialUserIndex, initialStoryIndex, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [isViewing, setIsViewing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isViewing) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(timer);
            handleNextStory();
            return 0;
          }
          return oldProgress + 0.5; // Adjust increment for smoother progress
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isViewing, currentStoryIndex, currentUserIndex]);

  const handleNextStory = () => {
    if (currentStoryIndex < stories[currentUserIndex].stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      setIsViewing(false);
      onClose();
    }
    setProgress(0);
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(stories[currentUserIndex - 1].stories.length - 1);
    }
    setProgress(0);
  };

  if (!isViewing) {
    return null;
  }

  const currentStory = stories[currentUserIndex]?.stories[currentStoryIndex];

  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-lg">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="h-1 bg-gray-700">
            <div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <Image
            src={currentStory.content}
            alt="Story"
            width={500}
            height={800}
            className="w-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center">
            <Image
              src={stories[currentUserIndex].user.profilePictureUrl || "/noAvatar.png"}
              alt={stories[currentUserIndex].user.fullName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-2 text-white font-semibold">
              {stories[currentUserIndex].user.fullName}
            </span>
          </div>
        </div>
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl"
          onClick={handlePreviousStory}
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl"
          onClick={handleNextStory}
        >
          ›
        </button>
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
