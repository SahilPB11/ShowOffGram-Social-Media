import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPost, useGetAllusers } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react"


const Home = () => {
    const { ref, inView } = useInView();

    // const { data: posts, isPending: isPostLoading, isError: isErrorPost } = useGetRecentPost();

    const { data: posts, fetchNextPage, hasNextPage, isPending: isPostLoading, isError: isErrorPost } = useGetRecentPost();

    const { data: AllUsers, isPending: isUsersPending, isError: isErrorUsers } = useGetAllusers();

    // first fecth the pages data
    let pagesData = posts?.pages?.filter((item) => item);
    // here i am fetching the documents from from pagaData
    let documenstData = pagesData?.map((item) => item?.documents);
    // fetch All Posts
    let allPosts = documenstData?.reduce((accum = [], currentValue) => [...accum, ...currentValue], [])

    useEffect(() => {
        console.log("hii");

        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView]);


    if (isErrorPost || isErrorUsers) {
        return (
            <div className="flex flex-1">
                <div className="home-container">
                    <p className="body-medium text-light-1">Something Bad Happend</p>
                </div>
                <div className="home-creators">
                    <p className="body-medium text-light-1">Something Bad Happend</p>
                </div>
            </div>
        )
    }
    //  here we are showing the posts and also uses on right side
    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
                    {isPostLoading && !posts ? (
                        <Loader />
                    ) : (
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                            {allPosts?.map((post: Models.Document) => (
                                <li key={post.$id} className="flex justify-center w-full">
                                    <PostCard post={post} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {hasNextPage && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
            </div>

            <div className="home-creators">
                <h3 className="h3-bold text-light-1">Top Creators</h3>
                {isUsersPending && !AllUsers ? (
                    <Loader />
                ) : (
                    <ul className="grid 2xl:grid-cols-2 gap-6">
                        {AllUsers?.documents?.map((creator) => (
                            <li key={creator?.$id}>
                                <UserCard user={creator} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

         
        </div>
        
    )
}

export default Home