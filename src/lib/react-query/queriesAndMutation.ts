import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { createUserAccount, signInAccount } from "../appwrite/api"
import { INewUser } from "@/types"

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