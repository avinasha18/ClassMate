import { getPosts } from "@/lib/actions"
import Image from "next/image"
const UserPosts = async ({id}) => {
    console.log(id)
    const data = await getPosts(id)
    console.log(data)
    if(!data) return <p>Loading..</p>
  return (
    <div>
      {
        data.content &&(
          <>
          <h1>{data[0].content}</h1>
          <Image src={data[0].imageUrl} width={820} height={620}/>
          </>
        )
      }
       
    </div>
  )
}

export default UserPosts