import { getUserData } from "@/lib/actions"
const page = async () => {
    const userData = await getUserData(2)
    console.log(userData)
  return (
    <div>page</div>
  )
}

export default page