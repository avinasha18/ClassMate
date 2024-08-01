// pages/api/cleanup-stories.js
import prisma from "@/lib/client";
import { deleteCloudinaryImage } from "@/lib/cloudinary-server";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const expiredStories = await prisma.story.findMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });

      for (const story of expiredStories) {
        // Delete from Cloudinary
        await deleteCloudinaryImage(story.cloudinaryPublicId);

        // Delete from database
        await prisma.story.delete({
          where: { id: story.id }
        });
      }

      res.status(200).json({ message: `Cleaned up ${expiredStories.length} expired stories` });
    } catch (error) {
      console.error('Error in cleanup job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}