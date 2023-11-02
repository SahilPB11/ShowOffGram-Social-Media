import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

export const INITIAL_USER = {
    id: "",
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
}

const AuthConext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [iseLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const checkAuthUser = async () => {
        try {
            const currectAccount = await getCurrentUser();
            if(currectAccount) {
                setUser({
                    id: currectAccount.$id,
                    name: currectAccount.name,
                    username: currectAccount.username,
                    email: currectAccount.email,
                    imageUrl: currectAccount.imageUrl,
                    bio: currectAccount.bio 
                })
            }
        } catch (error) {
           console.log(error);
           return false;
            finally{
                setIsLoading(false);
            }
        }
     };
    const value = {
        user, setUser,
        iseLoading,
        isAuthenticated, setIsAuthenticated,
        checkAuthUser
    }

    return <AuthConext.Provider value={value}>{children}</AuthConext.Provider>;
};

export default authConext;
