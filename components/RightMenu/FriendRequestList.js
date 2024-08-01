"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const FriendRequestList = ({ userId, requests }) => {
  const [requestState, setRequestState] = useState(requests);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequestDetails = async () => {
    setIsLoading(true);
    try {
      const detailedRequests = await Promise.all(
        requests.map(async (request) => {
          const response = await axios.get(`/api/user-details?userId=${request.senderId}`);
          return { ...request, sender: response.data };
        })
      );
      setRequestState(detailedRequests);
    } catch (error) {
      console.error("Error fetching request details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const acceptFollowRequest = async (requestId, senderId) => {
    try {
      await axios.post('/api/accept-follow-request', { requestId, senderId, userId });
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  const declineFollowRequest = async (requestId) => {
    try {
      await axios.post('/api/decline-follow-request', { requestId });
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {requestState.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <Image
              src={request.sender?.profilePictureUrl || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="font-semibold block">
                {request.sender?.fullName || "Unknown"}
              </span>
              <span className="text-sm text-gray-500">
                {request.sender?.registrationNumber}
              </span>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => acceptFollowRequest(request.id, request.senderId)}>
              <Image
                src="/accept.png"
                alt="Accept"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
            <button onClick={() => declineFollowRequest(request.id)}>
              <Image
                src="/reject.png"
                alt="Reject"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;