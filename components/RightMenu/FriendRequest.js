import Image from "next/image";
import prisma from "@/prisma/db/prisma";
import Link from "next/link";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = async ({user}) => {
  if (!user.id) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: user.id,
    },
    select: {
      id: true,
      senderId: true,
    },
  });

  if (requests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      <FriendRequestList userId={user.id} requests={requests}/>
    </div>
  );
};

export default FriendRequests;