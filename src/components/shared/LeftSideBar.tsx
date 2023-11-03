import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutation'
import { useUserContext } from '@/context/AuthConext';

const LeftSideBar = () => {
    const navigate = useNavigate();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const { user } = useUserContext();
    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess])
    return (
        <div className='leftsidebar'>
            <div className="flex flex-col gap-11">
                <Link to="/" className='flex gap-3 items-center'>
                    <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />

                </Link>

                <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
                    <img src={user?.imageUrl || 'assets/icons/profile-placeholder.svg'} alt="profile" className='h-14 w-14 rounded-full' />
                    <div className="flex flex-col">
                        <p className="body-bold">{user?.name}</p>
                        <p className="small-regular text-light-3">
                            {user.username}
                        </p>
                    </div>
                </Link>
                <ul className='flex flex-col gap-6'>
                    <Link to="/"></Link>

                </ul>
            </div>

        </div>
    )
}

export default LeftSideBar
