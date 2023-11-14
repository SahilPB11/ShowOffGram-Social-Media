import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "./AuthContextTypes";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};

const AuthConext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const checkAuthUser = async () => {
        try {
            setIsLoading(true);
            const currectAccount = await getCurrentUser();
            if (currectAccount) {
                setUser({
                    id: currectAccount.$id,
                    name: currectAccount.name,
                    username: currectAccount.username,
                    email: currectAccount.email,
                    imageUrl: currectAccount.imageUrl,
                    bio: currectAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (
            localStorage.getItem("cookieFallback") === "[]" ||
            localStorage.getItem("cookieFallback") === null
        ) navigate("/sign-in");
        checkAuthUser();
    }, []);
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return <AuthConext.Provider value={value}>{children}</AuthConext.Provider>;
};

export const useUserContext = () => useContext(AuthConext);
export default AuthProvider;
