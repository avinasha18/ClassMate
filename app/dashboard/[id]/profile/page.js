import UserProfile from '@/components/UserProfile';
import UserPosts from '@/components/UserPosts/UserPosts';
export default function ProfilePage({ params }) {
  return (
  <>
    <UserProfile userId={params.id} />
      
  </>
);
}