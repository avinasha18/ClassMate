// app/dashboard/[id]/page.js
import UserNavbar from "@/components/UserNavbar"
import Feed from "@/components/Feed/Feed"
import { getUserData } from "@/lib/actions"
import AddPost from "@/components/Feed/AddPost"
import LeftMenu from "@/components/LeftMenu/LeftMenu"
import RightMenu from "@/components/RightMenu/RightMenu"
import Stories from "@/components/Stories/Stories"

const dashboard = async ({params}) => {
  const userData = await getUserData(params.id);
  return (
    <>
      <UserNavbar id={params.id} userData={userData} />
      <div className="bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-screen">
        <div className="flex gap-6 pt-6">
          <div className="hidden xl:block w-[20%]">
            <LeftMenu type="home" id={params.id} userData={userData} />
          </div>
          <div className="w-full lg:w-[70%] xl:w-[50%]">
            <div className="flex flex-col gap-6">
              <Stories id={params.id} userData={userData} />
              <AddPost id={params.id} userData={userData}/>
              <Feed id={params.id} userData={userData} />
            </div>
          </div>
          <div className="hidden lg:block w-[30%]">
            <RightMenu id={params.id} userData={userData} />
          </div>
        </div>
      </div>
    </>
  )
}

export default dashboard