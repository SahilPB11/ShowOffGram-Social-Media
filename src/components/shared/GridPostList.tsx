import { useUserContext } from "./../../context/AuthConext";
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'

type GridPostListProp = {
    posts: Models.Document[];
    showUser?: boolean,
    showState?: boolean
}

const GridPostList = ({ posts, showUser = true, showState = true }: GridPostListProp) => {
    // console.log(posts);

    const { user } = useUserContext();
    return (
        <ul className='grid-container'>
            {posts.map((post: Models.Document) => (
                <li key={post?.$id} className='relative min-w-80 h-80'>
                    <Link to={`/posts/${post?.$id}`} className='grid-post_link'>
                        <img src={post?.imageUrl} alt="post" className='h-full w-full object-cover' />
                    </Link>

                    <div className="grid-post_user">
                        {showUser && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img src={post?.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="creator" className='h-8 w-8 rounded-full' />
                                <p className="line-clamp-1">{post?.creator?.name}</p>
                            </div>
                        )}
                        {showState && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default GridPostList
