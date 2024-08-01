import React from 'react'
import Image from "next/image";

const Post = () => {
    return (
        <div className="flex flex-col gap-4">
          {/* USER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={post.user.avatar || "/assets/profileabhi.png"}
                width={40}
                height={40}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">
               Teja ssri Avinasha 
              </span>
            </div>
            {1 && <PostInfo postId={1} />}
          </div>
          {/* DESC */}
          <div className="flex flex-col gap-4">
            {1 && (
              <div className="w-full min-h-96 relative">
                <Image
                  src={`/assests/profileabhi.png`}
                  fill
                  className="object-cover rounded-md"
                  alt=""
                />
              </div>
            )}
            <p>HI how are you man </p>
          </div>
          {/* INTERACTION */}
          {/* <Suspense fallback="Loading...">
            <PostInteraction
              postId={post.id}
              likes={post.likes.map((like) => like.userId)}
              commentNumber={post._count.comments}
            />
          </Suspense>
          <Suspense fallback="Loading...">
            <Comments postId={post.id} />
          </Suspense> */}
        </div>
      );
}

export default Post