import { User } from "@prisma/client";
import FriendRequests from "./FriendRequest";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";
import { Suspense } from "react";
import FollowSuggestions from "../Feed/FollowSuggestions";

const RightMenu = ({ id,userData }) => {
  return (
    <div className="flex flex-col gap-6">
      {userData ? (
        <>
          <Suspense fallback="loading...">
            <UserInfoCard user={userData} />
          </Suspense>
          <Suspense fallback="loading...">
            <UserMediaCard user={userData} />
          </Suspense>
          <Suspense fallback="loading...">
          <FriendRequests user={userData} />
          </Suspense>
        </>
      ) : null}
     
      {/* <FollowSuggestions /> */}
    </div>
  );
};

export default RightMenu;
