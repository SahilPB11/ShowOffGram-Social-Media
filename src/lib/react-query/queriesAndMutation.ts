import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createPost, createUserAccount, getRecentPosts, signInAccount, signOutAccount } from "../appwrite/api"
import { INewPost, INewUser } from "@/types"
import { QUERY_KEYS } from "./querKeys"

// here we are creating the user via react-query
export const userCreteUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

// here when user sign in then react query automatically handle the session
export const userUseSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) => signInAccount(user)
    })
}

// this function for signout from page
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const querClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            querClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }

    })
}

// get recent post
export const useGetRecentPost = () => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn : getRecentPosts
    })
}