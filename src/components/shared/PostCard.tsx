import { useUserContext } from '@/context/AuthContext'
import { timeAgo } from '@/lib/utils'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { IRecentPost } from '@/types'

const PostCard = ({ post }: { post: IRecentPost }) => {
  const { user } = useUserContext()


  if (!post.name) return

  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to={`/profile/${post.creator}`}>
            <img src={post?.userImage || 'assets/images/profile.jpg'} alt="user photo" className='rounded-full w-12 h-12 object-cover' />
          </Link>

          <div className='flex flex-col'>
            <p className='base-medium lg:body-bold text-light-1'>
              {post?.name}
            </p>

            <div className='flex-center gap-2 text-light-3'>
              <p className='subtle-semibold lg:small-regular'>
                {timeAgo(post.createdAt.seconds)}
              </p>
              -
              <p className='subtle-semibold lg:small-regular'>
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.postId}`}
          className={`brightness-50 hover:filter-none ${user.id !== post.creator && 'hidden'}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit icon" width={30} />
        </Link>
      </div>

      <Link to={`/posts/${post.postId}`}>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post.caption}</p>
          <ul className='flex gap-1 mt-2'>
            {post.tags?.map((tag: string) => (
              <li key={tag} className='text-light-3'>
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="post image" className='post-card_img' />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard