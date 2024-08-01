import { User } from "@prisma/client";
import prisma from "@/prisma/db/prisma";
import Image from "next/image";
import Link from "next/link";
import UserInfoCardInteraction from "./UserInfoInteraction";
import UpdateUser from "./UpdateUser";

const UserInfoCard = async ({ user }) => {
  const createdAtDate = new Date(user.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedDate1Fun = ()=> {
    let formattedDate1;
    if(user.registrationNumber.substring(2)== "20"){
      formattedDate1 = 2020
    }
    else if(user.registrationNumber.substring(2)== "22"){
      formattedDate1=  2022
    }
    else {
      formattedDate1 = 2024
    }
    
  }
  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const  userId = user.id;
  const currentUserId = userId;

  if (currentUserId) {
    const blockRes = await prisma.BlockedAccount.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });

    blockRes ? (isUserBlocked = true) : (isUserBlocked = false);
    const followRes = await prisma.UserFollow.findFirst({
      where: {
        followingId: user.id,
      },
    });

    followRes ? (isFollowing = true) : (isFollowing = false);
    const followReqRes = await prisma.UserFollow.findFirst({
      where: {
        followingId: currentUserId,
      },
    });

    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false);
  }
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        {currentUserId === user.id ? (
          <UpdateUser user={user}/>
        ) : (
          <Link href="/" className="text-blue-500 text-xs">
            See all
          </Link>
        )}
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">
            {" "}
           {
            user.fullName
           }
          </span>
          <span className="text-sm">@{user.registrationNumber}</span>
        </div>
        {user.description && <p>{user.bio}</p>}
        {/* {user.city && (
          <div className="flex items-center gap-2">
            <Image src="/map.png" alt="" width={16} height={16} />
            <span>
              Living in <b>{user.city}</b>
            </span>
          </div>
        )} */}
        {user.college && (
          <div className="flex items-center gap-2">
            <Image src="/school.png" alt="" width={16} height={16} />
            <span>
              Went to <b>{user.college.substring(0,4)}</b>
            </span>
          </div>
        )}
        {user.work && (
          <div className="flex items-center gap-2">
            <Image src="/work.png" alt="" width={16} height={16} />
            <span>
              Works at <b>{user.work}</b>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <Image src="/link.png" alt="" width={16} height={16} />
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <Image src="/date.png" alt="" width={16} height={16} />
            <span>Joined {user.registrationNumber.substring(0,2)== "22" ? 2022 : 2024}</span>
          </div>
        </div>
        {currentUserId && currentUserId !== user.id && (
          <UserInfoCardInteraction
            userId={user.id}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          />
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
