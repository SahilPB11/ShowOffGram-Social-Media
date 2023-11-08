import { useToast } from "@/components/ui/use-toast"
import Loader from "@/components/shared/Loader"
import UserCard from "@/components/shared/UserCard"
import { useGetAllusers } from "@/lib/react-query/queriesAndMutation"

const AllUsers = () => {
    const { toast } = useToast();

    const { data: creators, isError: isErrorCreators, isPending } = useGetAllusers();

    if (isErrorCreators) {
        toast({ title: "Something went wrong" });
        return;
    }
    return (
        // this page is showing all the users and using useCrad component for showing
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isPending && !creators ? (
                    <Loader />
                ) : (
                    <ul className="user-grid">
                        {creators?.documents?.map((creator) => (
                            <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                                <UserCard user={creator} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AllUsers
