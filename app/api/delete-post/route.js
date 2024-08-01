import prisma from "@/prisma/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is not valid' }, { status: 400 });
    }

    // Call the function to delete the post
    await deletePost(id);

    // Return a success response
    return NextResponse.json({ status: 200, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
  }
}

const deletePost = async (postId) => {
  // Delete comments related to the post first
  await prisma.comment.deleteMany({
    where: { postId: parseInt(postId) }
  });

  // Then delete the post
  await prisma.post.delete({
    where: { id: parseInt(postId) }
  });
};
