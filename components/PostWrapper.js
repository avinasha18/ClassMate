import { getPosts } from '@/lib/actions';
import Post from './Post';

export default async function PostWrapper({ postId, currentUserId }) {
  const post = await getPosts(postId);
  return <Post post={post} currentUserId={currentUserId} />;
}