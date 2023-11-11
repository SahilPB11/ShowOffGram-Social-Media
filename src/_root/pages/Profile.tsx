import { useEffect } from "react"
import { Route, Routes, Link, Outlet, useParams, useLocation, } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthConext";
import { useGetProfileUserInfinitePosts, useGetUserById } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import LikedPosts from "./LikedPosts";
import { useInView } from "react-intersection-observer";
interface stateBlockProps {
    value: string | number;
    label: string;
}

const StatBlock = ({ value, label }: stateBlockProps) => (
    <div className="flex-center gap-2">
        <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
        <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
)

const Profile = () => {
    const { ref, inView } = useInView();

    const { id } = useParams();
    const { user } = useUserContext();
    const { pathname } = useLocation();

    const { data: currentUser } = useGetUserById(id || '');
    const { data: userProfilePosts, fetchNextPage, hasNextPage } = useGetProfileUserInfinitePosts(id || '');
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage]);

    // first fecth the pages data
    const allPosts = userProfilePosts?.pages?.filter((item) => item)?.map((item) => item?.documents)?.reduce((accum = [], currentValue) => [...accum, ...currentValue]);

    if (!currentUser) {
        return (
            <div className="flex-center w-full h-full">
                <Loader />
            </div>
        )
    }
    // this is for showing profile page which would be user and also people
    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
                    <img src={currentUser?.imageUrl || "assets/icons/profile-placeholder.svg"} alt="profile"
                        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
                    />
                    {/* here in this section i am showing information related its account like folowers and many more */}
                    <div className="flex flex-col flex-1 justify-between mf:mt-2">
                        {/* here i amshowing the name and username  */}
                        <div className="flex flex-col w-full">
                            <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                                {currentUser?.name}
                            </h1>
                            <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                                @{currentUser?.username}
                            </p>
                        </div>

                        {/* here i am shoing the  user posts length followers and following numbers */}
                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                            <StatBlock value={currentUser?.posts?.length} label="Posts" />
                            <StatBlock value={20} label="Followers" />
                            <StatBlock value={20} label="Following" />
                        </div>

                        {/* here i am showing the bio of the profile user */}
                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                            {currentUser?.bio}
                        </p>

                    </div>

                    {/* here i am adding condition if user is someone else i am showing the edit profile button  otherwise if its user id then the button is visible */}
                    <div className="flex justify-center gap-4">
                        {/* here i am adding condition if user is someone else i am not showing the button of follow otherwise if its user id then the follow button stay hidden */}
                        <div className={`${user?.id !== currentUser?.$id && "hidden"}`} >
                            <Link to={`/update-profile/${currentUser?.$id}`}
                                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser?.$id && "hidden"}`}
                            >
                                <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
                                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
                            </Link>
                        </div>

                        <div className={`${user?.id === id && "hidden"}`}>
                            <Button type="button" className="shad-button_primary px-8">
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


            {/* here i am showing the button of posts, liked-posts, if its the user id */}
            {currentUser?.$id === user.id && (
                <div className="flex max-w-5xl w-full">
                    {/* this is for posts pages */}
                    <Link to={`/profile/${id}`} className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}>
                        <img src={"/assets/icons/posts.svg"}
                            alt="posts"
                            width={20}
                            height={20}
                        />
                        Posts
                    </Link>

                    {/* this is for liked posts */}
                    <Link to={`/profile/${id}/liked-post`} className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
                        }`}>
                        <img src={"/assets/icons/like.svg"} alt="like" width={20} height={20} />
                        Liked Posts
                    </Link>
                </div>
            )}


            <Routes>
                <Route index element={allPosts && <GridPostList posts={allPosts || []} showUser={true} />} />
                {currentUser?.$id === user?.id && (
                    <Route path="/liked-post" element={<LikedPosts />} />
                )}
            </Routes>
            <Outlet />

            {hasNextPage && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Profile