import Image from "next/image";
import Link from "next/link";
import prisma from "@/prisma/db/prisma";

const UserMediaCard = async ({ user }) => {
  const postsWithMedia = await prisma.Post.findMany({
    where: {
      userId: user.id,
      imageUrl: {
        not: null,
      },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithMedia.length
          ? postsWithMedia.map((post) => (
              <div className="relative w-1/5 h-24" key={post.id}>
                <Image
                  src={post.imageUrl}
                  alt=""
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))
          : "No media found!"}
      </div>
    </div>
  );
};

export default UserMediaCard;
