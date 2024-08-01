
'use client'
import Navbar from "@/components/Navbar";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [showContent, setShowContent] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const router = useRouter();

  const features = [
    "Post images and updates with captions and tags.",
    "Interact with others through comments and reactions.",
    "Follow your friends and stay updated with their posts.",
    "Engage in private chats and share stories."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const navigateToLogin = () => {
    router.push('/login'); // Adjust this path if your login page has a different route
  };

  return (
    <>
            <Navbar />

  
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center px-4 py-8 md:py-16">
        {/* Opening Animation */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-500">ClassMate</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Connecting college buddies, one post at a time.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto">
          {/* Text Content */}
          <motion.div
            className={`flex-1 mb-8 md:mb-0 ${showContent ? 'opacity-100' : 'opacity-0'}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Discover, Connect, and Share</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              Join a vibrant community of college students where you can share your experiences, connect with friends, and discover exciting content.
            </p>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-16"
              >
                <p className="text-base md:text-lg text-blue-600 font-semibold">{features[currentFeature]}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Animating Image */}
          <motion.div
            className="flex-1 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <Image
              src='/assets/classmate.png'
              alt="Hero Image"
              className="w-full h-auto rounded-lg shadow-2xl"
              width={500}
              height={600}
            />
            <motion.div
              className="absolute -bottom-12 -right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg cursor-pointer"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              onClick={navigateToLogin}
            >
              <p className="text-lg font-semibold">Join Now!</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <button 
            className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg"
            onClick={navigateToLogin}
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
    </>
  );
}


