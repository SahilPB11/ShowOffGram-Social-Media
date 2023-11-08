import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createPost, createUserAccount, deletePost, deleteSavedPost, getAllusers, getCurrentUser, getInfinitePost, getPostById, getPostsByUserId, getRecentPosts, getUserById, likePost, savePost, searchedPosts, signInAccount, signOutAccount, updatePost, updateUser } from "../appwrite/api"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
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

// useLikes post
export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, likesArray} : {postId: string, likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

// use Save post
export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, userId} : {postId: string, userId: string}) => savePost(postId, userId),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

// use Delete Save post
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

// get current user
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

// find post by id
export const useGetPostById = (postId : string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

// update Post
export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (post : IUpdatePost) =>  updatePost(post),
        onSuccess : (data) => {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
         });
        },
    })
}

// delete post
export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ({postId, imageId} : {postId : string, imageId : string}) => deletePost(postId, imageId),
        onSuccess : () => {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
        },
    })
}

// search infinite post 
export const useGetPost = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage?.documents?.length === 0) return null;

            const lastid = lastPage?.documents[lastPage?.documents?.length - 1].$id;
            return lastid;
        }
    })
}

// use search post 
export const useSearchPosts = (searchTerm : string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchedPosts(searchTerm),
        enabled: !!searchTerm
    })
}

// get user by post id
export const useGetPostsByUserId = (userId : string)=> {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, getPostsByUserId],
        queryFn: () => getPostsByUserId(userId),
        enabled: !!userId
    })
}

// here i am finding the User by its id
export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, getUserById],
        queryFn: () => getUserById(userId),
        enabled: !! userId
    })

}

// here i am updating the user Profile
export const useUpdateuser = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : (user : IUpdateUser) =>  updateUser(user),
        onSuccess : (data) => {
                queryClient.invalidateQueries({
                  queryKey: [QUERY_KEYS.GET_CURRENT_USER],
         });
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
         })
        },
    })
}

// get all users to show the list
export const useGetAllusers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getAllusers()
    })
}
