'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaSchool, FaVenusMars, FaChevronDown, FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from "@/components/Navbar";

const colleges = ['SRKR Engineering College', 'Vishnu Engineering College'];

const inputVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const InputField = ({ icon, type, placeholder, name, value, onChange, error, togglePasswordVisibility, showPassword }) => (
  <div className="relative mb-6">
    {icon}
    <input
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pl-10 pr-10 border-b-2 outline-none transition-all text-black ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
    />
    {type === 'password' && (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute top-4 right-3 text-gray-400"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ icon, options, placeholder, name, value, onChange, error }) => (
  <div className="relative mb-6">
    {icon}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 pl-10 pr-10 border-b-2 outline-none transition-all appearance-none text-black bg-transparent ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
    <FaChevronDown className="absolute top-4 right-3 text-gray-400 pointer-events-none" />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    registrationNumber: '',
    gender: '',
    email: '',
    college: '',
    password: '',
    confirmPassword: '',
    profilePictureUrl: null,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    if (!formData.college) newErrors.college = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Required';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Required';
    if (!formData.gender) newErrors.gender = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterStep2 = () => {
    const newErrors = {};
    if (!formData.college) newErrors.college = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Invalid password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.profilePictureUrl) newErrors.profilePictureUrl = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const calculateTag = (registrationNumber) => {
    const year = parseInt(registrationNumber.substring(0, 2), 10) + 2000;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
  
    let yearsDifference = currentYear - year;
    if (currentMonth >= 7) {
      yearsDifference++;
    }
  
    if (yearsDifference === 1) {
      return 'fresher';
    } else if (yearsDifference === 2) {
      return 'junior';
    } else if (yearsDifference === 3) {
      return 'senior';
    } else if (yearsDifference >= 4) {
      return 'super senior';
    } else {
      return 'student';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (isLogin) {
      if (validateLogin()) {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'login',
              registrationNumber: formData.registrationNumber,
              password: formData.password,
              college: formData.college,
            }),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userProfile', JSON.stringify({
              fullName: data.user.fullName,
              profilePictureUrl: data.user.profilePictureUrl,
              email: data.user.email,
            }));
            router.push(`/dashboard/${data.user.id}`);
          } else {
            setErrors({ general: data.error });
          }
        } catch (error) {
          setErrors({ general: 'An error occurred. Please try again.' });
        }
      }
    } else {
      if (registerStep === 1) {
        if (validateRegisterStep1()) {
          const tag = calculateTag(formData.registrationNumber);
          setFormData(prevData => ({ ...prevData, tag }));
          nextStep();
        }
      } else if (registerStep === 2) {
        if (validateRegisterStep2()) {
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'register',
                ...formData,
                tag: formData.tag || calculateTag(formData.registrationNumber),
              }),
            });
            const data = await response.json();
            if (response.ok) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('userProfile', JSON.stringify({
                fullName: data.user.fullName,
                profilePictureUrl: data.user.profilePictureUrl,
                email: data.user.email,
              }));
              router.push(`/dashboard/${data.user.id}`);
            } else {
              setErrors({ general: data.error });
            }
          } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' });
          }
        }
      }
    }
    setIsLoading(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'classmate'); // Your Cloudinary upload preset
  
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dwmomn0dl/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setFormData(prevData => ({
          ...prevData,
          profilePictureUrl: data.secure_url,
        }));
        setPreviewImage(data.secure_url);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          profilePicture: 'Upload failed. Try again.',
        }));
      }
    }
  };

  const nextStep = () => {
    setRegisterStep(prev => prev + 1);
  };

  const prevStep = () => {
    setRegisterStep(prev => prev - 1);
  };

  const resetErrors = () => {
    setErrors({});
  };

  return (
    <>
    <Navbar />
   
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <motion.div variants={inputVariants}>
                  <InputField
                    icon={<FaUser className="absolute top-4 left-3 text-gray-400" />}
                    type="text"
                    placeholder="College Registration Number"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    error={errors.registrationNumber}
                  />
                </motion.div>
                <motion.div variants={inputVariants}>
                  <InputField
                    icon={<FaLock className="absolute top-4 left-3 text-gray-400" />}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    togglePasswordVisibility={togglePasswordVisibility}
                    showPassword={showPassword}
                  />
                </motion.div>
                <motion.div variants={inputVariants}>
                  <SelectField
                    icon={<FaSchool className="absolute top-4 left-3 text-gray-400" />}
                    options={colleges}
                    placeholder="Select College"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    error={errors.college}
                  />
                </motion.div>
                {errors.general && <p className="text-red-500 text-xs text-center">{errors.general}</p>}
                <div className="flex justify-center">
                  <motion.button
                    type="submit"
                    className="w-full py-3 px-6 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </motion.button>
                </div>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    resetErrors();
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Register here
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {registerStep === 1 && (
                  <>
                    <motion.div variants={inputVariants}>
                      <InputField
                        icon={<FaUser className="absolute top-4 left-3 text-gray-400" />}
                        type="text"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <InputField
                        icon={<FaUser className="absolute top-4 left-3 text-gray-400" />}
                        type="text"
                        placeholder="College Registration Number"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        error={errors.registrationNumber}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <SelectField
                        icon={<FaVenusMars className="absolute top-4 left-3 text-gray-400" />}
                        options={['Male', 'Female', 'Other']}
                        placeholder="Select Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        error={errors.gender}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <InputField
                        icon={<FaEnvelope className="absolute top-4 left-3 text-gray-400" />}
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                    </motion.div>
                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="py-3 px-6 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
                        whileTap={{ scale: 0.95 }}
                      >
                        Next
                      </motion.button>
                    </div>
                  </>
                )}
                {registerStep === 2 && (
                  <>
                    <motion.div variants={inputVariants}>
                      <SelectField
                        icon={<FaSchool className="absolute top-4 left-3 text-gray-400" />}
                        options={colleges}
                        placeholder="Select College"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        error={errors.college}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <InputField
                        icon={<FaLock className="absolute top-4 left-3 text-gray-400" />}
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        togglePasswordVisibility={togglePasswordVisibility}
                        showPassword={showPassword}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <InputField
                        icon={<FaLock className="absolute top-4 left-3 text-gray-400" />}
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                        showPassword={showPassword}
                      />
                    </motion.div>
                    <motion.div variants={inputVariants}>
                      <div className="relative mb-6">
                        <FaUpload className="absolute top-4 left-3 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full p-3 pl-10 pr-10 border-b-2 outline-none transition-all text-black border-gray-300 focus:border-blue-500"
                        />
                        {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>}
                        <p className="text-gray-500 text-xs mt-1">Upload your profile picture</p>
                        {previewImage && (
                          <div className="mt-2">
                            <Image src={previewImage} alt="Profile Preview" width={100} height={100} className="rounded-full" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                    {errors.general && <p className="text-red-500 text-xs text-center">{errors.general}</p>}
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="py-3 px-6 text-gray-600 hover:underline"
                      >
                        Back
                      </button>
                      <motion.button
                        type="submit"
                        className="py-3 px-6 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registering...' : 'Register'}
                      </motion.button>
                    </div>
                  </>
                )}
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    resetErrors();
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Login here
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </>
  );
}